import { useEffect, useState } from "react";
import { getUserPosts } from "../../api/user.api";
import { getUserLikedPosts } from "../../api/post.api";
import PostCard from "../Post/PostCard";
import ProfileSavedCollections from "./ProfileSavedCollections";

export default function ProfileContent({
  activeTab,
  id, // ProfilePage'den gelen prop ismi 'id' ise burada 'id' olmalı
  activeCollection,
  setActiveCollection,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const collections = ["Tümü", "Manzaralar", "Yazılım", "Komik"];

  const loadData = async () => {
    // KRİTİK KONTROL: id undefined veya boşsa isteği engelle
    if (!id || id === "undefined") return;

    setLoading(true);
    try {
      const res =
        activeTab === "posts"
          ? await getUserPosts(id)
          : await getUserLikedPosts(id);

      // Backend'den gelen verinin dizi olduğundan emin olalım
      // Eğer backend { userPosts: [] } dönüyorsa res.data.userPosts yapmalısın
      setData(res.data || []);
    } catch (err) {
      console.error("Content yükleme hatası:", err);
      setData([]); // Hata durumunda listeyi temizle
    } finally {
      setLoading(false);
    }
  };

  // id veya activeTab değiştiğinde, eğer sekme saved değilse veriyi çek
  useEffect(() => {
    if (activeTab !== "saved" && id) {
      loadData();
    }
  }, [id, activeTab]);

  // Kaydedilenler Sekmesi Görünümü
  if (activeTab === "saved") {
    return (
      <>
        <ProfileSavedCollections
          activeCollection={activeCollection}
          setActiveCollection={setActiveCollection}
          collections={collections}
        />
        <div className="text-center py-5 text-muted">
          <i className="bi bi-folder2-open fs-1"></i>
          <h5 className="mt-3">"{activeCollection}" Klasörü Boş</h5>
        </div>
      </>
    );
  }

  // Gönderiler ve Beğenilenler Görünümü
  return (
    <div className="d-flex flex-column gap-3">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border spinner-border-sm text-primary"></div>
        </div>
      ) : data.length > 0 ? (
        data.map((post) => (
          <PostCard key={post._id} post={post} onUpdate={loadData} />
        ))
      ) : (
        <div className="text-center py-5 text-muted">
          <i
            className={`bi ${activeTab === "posts" ? "bi-chat-square-text" : "bi-heart-break"} fs-1`}
          ></i>
          <p className="mt-2">Henüz içerik bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
