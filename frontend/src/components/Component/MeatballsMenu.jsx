import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/MeatballsMenu.css";

export default function MeatballsMenu({ isOwner, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={menuRef}>
      <button
        className={`btn border-0 meatball-btn ${isDark ? "text-white" : "text-secondary"}`}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <i className="bi bi-three-dots"></i>
      </button>

      <ul
        className={`dropdown-menu dropdown-menu-end shadow border-0 p-0 m-0 overflow-hidden ${
          isDark ? "dropdown-dark" : ""
        } ${isOpen ? "show" : ""}`}
        style={{
          minWidth: "180px",
          display: isOpen ? "block" : "none",
          position: "absolute",
          right: 0,
        }}
      >
        {isOwner ? (
          <li>
            <button
              className="dropdown-item text-danger d-flex align-items-center py-2 px-3"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setIsOpen(false);
              }}
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
