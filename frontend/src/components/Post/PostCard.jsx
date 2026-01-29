import { likePost, deletePost } from "../../api/post.api";
import { useAuth } from "../../context/AuthContext";

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth();

  // ⛔ güvenlik kalkanı
  if (!post || !post.user || !user) return null;

  const isOwner = post.user._id === user._id;
  const isLiked = post.likes?.includes(user._id);

  return (
    <div style={{ border: "1px solid #ccc", marginBottom: 10 }}>
      <p>
        <b>{post.user.username}</b>
      </p>

      <p>{post.text}</p>

      <button
        onClick={async () => {
          await likePost(post._id);
          onUpdate();
        }}
      >
        {isLiked ? "💔 Unlike" : "❤️ Like"} ({post.likes?.length || 0})
      </button>

      {isOwner && (
        <button
          onClick={async () => {
            await deletePost(post._id);
            onUpdate();
          }}
        >
          🗑️ Sil
        </button>
      )}
    </div>
  );
}
