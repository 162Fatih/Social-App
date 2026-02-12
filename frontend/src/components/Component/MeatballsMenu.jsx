import "../../styles/MeatballsMenu.css";

export default function MeatballsMenu({ isOwner, onDelete, theme }) {
  return (
    <div className="dropdown">
      <button
        // theme dark ise 'dark' class'ını ekliyoruz
        className={`btn border-0 meatball-btn ${theme === "dark" ? "text-light" : "text-secondary"}`}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-three-dots"></i>
      </button>

      <ul
        // Dropdown menüsüne de theme bilgisini class olarak veriyoruz
        className={`dropdown-menu dropdown-menu-end shadow border-0 p-0 m-0 overflow-hidden ${theme === "dark" ? "dropdown-dark" : ""}`}
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
              className={`dropdown-item d-flex align-items-center py-2 px-3 ${theme === "dark" ? "text-light" : "text-secondary"}`}
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
