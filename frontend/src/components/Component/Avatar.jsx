import { Link } from "react-router-dom";

export default function Avatar({ userId, profileImage, size = "48px" }) {
  const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <Link to={`/profile/${userId}`}>
      <img
        src={profileImage || defaultAvatar}
        alt="avatar"
        className="rounded-circle shadow-sm"
        style={{ width: size, height: size, objectFit: "cover" }}
      />
    </Link>
  );
}
