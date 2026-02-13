import { useTheme } from "../../context/ThemeContext";

export default function RightAside() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside className="d-none d-lg-block ps-4 pt-2" style={{ width: "350px" }}>
      <div className="sticky-top" style={{ top: "10px" }}>
        {/* Arama Çubuğu Bölümü */}
        <div className="mb-3">
          <div
            className={`input-group rounded-pill px-3 py-1 border-0 overflow-hidden ${
              isDark ? "bg-dark text-white" : "bg-light text-dark"
            }`}
            style={{ backgroundColor: isDark ? "#202327" : "#eff3f4" }}
          >
            <span className="input-group-text bg-transparent border-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className={`form-control bg-transparent border-0 shadow-none ${
                isDark ? "text-white" : "text-dark"
              }`}
              placeholder="Ara..."
            />
          </div>
        </div>

        {/* İlginizi Çekebilir Bölümü */}
        <div
          className={`rounded-4 p-3 border-0 ${
            isDark ? "text-white" : "text-dark"
          }`}
          style={{ backgroundColor: isDark ? "#16181c" : "#f7f9f9" }}
        >
          <h5 className="fw-bold mb-3">İlginizi çekebilir</h5>
          <p className={`${isDark ? "text-secondary" : "text-muted"} small`}>
            Şimdilik burası boş, yakında içerik eklenecek.
          </p>
        </div>
      </div>
    </aside>
  );
}
