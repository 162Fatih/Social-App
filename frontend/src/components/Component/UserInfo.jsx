import { Link } from "react-router-dom";
import Avatar from "./Avatar";

export default function UserInfo({
  userId,
  username,
  profileImage,
  createdAt = null,
  formatTime = null,
  theme,
}) {
  return (
    <div className="d-flex align-items-center">
      <Avatar userId={userId} profileImage={profileImage} size="45px" />

      <div className="ms-2">
        <Link
          to={`/profile/${userId}`}
          className={`text-decoration-none d-block ${
            theme === "dark" ? "text-white" : "text-dark"
          }`}
        >
          <h6 className="fw-bold m-0" style={{ fontSize: "0.95rem" }}>
            {username}
          </h6>
        </Link>

        {createdAt && formatTime && (
          <small
            className={`${theme === "dark" ? "text-secondary" : "text-muted"}`}
            style={{ fontSize: "0.75rem" }}
          >
            {formatTime(createdAt)}
          </small>
        )}
      </div>
    </div>
  );
}
