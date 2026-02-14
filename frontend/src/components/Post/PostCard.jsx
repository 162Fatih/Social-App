import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Yönlendirme için eklendi
import { deletePost } from "../../api/post.api";
import { addComment } from "../../api/comment.api";
import { useTheme } from "../../context/ThemeContext";
import { formatRelativeTime } from "../Component/DateInfo";

import MeatballsMenu from "../Component/MeatballsMenu";
import UserInfo from "../Component/UserInfo";
import PostContent from "../Component/PostContent";
import PostActions from "../Component/Actions/PostActions";
import CommentModal from "../Comment/CommentModal";

import "../../styles/PostCard.css";

export default function PostCard({ post, onUpdate, isDetailView = false }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [localCommentsCount, setLocalCommentsCount] = useState(
    post?.commentsCount || 0,
  );

  useEffect(() => {
    setLocalCommentsCount(post?.commentsCount || 0);
  }, [post?.commentsCount]);

  if (!post) return null;

  const handleCardClick = () => {
    if (isDetailView || isDeleting) return;
    navigate(`/post/${post._id}`);
  };

  const handleDelete = async (e) => {
    if (e) e.stopPropagation();

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

  const handleCommentSubmit = (commentData) => {
    const { text, image } = commentData;
    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    addComment(post._id, formData)
      .then(() => {
        setLocalCommentsCount((prev) => prev + 1);
        setIsCommentModalOpen(false);
        onUpdate?.();
      })
      .catch((error) => {
        console.error("Yorum hatası:", error);
      });
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`post-card mx-auto w-100 ${theme === "dark" ? "dark" : ""} ${
          isDeleting ? "opacity-50" : ""
        } ${!isDetailView ? "clickable-card" : ""}`}
        style={{ cursor: !isDetailView ? "pointer" : "default" }}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <UserInfo
              userId={post.userId}
              username={post.username}
              profileImage={post.profileImage}
              createdAt={post.createdAt}
              formatTime={formatRelativeTime}
            />
            {/* stopPropagation MeatballsMenu içinde veya burada handle edilmeli */}
            <div onClick={(e) => e.stopPropagation()}>
              <MeatballsMenu isOwner={post.isOwner} onDelete={handleDelete} />
            </div>
          </div>

          <div className="post-container">
            <PostContent text={post.text} image={post.image} />
          </div>

          <hr
            className={
              theme === "dark" ? "border-secondary opacity-25" : "opacity-25"
            }
          />

          <div onClick={(e) => e.stopPropagation()}>
            <PostActions
              postId={post._id}
              likedByCurrentUser={post.likedByCurrentUser}
              likesCount={post.likesCount}
              commentsCount={localCommentsCount}
              onCommentClick={() => setIsCommentModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <CommentModal
        post={post}
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        onSubmit={handleCommentSubmit}
      />
    </>
  );
}
