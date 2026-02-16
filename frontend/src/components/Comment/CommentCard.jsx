import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { formatRelativeTime } from "../Component/DateInfo";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Yönlendirme için eklendi

import { deleteComment } from "../../api/comment.api";
import MeatballsMenu from "../Component/MeatballsMenu";
import UserInfo from "../Component/UserInfo";
import PostContent from "../Component/PostContent";
import CommentActions from "../Comment/CommentActions";
import CommentModal from "../Comment/CommentModal";

import "../../styles/PostCard.css";

export default function CommentCard({ comment, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate(); // Navigate hook'unu tanımladık

  const [localRepliesCount, setLocalRepliesCount] = useState(
    comment?.repliesCount || 0,
  );

  useEffect(() => {
    setLocalRepliesCount(comment?.repliesCount || 0);
  }, [comment?.repliesCount]);

  if (!comment) return null;

  // Yorum butonuna tıklandığında çalışan fonksiyon
  const handleReplyClick = () => {
    if (!currentUser) {
      // Kullanıcı yoksa login sayfasına yönlendir
      navigate("/login");
      return;
    }
    // Kullanıcı varsa modalı aç
    setIsReplyModalOpen(true);
  };

  const handleDelete = async () => {
    if (!window.confirm("Bu yorumu silmek istediğine emin misin?")) return;
    try {
      setIsDeleting(true);
      await deleteComment(comment._id);
      onUpdate?.();
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Yorum silinemedi");
      setIsDeleting(false);
    }
  };

  const handleReplySubmit = (replyData) => {
    console.log("Yanıt gönderiliyor:", comment._id, replyData);
    setIsReplyModalOpen(false);
    onUpdate?.();
  };

  return (
    <>
      <div
        className={`post-card mx-auto w-100 ${theme === "dark" ? "dark" : ""} ${
          isDeleting ? "opacity-50" : ""
        }`}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <UserInfo
              userId={comment.userId}
              username={comment.username}
              profileImage={comment.profileImage}
              createdAt={comment.createdAt}
              formatTime={formatRelativeTime}
            />
            {/* <MeatballsMenu isOwner={comment.isOwner} onDelete={handleDelete} /> */}
            <div className="dropdown-container">
              {" "}
              <MeatballsMenu
                isOwner={comment.isOwner}
                onDelete={handleDelete}
              />
            </div>
          </div>

          <div className="post-container">
            <PostContent text={comment.text} image={comment.image} />
          </div>

          <hr
            className={
              theme === "dark" ? "border-secondary opacity-25" : "opacity-25"
            }
          />

          <CommentActions
            commentId={comment._id}
            likedByCurrentUser={comment.likedByCurrentUser}
            likesCount={comment.likesCount}
            repliesCount={localRepliesCount}
            onReplyClick={handleReplyClick} // Yeni kontrol fonksiyonumuzu geçtik
          />
        </div>
      </div>

      <CommentModal
        post={comment}
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        onSubmit={handleReplySubmit}
      />
    </>
  );
}
