import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, followUser, unfollowUser } from "../api/user.api";
import { useAuth } from "../context/AuthContext";

import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileTabs from "../components/Profile/ProfileTabs";
import ProfileContent from "../components/Profile/ProfileContent";

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [activeCollection, setActiveCollection] = useState("Tümü");

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchProfile = async () => {
    if (!id || id === "undefined") return;

    try {
      setLoading(true);
      const res = await getUserProfile(id);
      setProfile(res.data);
      setError(null);
    } catch (err) {
      console.error("Profil çekme hatası:", err);
      setError(err.response?.data?.message || "Kullanıcı bulunamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && id !== "undefined") {
      fetchProfile();
    }
  }, [id]);

  const handleFollowToggle = async () => {
    if (btnLoading || !currentUser || !profile) return;
    try {
      setBtnLoading(true);
      const isFollowingNow = profile.followers.some(
        (f) => (f._id || f) === currentUser._id,
      );
      isFollowingNow
        ? await unfollowUser(profile._id)
        : await followUser(profile._id);

      const res = await getUserProfile(id);
      setProfile(res.data);
    } catch (err) {
      alert("İşlem başarısız.");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading)
    return (
      <div
        className={`text-center mt-5 min-vh-100 ${theme === "dark" ? "bg-black text-white" : "bg-white"}`}
      >
        <div className="spinner-border text-primary mt-5"></div>
      </div>
    );

  if (error)
    return (
      <div
        className={`min-vh-100 p-5 ${theme === "dark" ? "bg-black text-white" : "bg-white"}`}
      >
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return (
    <div
      className={`container-fluid p-0 ${theme === "dark" ? "bg-black text-white" : "bg-white text-dark"}`}
    >
      <div
        className={`container-fluid border-start border-end ${theme === "dark" ? "border-secondary" : ""}`}
        style={{
          paddingLeft: "0",
          paddingRight: "0",
          minHeight: "100vh",
          backgroundColor: "transparent",
        }}
      >
        <ProfileHeader
          profile={profile}
          isOwnProfile={currentUser?._id === profile?._id}
          isFollowing={profile?.followers.some(
            (f) => (f._id || f) === currentUser?._id,
          )}
          handleFollowToggle={handleFollowToggle}
          btnLoading={btnLoading}
          theme={theme}
        />

        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
        />

        <div className="px-4 py-3">
          <ProfileContent
            activeTab={activeTab}
            id={id}
            activeCollection={activeCollection}
            setActiveCollection={setActiveCollection}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}
