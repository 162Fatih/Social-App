import { useTheme } from "../../../context/ThemeContext";
import "../../../styles/CommentButton.css";

export default function CommentButton({ commentsCount, onClick }) {
  const { theme } = useTheme();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className={`btn d-flex align-items-center gap-2 border-0 bg-transparent p-0 comment-btn 
        ${theme === "dark" ? "dark-theme" : ""}`}
    >
      <i className="bi bi-chat fs-4 outline-icon"></i>
      <i className="bi bi-chat-fill fs-4 fill-icon"></i>

      <span className="fw-bold user-select-none comment-count">
        {commentsCount || 0}
      </span>
    </button>
  );
}
