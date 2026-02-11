import { useState } from "react";
import { deletePost } from "../../api/post.api";
import Like from '../Like-Component/Like'; 
import MeatballsMenu from "../Meatballs-Menu-Component/MeatballsMenu";

export default function PostCard({ post, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!post) return null;

  const handleDelete = async () => {
    if (!window.confirm("Bu postu silmek istediğine emin misin?")) return;

    try {
      setIsDeleting(true);
      await deletePost(post._id);
      onUpdate?.(); 
    } catch (error) {
      alert("Post silinemedi: " + (error.response?.data?.message || ""));
      setIsDeleting(false);
    }
  };

  return (
    <div className="card mb-3 shadow-sm border-0" style={{ borderRadius: '16px' }}>
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="card-title fw-bold  text-primary m-0">
              @{post.username}
            </h6>

            <MeatballsMenu 
                isOwner={post.isOwner} 
                onDelete={handleDelete} 
            />
        </div>
        
        <p className="card-text mb-3" style={{ fontSize: '1rem' }}>
            {post.text}
        </p>

        <div className="d-flex align-items-center">
          <Like
            postId={post._id}
            likedByCurrentUser={post.likedByCurrentUser}
            likesCount={post.likesCount}
          />
        </div>

      </div>
    </div>
  );
}
