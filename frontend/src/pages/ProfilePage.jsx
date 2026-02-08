/*import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, followUser, unfollowUser } from "../api/user.api";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    const res = await getUserProfile(id);
    setProfile(res.data);
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (!profile) return <p>Yükleniyor...</p>;

  const followers = profile.followers || [];
  const isFollowing = followers.includes(user._id);
  const isOwnProfile = user._id === profile._id;

  return (
    <div>
      <h2>{profile.username}</h2>
      <p>Followers: {profile.followers.length}</p>
      <p>Following: {profile.following.length}</p>

      {!isOwnProfile && (
        <button
          onClick={async () => {
            isFollowing
              ? await unfollowUser(profile._id)
              : await followUser(profile._id);
            fetchProfile();
          }}
        >
          {isFollowing ? "Takibi Bırak" : "Takip Et"}
        </button>
      )}

      <hr />

      <h3>Postları</h3>
      {profile.posts.map((post) => (
        <div key={post._id}>
          <p>{post.text}</p>
        </div>
      ))}
    </div>
  );
}*/

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, followUser, unfollowUser } from "../api/user.api";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth(); // Logged in user

  // 1. Durum Yönetimi (State Management)
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);   // Sayfa yükleniyor mu?
  const [error, setError] = useState(null);       // Hata var mı?
  const [btnLoading, setBtnLoading] = useState(false); // Butona basıldı mı?

  // 2. Profil Çekme Fonksiyonu (Hata Yakalamalı)
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUserProfile(id);
      setProfile(res.data);
    } catch (err) {
      console.error("Profil yükleme hatası:", err);
      // Backend'den gelen hata mesajı varsa onu, yoksa genel mesajı göster
      setError(err.response?.data?.message || "Kullanıcı bulunamadı veya bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Eğer ID varsa çekmeye başla
    if (id) {
      fetchProfile();
    }
  }, [id]);

  // 3. Takip Et / Bırak İşlemi (Buton Korumalı)
  const handleFollowToggle = async () => {
    // Eğer zaten işlem yapılıyorsa veya kullanıcı yoksa durdur
    if (btnLoading || !user || !profile) return;

    try {
      setBtnLoading(true); // Butonu kilitle
      
      if (isFollowing) {
        await unfollowUser(profile._id);
      } else {
        await followUser(profile._id);
      }
      
      // İşlem başarılıysa profili güncelle (Takipçi sayısını yenilemek için)
      await fetchProfile(); 
      
    } catch (err) {
      console.error("Takip işlemi hatası:", err);
      alert("İşlem sırasında bir sorun oluştu.");
    } finally {
      setBtnLoading(false); // Buton kilidini aç
    }
  };

  // --- Render Aşaması ve Kontroller ---

  // A. Yükleniyor Ekranı
  if (loading) return <div className="p-5">Profil yükleniyor...</div>;

  // B. Hata Ekranı (Kullanıcı bulunamadı vs.)
  if (error) return <div className="p-5 text-red-500">Hata: {error}</div>;

  // C. Profil Boşsa (Ekstra güvenlik)
  if (!profile) return null;

  // Hesaplamalar (Güvenli Erişim ile)
  // user?._id diyerek user null olsa bile uygulamanın çökmesini engelliyoruz.
  const followers = profile.followers || [];
  const isFollowing = user && followers.includes(user._id); 
  const isOwnProfile = user && user._id === profile._id;

  return (
    <div style={{ padding: 20 }}>
      <h2>{profile.username}</h2>
      <p>Takipçi: {followers.length}</p>
      <p>Takip Edilen: {profile.following?.length || 0}</p>

      {/* Takip Butonu Alanı */}
      {!isOwnProfile && user && (
        <button
          onClick={handleFollowToggle}
          disabled={btnLoading} // İşlem sürerken tıklamayı engelle
          style={{ 
            opacity: btnLoading ? 0.7 : 1,
            cursor: btnLoading ? "not-allowed" : "pointer"
          }}
        >
          {btnLoading 
            ? "İşleniyor..." 
            : isFollowing ? "Takibi Bırak" : "Takip Et"
          }
        </button>
      )}

      {/* Giriş yapmamış kullanıcıya uyarı (Opsiyonel) */}
      {!user && (
        <p style={{ color: "orange" }}>Takip etmek için giriş yapmalısınız.</p>
      )}

      <hr />

      <h3>Postları</h3>
      {profile.posts && profile.posts.length > 0 ? (
        profile.posts.map((post) => (
          <div key={post._id} style={{ border: "1px solid #eee", margin: "10px 0", padding: "10px" }}>
            <p>{post.text}</p>
          </div>
        ))
      ) : (
        <p>Henüz post paylaşmamış.</p>
      )}
    </div>
  );
}
