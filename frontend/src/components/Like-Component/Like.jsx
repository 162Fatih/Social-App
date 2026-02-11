import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/Like.css";

export default function Like({ postId, likedByCurrentUser, likesCount }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(likesCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    const prevLiked = isLiked;
    const prevCount = likeCount;

    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await api.put(`/posts/${postId}/like`);

      setIsLiked(res.data.liked);
      setLikeCount(res.data.likesCount);
    } catch (error) {
      console.error("Beğeni hatası:", error);

      // rollback
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleLikeClick}
      className={`btn d-flex align-items-center gap-2 border-0 bg-transparent p-0 like-btn
        ${isLiked ? "liked" : ""}
        ${isLoading ? "disabled" : ""}`}
    >
      <i className="bi bi-hand-thumbs-up fs-4"></i>
      <i className="bi bi-hand-thumbs-up-fill fs-4"></i>

      <span className="fw-bold user-select-none">{likeCount}</span>
    </button>
  );
}
