const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createPost,
  getPosts,
  getExplore,
  likePost,
  deletePost,
  getLikedPosts,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const exploreAuthMiddleware = require("../middleware/exploreAuthMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.get("/", authMiddleware, getPosts);
router.get("/home", authMiddleware, getPosts);
router.get("/explore", exploreAuthMiddleware, getExplore);

router.post("/create", authMiddleware, upload.single("image"), createPost);

router.put("/:id/like", authMiddleware, likePost);
router.delete("/delete/:id", authMiddleware, deletePost);
router.get("/user/:userId/likes", authMiddleware, getLikedPosts);

module.exports = router;
