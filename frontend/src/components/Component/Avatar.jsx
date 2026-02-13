import { Link } from "react-router-dom";

export default function Avatar({ userId, profileImage, size = "48px" }) {
  return (
    <Link to={`/profile/${userId}`}>
      <img
        src={profileImage || import.meta.env.VITE_DEFAULT_AVATAR_URL}
        alt="avatar"
        className="rounded-circle shadow-sm"
        style={{ width: size, height: size, objectFit: "cover" }}
      />
    </Link>
  );
}
