const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getExplore,
  likePost,
  deletePost,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const exploreAuthMiddleware = require("../middleware/exploreAuthMiddleware");

router.get("/", authMiddleware, getPosts);
router.get("/home", authMiddleware, getPosts);
router.get("/explore", exploreAuthMiddleware, getExplore);
router.post("/create", authMiddleware, createPost);
router.put("/:id/like", authMiddleware, likePost);
router.delete("/delete/:id", authMiddleware, deletePost);

module.exports = router;
