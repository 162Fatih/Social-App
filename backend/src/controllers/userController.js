const User = require("../models/User");
const Post = require("../models/Post");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username profileImage")
      .populate("following", "username profileImage");

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // ARTIK BURADA Post.find() YAPMIYORUZ.
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id.toString();

    const posts = await Post.find({ user: userId })
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 });

    const postsWithLikeInfo = posts.map((post) => {
      const likedByCurrentUser = currentUserId
        ? post.likes.some((id) => id.toString() === currentUserId)
        : false;

      const isOwner = currentUserId
        ? post.user._id.toString() === currentUserId
        : false;

      return {
        _id: post._id,
        username: post.user.username,
        profileImage: post.user.profileImage,
        text: post.text,
        image: post.image,
        likesCount: post.likes.length,
        likedByCurrentUser,
        isOwner: isOwner,
        createdAt: post.createdAt,
      };
    });

    // ESKİ HALİNE DÖNDÜRDÜK: Veriyi direkt dizi olarak dönüyoruz
    res.status(200).json(postsWithLikeInfo);
  } catch (error) {
    res.status(500).json({
      message: "Postlar getirilemedi",
      error: error.message,
    });
  }
};

const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Kendini takip edemezsin" });
    }

    const isFollowing = currentUser.following.includes(userToFollow._id);

    if (isFollowing) {
      currentUser.following.pull(userToFollow._id);
      userToFollow.followers.pull(currentUser._id);
    } else {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      message: isFollowing ? "Takipten çıkıldı" : "Takip edildi",
    });
  } catch (error) {
    console.error("FOLLOW ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Kendini takipten çıkamazsın" });
    }

    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user._id },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: req.params.id },
    });

    res.json({ message: "Takip bırakıldı" });
  } catch (error) {
    console.error("UNFOLLOW ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  getUserPosts,
  followUser,
  unfollowUser,
};
