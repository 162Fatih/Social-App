const Post = require("../models/Post");
const Comment = require("../models/Comment");
const fs = require("fs");
const path = require("path");

const createPost = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { text } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    if (!text && !imagePath) {
      return res
        .status(400)
        .json({ message: "Post içeriği tamamen boş olamaz." });
    }

    const post = await Post.create({
      user: userId,
      text: text || "",
      image: imagePath,
    });

    res.status(201).json({
      _id: post._id,
      username: req.user.username,
      text: post.text,
      image: post.image,
      likesCount: 0,
      commentsCount: 0, // Yeni postta 0 yorum vardır
    });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: "Post oluşturulamadı" });
  }
};

const getPosts = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const posts = await Post.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    const postsWithLikeInfo = posts.map((post) => {
      const likedByCurrentUser = userId
        ? post.likes.some((id) => id.toString() === userId)
        : false;

      const isOwner = userId ? post.user._id.toString() === userId : false;

      return {
        _id: post._id,
        userId: post.user._id,
        username: post.user.username,
        text: post.text,
        image: post.image ? `http://localhost:5000${post.image}` : null,
        likesCount: post.likes.length,
        commentsCount: post.commentsCount || 0, // BURASI EKLENDİ
        likedByCurrentUser,
        isOwner: isOwner,
        createdAt: post.createdAt,
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

    const postsWithLikeInfo = posts.map((post) => {
      const likedByCurrentUser = userId
        ? post.likes.some((id) => id.toString() === userId)
        : false;

      const isOwner = userId ? post.user._id.toString() === userId : false;

      return {
        _id: post._id,
        userId: post.user._id,
        username: post.user.username,
        text: post.text,
        image: post.image ? `http://localhost:5000${post.image}` : null,
        likesCount: post.likes.length,
        commentsCount: post.commentsCount || 0, // BURASI EKLENDİ
        likedByCurrentUser,
        isOwner: isOwner,
        createdAt: post.createdAt,
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

    const userId = req.user._id.toString();

    const alreadyLiked = post.likes.some(
      (likedUserId) => likedUserId.toString() === userId,
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

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

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Yetkin yok" });
    }

    if (post.image) {
      const imagePath = path.join(process.cwd(), post.image);

      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(imagePath, (err) => {
            if (err) console.error("Resim dosyası silinirken hata:", err);
          });
        }
      });
    }

    await post.deleteOne();

    res.status(204).end();
  } catch (error) {
    console.error("Silme hatası:", error);
    res.status(500).json({ message: "Post silinemedi" });
  }
};

const getLikedPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id.toString();

    const likedPosts = await Post.find({ likes: userId })
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 });

    const formattedPosts = likedPosts.map((post) => {
      return {
        _id: post._id,
        userId: post.user._id,
        username: post.user.username,
        profileImage: post.user.profileImage,
        text: post.text,
        image: post.image ? `http://localhost:5000${post.image}` : null,
        likesCount: post.likes.length,
        commentsCount: post.commentsCount || 0, // BURASI EKLENDİ
        likedByCurrentUser: currentUserId
          ? post.likes.some((id) => id.toString() === currentUserId)
          : false,
        isOwner: post.user._id.toString() === currentUserId,
        createdAt: post.createdAt,
      };
    });

    res.status(200).json(formattedPosts);
  } catch (error) {
    res.status(500).json({
      message: "Beğenilen postlar getirilemedi",
      error: error.message,
    });
  }
};

// const getPostById = async (req, res) => {
//   try {
//     const userId = req.user._id.toString();

//     // ID'ye göre postu bul ve kullanıcı bilgilerini çek
//     const post = await Post.findById(req.params.id).populate(
//       "user",
//       "username email profileImage",
//     );

//     if (!post) {
//       return res.status(404).json({ message: "Post bulunamadı" });
//     }

//     // Diğer listeleme fonksiyonlarındaki veri yapısının aynısını kuruyoruz
//     const likedByCurrentUser = userId
//       ? post.likes.some((id) => id.toString() === userId)
//       : false;

//     const isOwner = post.user._id.toString() === userId;

//     const formattedPost = {
//       _id: post._id,
//       userId: post.user._id,
//       username: post.user.username,
//       profileImage: post.user.profileImage, // Varsa profil resmi
//       text: post.text,
//       image: post.image ? `http://localhost:5000${post.image}` : null,
//       likesCount: post.likes.length,
//       commentsCount: post.commentsCount || 0,
//       likedByCurrentUser,
//       isOwner: isOwner,
//       createdAt: post.createdAt,
//     };

//     res.json(formattedPost);
//   } catch (error) {
//     console.error("Post getirme hatası:", error);
//     res.status(500).json({ message: "Post alınamadı" });
//   }
// };

/*const getPostById = async (req, res) => {
  try {
    // 1. Kullanıcı varsa ID'sini al, yoksa null bırak
    // req.user?._id kullanmak, user undefined olsa bile hata vermesini engeller
    const userId = req.user ? req.user._id.toString() : null;

    // 2. ID'ye göre postu bul ve kullanıcı bilgilerini çek
    const post = await Post.findById(req.params.id).populate(
      "user",
      "username email profileImage",
    );

    if (!post) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    // 3. likedByCurrentUser: Kullanıcı varsa ve beğenmişse true döner
    const likedByCurrentUser = userId
      ? post.likes.some((id) => id.toString() === userId)
      : false;

    // 4. isOwner: Kullanıcı varsa ve postun sahibi ise true döner
    const isOwner = userId ? post.user._id.toString() === userId : false;

    const formattedPost = {
      _id: post._id,
      userId: post.user._id,
      username: post.user.username,
      profileImage: post.user.profileImage,
      text: post.text,
      image: post.image ? `http://localhost:5000${post.image}` : null,
      likesCount: post.likes.length,
      commentsCount: post.commentsCount || 0,
      likedByCurrentUser,
      isOwner: isOwner,
      createdAt: post.createdAt,
    };

    res.json(formattedPost);
  } catch (error) {
    console.error("Post getirme hatası:", error);
    res.status(500).json({ message: "Post alınamadı" });
  }
};*/

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Postu bul ve kullanıcı bilgilerini çek
    const post = await Post.findById(id).populate(
      "user",
      "username profileImage",
    );

    // 2. Eğer post yoksa güvenli bir şekilde 404 dön
    if (!post) {
      console.log(`Hata: ${id} ID'li post veritabanında mevcut değil.`);
      return res.status(404).json({ message: "Gönderi bulunamadı" });
    }

    // 3. Kimlik tespiti (Middleware'den gelen)
    const currentUserId = req.user ? req.user.id || req.user._id : null;

    // Post sahibi tespiti (Populate gelmezse userId fallback'i ile)
    const postOwnerId = post.user?._id || post.userId;

    // 4. Veriyi Frontend'in beklediği formatta paketle
    const formattedPost = {
      ...post._doc,
      // Sayısal değerlerin NaN olmasını engellemek için varsayılan değerler
      likesCount: post.likes ? post.likes.length : 0,
      commentsCount: post.commentsCount || 0,

      // Sahiplik kontrolü
      isOwner:
        currentUserId && postOwnerId
          ? postOwnerId.toString() === currentUserId.toString()
          : false,

      // Beğeni kontrolü
      likedByCurrentUser:
        currentUserId && post.likes
          ? post.likes.some((l) => l.toString() === currentUserId.toString())
          : false,
    };

    // 5. Temiz veriyi gönder
    return res.status(200).json(formattedPost);
  } catch (error) {
    console.error("Post getirme hatası (Server):", error);
    // Eğer ID formatı yanlışsa (CastError) 404 dönmesi daha mantıklıdır
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Geçersiz gönderi kimliği" });
    }
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

const getLikedContent = async (req, res) => {
  try {
    const { userId } = req.params; // Profiline bakılan kullanıcı ID'si
    const currentUserId = req.user._id.toString(); // Giriş yapmış (senin) kullanıcı ID'n

    // 1. Beğenilen Postları Çek
    const likedPosts = await Post.find({ likes: userId })
      .populate("user", "username profileImage")
      .lean();

    // 2. Beğenilen Yorumları Çek
    const likedComments = await Comment.find({ likes: userId })
      .populate("user", "username profileImage")
      .lean();

    // 3. Postları Formatla
    const formattedPosts = likedPosts.map((p) => {
      const likedByCurrentUser = p.likes.some(
        (id) => id.toString() === currentUserId,
      );
      const isOwner = p.user?._id?.toString() === currentUserId;

      return {
        _id: p._id,
        userId: p.user?._id,
        username: p.user?.username,
        profileImage: p.user?.profileImage,
        text: p.text,
        image: p.image ? `http://localhost:5000${p.image}` : null,
        likesCount: p.likes.length,
        commentsCount: p.commentsCount || 0,
        likedByCurrentUser: likedByCurrentUser,
        isOwner: isOwner,
        createdAt: p.createdAt,
        isComment: false,
      };
    });

    // 4. Yorumları Formatla
    const formattedComments = likedComments.map((c) => {
      const likedByCurrentUser = c.likes.some(
        (id) => id.toString() === currentUserId,
      );
      const isOwner = c.user?._id?.toString() === currentUserId;

      return {
        _id: c._id,
        userId: c.user?._id,
        username: c.user?.username,
        profileImage: c.user?.profileImage,
        text: c.text,
        image: c.image ? `http://localhost:5000${c.image}` : null,
        likesCount: c.likes.length,
        repliesCount: 0,
        likedByCurrentUser: likedByCurrentUser,
        isOwner: isOwner,
        createdAt: c.createdAt,
        isComment: true,
      };
    });

    // 5. Birleştir ve Tarihe Göre Sırala
    const allLiked = [...formattedPosts, ...formattedComments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.json(allLiked);
  } catch (error) {
    console.error("getLikedContent Hatası:", error);
    res.status(500).json({ message: "Beğeniler getirilemedi" });
  }
};

module.exports = {
  createPost,
  getPosts,
  getExplore,
  likePost,
  deletePost,
  /*getLikedPosts,*/
  getPostById,
  getLikedContent,
};
