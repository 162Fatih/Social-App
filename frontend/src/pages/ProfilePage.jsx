import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserProfile, followUser, unfollowUser } from "../api/user.api";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();

  // --- STATE YÖNETİMİ ---
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const defaultBanner =
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80";
  const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUserProfile(id);
      setProfile(res.data);
    } catch (err) {
      console.error("Profil yükleme hatası:", err);
      setError(err.response?.data?.message || "Kullanıcı bulunamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  const handleFollowToggle = async () => {
    if (btnLoading || !user || !profile) return;
    try {
      setBtnLoading(true);
      const isFollowingNow = profile.followers.includes(user._id);
      if (isFollowingNow) {
        await unfollowUser(profile._id);
      } else {
        await followUser(profile._id);
      }
      await fetchProfile();
    } catch (err) {
      alert("İşlem başarısız.");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  if (error) return <div className="alert alert-danger m-5">{error}</div>;
  if (!profile) return null;

  const isOwnProfile = user && user._id === profile._id;
  const isFollowing = user && profile.followers.includes(user._id);

  return (
    <div className="container-fluid p-0">
      {/* 1. KAPAK FOTOĞRAFI (BANNER) */}
      <div
        style={{
          height: "200px",
          backgroundImage: `url(${profile.banner || defaultBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      ></div>

      {/* --- ANA İÇERİK KAPSAYICISI --- */}
      <div
        className="container-fluid"
        style={{
          borderLeft: "1px solid #dee2e6",
          borderRight: "1px solid #dee2e6",
          // Hesaplama: Ekran boyu (100vh) - Banner boyu (200px)
          minHeight: "calc(100vh - 200px)",
          backgroundColor: "#fff",

          // --- DEĞİŞİKLİK BURADA ---
          marginBottom: 0, // Alt boşluğu tamamen sıfırladık
          paddingBottom: "20px", // İçerik yapışmasın diye çok az iç boşluk bıraktık ama margin yok
        }}
      >
        {/* 2. PROFİL BİLGİLERİ ALANI */}
        <div className="px-4" style={{ position: "relative" }}>
          {/* Profil Resmi */}
          <div className="d-flex justify-content-between align-items-end">
            <div style={{ marginTop: "-75px" }}>
              <img
                src={profile.profileImage || defaultAvatar}
                alt={profile.username}
                className="rounded-circle border border-4 border-white shadow-sm"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  backgroundColor: "white",
                }}
              />
            </div>

            {/* Butonlar */}
            <div className="mb-3">
              {isOwnProfile ? (
                <Link
                  to="/settings"
                  className="btn btn-outline-dark rounded-pill fw-bold"
                >
                  Profili Düzenle
                </Link>
              ) : user ? (
                <button
                  onClick={handleFollowToggle}
                  disabled={btnLoading}
                  className={`btn rounded-pill fw-bold px-4 ${
                    isFollowing ? "btn-outline-danger" : "btn-dark"
                  }`}
                >
                  {btnLoading
                    ? "..."
                    : isFollowing
                      ? "Takipten Çık"
                      : "Takip Et"}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary rounded-pill fw-bold"
                >
                  Takip etmek için Giriş Yap
                </Link>
              )}
            </div>
          </div>

          {/* İsim ve Bio */}
          <div className="mt-3">
            <h2 className="fw-bold mb-0">{profile.username}</h2>
            <span className="text-muted">@{profile.username}</span>
            <p className="mt-3 mb-3">
              {profile.bio || "Merhaba! Ben Social App kullanıyorum."}
            </p>
            <div className="d-flex gap-4 mb-4">
              <span className="text-decoration-none text-dark">
                <span className="fw-bold">
                  {profile.following?.length || 0}
                </span>{" "}
                <span className="text-muted">Takip Edilen</span>
              </span>
              <span className="text-decoration-none text-dark">
                <span className="fw-bold">
                  {profile.followers?.length || 0}
                </span>{" "}
                <span className="text-muted">Takipçi</span>
              </span>
            </div>
          </div>
        </div>

        {/* 3. SEKMELER (NAV TABS) */}
        <div className="px-4 border-bottom">
          <ul className="nav nav-tabs nav-fill border-0">
            <li className="nav-item">
              <button
                className={`nav-link border-0 rounded-0 ${
                  activeTab === "posts"
                    ? "active fw-bold border-bottom border-dark border-3"
                    : "text-muted"
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Gönderiler
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link border-0 rounded-0 ${
                  activeTab === "likes"
                    ? "active fw-bold border-bottom border-dark border-3"
                    : "text-muted"
                }`}
                onClick={() => setActiveTab("likes")}
              >
                Beğenilenler
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link border-0 rounded-0 ${
                  activeTab === "media"
                    ? "active fw-bold border-bottom border-dark border-3"
                    : "text-muted"
                }`}
                onClick={() => setActiveTab("media")}
              >
                Medya
              </button>
            </li>
          </ul>
        </div>

        {/* 4. SEKME İÇERİĞİ */}
        <div className="px-4 py-3">
          <div className="row">
            {activeTab === "posts" && (
              <div className="col-12">
                {profile.posts && profile.posts.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {profile.posts.map((post) => (
                      <div
                        key={post._id}
                        className="card p-3 shadow-sm border-0 bg-light"
                      >
                        <div className="d-flex align-items-center mb-2">
                          <img
                            src={profile.profileImage || defaultAvatar}
                            width="40"
                            height="40"
                            className="rounded-circle me-2"
                            style={{ objectFit: "cover" }}
                          />
                          <div>
                            <h6 className="mb-0 fw-bold">{profile.username}</h6>
                            <small className="text-muted">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                        <p className="card-text">{post.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-chat-square-text fs-1"></i>
                    <p className="mt-2">Henüz hiç gönderi yok.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "likes" && (
              <div className="col-12 text-center py-5 text-muted">
                <i className="bi bi-heart fs-1"></i>
                <p className="mt-2">Beğenilen gönderiler burada görünecek.</p>
              </div>
            )}
            {activeTab === "media" && (
              <div className="col-12 text-center py-5 text-muted">
                <i className="bi bi-images fs-1"></i>
                <p className="mt-2">Fotoğraf ve videolar burada görünecek.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
