const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getUserPosts,
  followUser,
  unfollowUser,
  updateSettings,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:id", authMiddleware, getUserProfile);
router.get("/:userId/userposts", authMiddleware, getUserPosts);
router.put("/:id/follow", authMiddleware, followUser);
router.put("/:id/unfollow", authMiddleware, unfollowUser);
router.put("/settings", authMiddleware, updateSettings);
router.delete("/:id/delete", authMiddleware, deleteUser);

module.exports = router;
