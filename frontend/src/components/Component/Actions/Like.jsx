import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import api from "../../../api/axios";

import "../../../styles/Like.css";

export default function Like({
  postId,
  likedByCurrentUser,
  likesCount,
  isComment = false,
}) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(likesCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLiked(likedByCurrentUser);
    setLikeCount(likesCount);
  }, [likedByCurrentUser, likesCount]);

  const handleLikeClick = async (e) => {
    if (e) e.stopPropagation();

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
      const endpoint = isComment
        ? `/comments/${postId}/like`
        : `/posts/${postId}/like`;
      const res = await api.put(endpoint);

      setIsLiked(res.data.liked);
      setLikeCount(res.data.likesCount);
    } catch (error) {
      console.error("Beğeni hatası:", error);
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={handleLikeClick}
      className={`btn d-flex align-items-center gap-2 border-0 bg-transparent p-0 shadow-none like-btn
        ${isLiked ? "liked" : ""}
        ${theme === "dark" ? "dark-theme" : ""} 
        ${isLoading ? "disabled" : ""}`}
    >
      <i className="bi bi-hand-thumbs-up fs-4 outline-icon"></i>
      <i className="bi bi-hand-thumbs-up-fill fs-4 fill-icon"></i>

      <span className="fw-bold user-select-none like-count">{likeCount}</span>
    </button>
  );
}
