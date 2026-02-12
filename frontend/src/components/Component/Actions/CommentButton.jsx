import "../../../styles/CommentButton.css";

export default function CommentButton({ commentsCount, onClick, theme }) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-link p-0 d-flex align-items-center gap-1 shadow-none border-0 bg-transparent comment-btn 
        ${theme === "dark" ? "dark-theme" : ""}`}
    >
      <i className="bi bi-chat fs-5"></i>
      <span className="comment-count">{commentsCount || 0}</span>
    </button>
  );
}
