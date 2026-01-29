import { useEffect, useState } from "react";
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
}
