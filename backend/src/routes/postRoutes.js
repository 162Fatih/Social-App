const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getExplore,
  likePost,
  deletePost,
  /*getLikedPosts,*/
  getPostById,
  getLikedContent,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const exploreAuthMiddleware = require("../middleware/exploreAuthMiddleware");
const upload = require("../middleware/multerMiddleware"); // Ortak multer dosyasını içe aktarıyoruz

// Gönderileri getir (Home)
router.get("/", authMiddleware, getPosts);
router.get("/home", authMiddleware, getPosts);
router.get("/explore", exploreAuthMiddleware, getExplore);

// Yeni gönderi oluştur - Resim desteği upload middleware ile sağlanıyor
router.post("/create", authMiddleware, upload.single("image"), createPost);

// Beğeni ve silme işlemleri
router.put("/:id/like", authMiddleware, likePost);
router.delete("/delete/:id", authMiddleware, deletePost);

// Kullanıcının beğendiği gönderileri getir
/*router.get("/user/:userId/likes", authMiddleware, getLikedPosts);*/
router.get("/user/:userId/likes", authMiddleware, getLikedContent);

router.get("/:id", authMiddleware, getPostById);

module.exports = router;
