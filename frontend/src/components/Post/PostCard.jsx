import { useState } from "react";
import { deletePost } from "../../api/post.api";
import { useAuth } from "../../context/AuthContext";

import Like from '../Like-Component/Like'; 

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!post || !post.user) return null;

  const isOwner = user ? post.user._id === user._id : false;

  // Silme Fonksiyonu
  const handleDelete = async () => {
    if (!window.confirm("Bu postu silmek istediğine emin misin?")) return;
    
    try {
      setIsDeleting(true);
      await deletePost(post._id);
      // 2. LİSTEYİ YENİLEME AŞAMASI (Hata genelde burada çıkar)
      // Eğer onUpdate fonksiyonu gönderilmişse çalıştır, yoksa hata verme.
      if (onUpdate) {
          onUpdate(); 
      } else {
          // Eğer onUpdate yoksa sayfayı manuel yenilemek istersen (opsiyonel)
          // window.location.reload(); 
          console.warn("onUpdate fonksiyonu gönderilmediği için liste yenilenemedi.");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Post silinemedi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">

        <h6 className="card-title fw-bold text-primary">
          @{post.user.username}
        </h6>

        <p className="card-text">
          {post.text}
        </p>

        {/* Alt Kısım: Like ve Sil Butonları */}
        <div className="d-flex align-items-center justify-content-between mt-3">

          <Like 
            postId={post._id} 
            likes={post.likes} 
          />

          {/* Silme Butonu (Sadece Sahibi Görür) */}
          {isOwner && (
            <button 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="btn btn-sm btn-outline-danger border-0"
            >
              {isDeleting ? "Siliniyor..." : <i className="bi bi-trash"></i>}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}