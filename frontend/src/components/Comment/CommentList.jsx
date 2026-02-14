import { useEffect, useState } from "react";
import { getCommentsByPostId } from "../../api/comment.api";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import CommentCard from "./CommentCard";
import Loading from "../Loading";

export default function CommentList({
  postId,
  refreshTrigger,
  onCommentDeleted,
}) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();

  const fetchComments = async () => {
    try {
      const res = await getCommentsByPostId(postId);

      const formattedComments = res.data.map((comment) => {
        const currentId = currentUser?._id || currentUser?.id;

        return {
          _id: comment._id,
          userId: comment.user?._id,
          username: comment.user?.username,
          profileImage: comment.user?.profileImage,
          text: comment.text,
          image: comment.image ? `http://localhost:5000${comment.image}` : null,
          likesCount: comment.likes?.length || 0,
          repliesCount: 0,
          createdAt: comment.createdAt,
          isOwner: comment.user?._id === currentId,
          likedByCurrentUser: comment.likes?.includes(currentId),
        };
      });

      setComments(formattedComments);
    } catch (err) {
      console.error("Yorumlar yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && postId) {
      fetchComments();
    }
  }, [postId, refreshTrigger, currentUser]);

  const handleCommentUpdate = () => {
    fetchComments();

    if (onCommentDeleted) {
      onCommentDeleted();
    }
  };

  if (loading) {
    return <Loading message="Yorumlar Yükleniyor..." />;
  }

  return (
    <div
      className={`comment-list-section ${theme === "dark" ? "bg-black" : "bg-white"}`}
    >
      {comments.length === 0 ? (
        <div className="p-5 text-center text-secondary">
          <p>Henüz yanıt yok. İlk yanıtı sen gönder!</p>
        </div>
      ) : (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="border-bottom border-secondary border-opacity-10"
          >
            <CommentCard comment={comment} onUpdate={handleCommentUpdate} />
          </div>
        ))
      )}
    </div>
  );
}
