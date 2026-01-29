const express = require("express");
const router = express.Router();
const { createPost, getPosts, getExplore, likePost, deletePost } = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getPosts);
router.get("/explore", authMiddleware, getExplore);
router.put("/:id/like", authMiddleware, likePost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
