const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  followUser,
  unfollowUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:id", authMiddleware, getUserProfile);

router.put("/:id/follow", authMiddleware, followUser);
router.put("/:id/unfollow", authMiddleware, unfollowUser);

module.exports = router;
