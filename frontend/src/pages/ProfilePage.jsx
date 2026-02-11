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

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getUserProfile(id);
      setProfile(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Kullanıcı bulunamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProfile();
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

      // Takipçi sayısını güncellemek için profili sessizce tazele
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
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  if (error) return <div className="alert alert-danger m-5">{error}</div>;

  return (
    <div className="container-fluid p-0">
      <div
        className="container-fluid border-start border-end"
        style={{
          minHeight: "100vh",
          backgroundColor: "#fff",
          paddingBottom: "20px",
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
        />

        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="px-4 py-3">
          <ProfileContent
            activeTab={activeTab}
            id={id}
            activeCollection={activeCollection}
            setActiveCollection={setActiveCollection}
          />
        </div>
      </div>
    </div>
  );
}
