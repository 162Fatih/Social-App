import { useState } from "react";
import { deletePost } from "../../api/post.api";
import { useAuth } from "../../context/AuthContext";

import MeatballsMenu from "../Component/MeatballsMenu";
import UserInfo from "../Component/UserInfo";
import PostContent from "../Component/PostContent";
import PostActions from "../Component/Actions/PostActions";

import "../../styles/PostCard.css";

const formatRelativeTime = (dateString) => {
  if (!dateString) return "Yeni gönderi";

  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInHours = Math.floor(diffInSeconds / 3600);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return "Şimdi";

  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk önce`;

  if (diffInHours < 24) return `${diffInHours} sa önce`;

  if (diffInDays < 7) return `${diffInDays} gün önce`;

  if (diffInDays === 7) return "1 hafta önce";

  return date.toLocaleDateString("tr-TR");
};

export default function PostCard({ post, onUpdate, theme }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!post) return null;

  const handleDelete = async () => {
    if (!window.confirm("Bu postu silmek istediğine emin misin?")) return;
    try {
      setIsDeleting(true);
      await deletePost(post._id);
      onUpdate?.();
    } catch (error) {
      alert("Post silinemedi");
      setIsDeleting(false);
    }
  };

  return (
    <div
      // Bootstrap "card" sınıfını bıraktık ama kendi "post-card" sınıfımızı ekledik
      // theme "dark" ise "dark" class'ını da ekliyoruz
      className={`post-card ${theme === "dark" ? "dark" : ""} ${isDeleting ? "opacity-50" : ""}`}
    >
      <div className="card-body">
        {/* Üst Kısım */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <UserInfo
            userId={post.userId}
            username={post.username}
            profileImage={post.profileImage}
            createdAt={post.createdAt}
            formatTime={formatRelativeTime}
            theme={theme}
          />
          <MeatballsMenu
            isOwner={post.isOwner}
            onDelete={handleDelete}
            theme={theme}
          />
        </div>

        {/* İçerik (Yazı ve Resim) */}
        <div className="post-text">
          <PostContent text={post.text} image={post.image} />
        </div>

        <hr />

        {/* Aksiyonlar */}
        <PostActions
          postId={post._id}
          likedByCurrentUser={post.likedByCurrentUser}
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
          theme={theme}
        />
      </div>
    </div>
  );
}
