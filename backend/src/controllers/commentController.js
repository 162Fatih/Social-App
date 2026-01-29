const Comment = require("../models/Comment");

const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.params.postId,
      user: req.user.id,
      text: req.body.text,
      parentComment: req.body.parentComment || null,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Yorum eklenemedi" });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
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
      // unlike
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // like
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

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Yorum bulunamadı" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Yetkin yok" });
    }

    await comment.deleteOne();

    res.json({ message: "Yorum silindi" });
  } catch (error) {
    res.status(500).json({ message: "Yorum silinemedi" });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
  likeComment,
};
