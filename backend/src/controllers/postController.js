const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const post = await Post.create({
      user: userId,
      text: req.body.text,
      image: req.body.image || "",
    });

    res.status(201).json({
      _id: post._id,
      username: req.user.username,
      text: post.text,
      image: post.image,
      likesCount: 0,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Post oluşturulamadı" });
  }
};

const getPosts = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const posts = await Post.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    const postsWithLikeInfo = posts.map(post => {
      const likedByCurrentUser = userId
        ? post.likes.some(id => id.toString() === userId)
        : false;

      const isOwner = userId ? post.user._id.toString() === userId : false;

      return {
        _id: post._id,
        username: post.user.username,
        text: post.text,
        image: post.image,
        likesCount: post.likes.length,
        likedByCurrentUser,
        isOwner: isOwner,
      };
    });

    res.json(postsWithLikeInfo);
  } catch (error) {
    res.status(500).json({ message: "Postlar alınamadı" });
  }
};

const getExplore = async (req, res) => {
  try {
    const userId = req.user?._id?.toString();

    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    const postsWithLikeInfo = posts.map(post => {
      const likedByCurrentUser = userId
        ? post.likes.some(id => id.toString() === userId)
        : false;

      const isOwner = userId ? post.user._id.toString() === userId : false;

      return {
        _id: post._id,
        username: post.user.username,
        text: post.text,
        image: post.image,
        likesCount: post.likes.length,
        likedByCurrentUser,
        isOwner: isOwner,
      };
    });

    res.json(postsWithLikeInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Explore alınamadı" });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    //const userId = req.user._id ? req.user._id.toString() : req.user.id.toString();
    const userId = req.user._id.toString();

    const alreadyLiked = post.likes.some(
        (likedUserId) => likedUserId.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    // Frontend'e güncel sayıyı ve durumu dönüyoruz
    res.json({
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });
    
  } catch (error) {
    console.error(error);
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

    //res.json({ message: "Post silindi" });
    res.status(204).end();
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