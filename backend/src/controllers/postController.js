const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      user: req.user._id,
      text: req.body.text,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Post oluşturulamadı" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Postlar alınamadı" });
  }
};

const getExplore = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Explore alınamadı" });
  }
};

/*const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    const userId = req.user.id;

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({ message: "Like işlemi başarısız" });
  }
};*/

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    // Auth middleware'in user objesini nasıl döndürdüğüne bağlı olarak 
    // _id veya id kullan. Garanti olması için string'e çeviriyoruz.
    const userId = req.user._id ? req.user._id.toString() : req.user.id.toString();

    // includes yerine .some() kullanmak daha güvenlidir.
    // Her bir beğeniyi string'e çevirip karşılaştırır.
    const alreadyLiked = post.likes.some(
        (likedUserId) => likedUserId.toString() === userId
    );

    if (alreadyLiked) {
      // UNLIKE: Beğeniyi geri al
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // LIKE: Beğeni ekle
      post.likes.push(userId);
    }

    await post.save();

    // Frontend'e güncel sayıyı ve durumu dönüyoruz
    res.json({
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });
    
  } catch (error) {
    console.error(error); // Hatayı konsola yazdır ki görebilesin
    res.status(500).json({ message: "Like işlemi başarısız" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    // yetki kontrolü
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Yetkin yok" });
    }

    await post.deleteOne();

    res.json({ message: "Post silindi" });
  } catch (error) {
    res.status(500).json({ message: "Post silinemedi" });
  }
};

module.exports = {
  createPost,
  getPosts,
  getExplore,
  likePost,
  deletePost,
};