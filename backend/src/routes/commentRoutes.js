const express = require("express");
const router = express.Router();
const {
  addComment,
  getComments,
  deleteComment,
  likeComment,
} = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware"); // Ortak dosyadan çekiyoruz

// Yorum ekleme - Resim desteği aktif
router.post("/:postId", authMiddleware, upload.single("image"), addComment);

router.get("/:postId", /*authMiddleware,*/ getComments);
router.delete("/:id", authMiddleware, deleteComment);
router.put("/:id/like", authMiddleware, likeComment);

module.exports = router;
