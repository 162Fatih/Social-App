const Comment = require("../models/Comment");
const Post = require("../models/Post");
const fs = require("fs"); // Dosya sistemi modülünü en üste eklemeyi unutma
const path = require("path");

const addComment = async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    const { postId } = req.params;
    const userId = req.user.id;

    // Multer'dan gelen resim dosyasının yolu (Eğer yüklendiyse)
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const comment = await Comment.create({
      post: postId,
      user: userId,
      text,
      image: imagePath,
      parentComment: parentComment || null,
    });

    // Post modelindeki yorum sayısını 1 artırıyoruz
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    // Frontend'de anlık göstermek için user bilgisini dolduruyoruz
    const populatedComment = await comment.populate(
      "user",
      "username profileImage",
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Yorum Hatası:", error);
    res.status(500).json({ message: "Yorum eklenemedi" });
  }
};

/*const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username profileImage") // Profil resmini de çektik
      .sort({ createdAt: -1 }); // En yeni yorum en üstte (X tarzı)

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Yorumlar alınamadı" });
  }
};*/

const getComments = async (req, res) => {
  try {
    // Kullanıcı giriş yapmışsa ID'sini al, yoksa null
    const currentUserId = req.user ? req.user._id.toString() : null;

    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 });

    // Yorumları frontend'in ihtiyaç duyacağı ek bilgilerle formatlayalım
    const formattedComments = comments.map((comment) => {
      // populate edilen user objesinin varlığını kontrol edelim (güvenlik için)
      const commentUser = comment.user || {};

      return {
        ...comment._doc,
        // Yorumun sahibi şu anki kullanıcı mı? (Silme butonu gösterimi için)
        isOwner: currentUserId
          ? commentUser._id?.toString() === currentUserId
          : false,
        // Eğer yorumlarda beğeni sistemi varsa buraya eklenebilir:
        // likedByCurrentUser: currentUserId ? comment.likes.includes(currentUserId) : false,

        // Resim yolu düzeltmesi (backend'de statik klasör kullanıyorsan)
        image: comment.image,
      };
    });

    res.json(formattedComments);
  } catch (error) {
    console.error("Yorum getirme hatası:", error);
    res.status(500).json({ message: "Yorumlar alınamadı" });
  }
};

const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Yorum bulunamadı" });
    }

    const userId = req.user.id;
    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      likesCount: comment.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({ message: "Yorum beğenilemedi" });
  }
};

/*const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Yorum bulunamadı" });
    }

    // Yetki kontrolü (Sadece yorum sahibi silebilir)
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    // --- KRİTİK GÜNCELLEME ---
    // Yorum silinmeden önce bağlı olduğu postun commentsCount değerini 1 azalt
    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 },
    });

    // Varsa resmini sil (Opsiyonel)
    if (comment.image) {
      // resim silme mantığı buraya...
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Yorum başarıyla silindi" });
  } catch (error) {
    console.error("Yorum silme hatası:", error);
    res.status(500).json({ message: "Yorum silinemedi" });
  }
};*/

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Yorum bulunamadı" });
    }

    // Yetki kontrolü (Sadece yorum sahibi silebilir)
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    // 1. Post modelindeki yorum sayısını 1 azalt
    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 },
    });

    // 2. Varsa sunucudaki resmi sil
    if (comment.image) {
      // comment.image: "/uploads/resim-adi.png" formatında olduğu için
      // başındaki "/" işaretini temizleyerek dosya yolunu oluşturuyoruz
      const filePath = path.join(__dirname, "..", "..", comment.image);
      // Not: .. / .. kısmı controller dosyanın konumuna göre değişebilir.
      // Eğer controller "src/controllers" içindeyse ana dizindeki uploads'a böyle gidilir.

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Dosya silme hatası (Sunucu):", err);
          // Dosya bulunamazsa bile yorumu silmeye devam etmek için return yapmıyoruz
        } else {
          console.log("Dosya başarıyla sunucudan silindi:", filePath);
        }
      });
    }

    // 3. Veritabanından yorumu sil
    await comment.deleteOne();

    res.status(200).json({ message: "Yorum başarıyla silindi" });
  } catch (error) {
    console.error("Yorum silme hatası:", error);
    res.status(500).json({ message: "Yorum silinemedi" });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
  likeComment,
};
