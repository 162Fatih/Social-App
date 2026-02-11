import { Link } from "react-router-dom";

export default function ProfileHeader({
  profile,
  isOwnProfile,
  isFollowing,
  handleFollowToggle,
  btnLoading,
}) {
  const defaultBanner =
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80";
  const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <>
      <div
        style={{
          height: "200px",
          backgroundImage: `url(${profile.banner || defaultBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottom: "1px solid #dee2e6",
        }}
      ></div>

      <div className="px-4" style={{ position: "relative" }}>
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

          <div className="mb-3">
            {isOwnProfile ? (
              <Link
                to="/settings"
                className="btn btn-outline-dark rounded-pill fw-bold"
              >
                Profili Düzenle
              </Link>
            ) : (
              <button
                onClick={handleFollowToggle}
                disabled={btnLoading}
                className={`btn rounded-pill fw-bold px-4 ${isFollowing ? "btn-outline-danger" : "btn-dark"}`}
              >
                {btnLoading ? "..." : isFollowing ? "Takipten Çık" : "Takip Et"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-3">
          <h2 className="fw-bold mb-0">{profile.username}</h2>
          <span className="text-muted">@{profile.username}</span>
          <p className="mt-3 mb-3">
            {profile.bio || "Merhaba! Ben Social App kullanıyorum."}
          </p>
          <div className="d-flex gap-4 mb-4">
            <span>
              <span className="fw-bold">{profile.following?.length || 0}</span>{" "}
              <span className="text-muted">Takip Edilen</span>
            </span>
            <span>
              <span className="fw-bold">{profile.followers?.length || 0}</span>{" "}
              <span className="text-muted">Takipçi</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
