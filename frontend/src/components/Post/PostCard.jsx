import { useState } from "react";
import { deletePost } from "../../api/post.api";
import Like from "../Like-Component/Like";
import MeatballsMenu from "../Meatballs-Menu-Component/MeatballsMenu";
import { Link } from "react-router-dom";

// --- YARDIMCI FONKSİYON: Zamanı Formatla ---
const formatRelativeTime = (dateString) => {
  if (!dateString) return "Yeni gönderi";

  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInHours = Math.floor(diffInSeconds / 3600);
  const diffInDays = Math.floor(diffInHours / 24);

  // 1 dakikadan az ise
  if (diffInSeconds < 60) return "Şimdi";

  // 1 saatten az ise
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk önce`;

  // 24 saatten az ise
  if (diffInHours < 24) return `${diffInHours} sa önce`;

  // 11 günden az ise
  if (diffInDays < 11) return `${diffInDays} gün önce`;

  // 11 gün ve fazlası ise tam tarih
  return date.toLocaleDateString("tr-TR");
};

export default function PostCard({ post, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

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
    <div
      className={`card mb-3 shadow-sm border-0 ${isDeleting ? "opacity-50" : ""}`}
      style={{ borderRadius: "16px", overflow: "hidden" }}
    >
      <div className="card-body p-3">
        {/* --- ÜST KISIM: Profil Bilgileri ve Menü --- */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link
            to={`/profile/${post.userId}`}
            className="d-flex align-items-center text-decoration-none text-dark"
          >
            <img
              src={post.profileImage || defaultAvatar}
              alt={post.username}
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <div>
              <h6 className="fw-bold m-0" style={{ fontSize: "0.95rem" }}>
                {post.username}
              </h6>
              <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                {formatRelativeTime(post.createdAt)}
              </small>
            </div>
          </Link>

          <MeatballsMenu isOwner={post.isOwner} onDelete={handleDelete} />
        </div>

        {/* --- ORTA KISIM: Gönderi Yazısı --- */}
        <p
          className="card-text mb-3"
          style={{ fontSize: "0.95rem", lineHeight: "1.5" }}
        >
          {post.text}
        </p>

        {/* --- GÖRSEL KISMI: (Varsa gösterilir) --- */}
        {post.image && (
          <div
            className="post-image-container mb-3"
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #f0f0f0",
            }}
          >
            <img
              src={post.image}
              alt="Post content"
              className="img-fluid w-100"
              style={{ maxHeight: "500px", objectFit: "cover" }}
            />
          </div>
        )}

        {/* --- ALT KISIM: Etkileşim Barı --- */}
        <hr className="my-2 opacity-25" />
        <div className="d-flex justify-content-between align-items-center pt-1">
          <div className="d-flex align-items-center gap-4">
            {/* BEĞENİ BUTONU */}
            <Like
              postId={post._id}
              likedByCurrentUser={post.likedByCurrentUser}
              likesCount={post.likesCount}
            />

            {/* YORUM BUTONU */}
            <button className="btn btn-link text-decoration-none text-muted p-0 d-flex align-items-center gap-1 shadow-none border-0 bg-transparent">
              <i className="bi bi-chat fs-5"></i>
              <span style={{ fontSize: "0.9rem" }}>
                {post.commentsCount || 0}
              </span>
            </button>
          </div>

          {/* KAYDET BUTONU */}
          <button className="btn btn-link text-decoration-none text-muted p-0 shadow-none border-0 bg-transparent">
            <i className="bi bi-bookmark fs-5"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
