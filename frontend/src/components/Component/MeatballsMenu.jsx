import { useTheme } from "../../context/ThemeContext";
import "../../styles/MeatballsMenu.css";

export default function MeatballsMenu({ isOwner, onDelete }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="dropdown">
      <button
        className={`btn border-0 meatball-btn ${isDark ? "text-white" : "text-secondary"}`}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-three-dots"></i>
      </button>

      <ul
        className={`dropdown-menu dropdown-menu-end shadow border-0 p-0 m-0 overflow-hidden ${isDark ? "dropdown-dark" : ""}`}
        style={{ minWidth: "180px" }}
      >
        {isOwner ? (
          <li>
            <button
              className="dropdown-item text-danger d-flex align-items-center py-2 px-3"
              onClick={onDelete}
            >
              <i className="bi bi-trash me-3"></i>
              Sil
            </button>
          </li>
        ) : (
          <li>
            <button
              className={`dropdown-item d-flex align-items-center py-2 px-3 ${isDark ? "text-white" : "text-secondary"}`}
              type="button"
            >
              <i className="bi bi-slash-circle me-3"></i>
              Boş
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
