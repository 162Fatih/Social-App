import "../../styles/MeatballsMenu.css";

export default function MeatballsMenu({ isOwner, onDelete }) {
  return (
    <div className="dropdown">
      <button
        className="btn border-0 text-secondary meatball-btn"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-boundary="viewport"
        data-bs-offset="0,0"
      >
        <i className="bi bi-three-dots"></i>
      </button>

      <ul
        className="dropdown-menu dropdown-menu-end shadow-sm border-0 p-0 m-0 overflow-hidden"
        style={{ minWidth: "180px" }}
      >
        {isOwner ? (
          <li>
            <button
              className="dropdown-item text-danger d-flex align-items-center rounded-0 py-2 px-3"
              onClick={onDelete}
            >
              <i className="bi bi-trash me-3"></i>
              Sil
            </button>
          </li>
        ) : (
          <li>
            <button
              className="dropdown-item text-secondary d-flex align-items-center rounded-0 py-2 px-3"
              type="button"
            >
              <i
                className="bi bi-slash-circle me-3"
                style={{ fontSize: "1.1rem" }}
              ></i>
              Boş
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
