import { useState, useEffect } from "react";
import { updateUserSettings } from "../api/user.api";
import { useAuth } from "../context/AuthContext";
import "../styles/Settings.css";

export default function Settings() {
  const { user, setUser } = useAuth();

  const [theme, setTheme] = useState(
    user?.settings?.theme || localStorage.getItem("theme") || "dark",
  );
  const [loading, setLoading] = useState(false);

  const changeTheme = async (newTheme) => {
    try {
      const res = await updateUserSettings(newTheme);

      localStorage.setItem("theme", newTheme);

      setUser((prevUser) => ({
        ...prevUser,
        settings: res.data,
      }));

      window.dispatchEvent(new Event("storage"));
      setTheme(newTheme);
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  useEffect(() => {
    if (user?.settings?.theme) {
      setTheme(user.settings.theme);
      localStorage.setItem("theme", user.settings.theme);
    }
  }, [user]);

  return (
    <div
      className={`min-vh-100 ${theme === "dark" ? "bg-black text-white" : "bg-white text-dark"}`}
      style={{ transition: "0.3s ease" }}
    >
      <div className="settings-container p-3 p-md-4">
        <h2 className="settings-title mb-4">Ayarlar</h2>

        <div className={`settings-card p-4 ${theme === "dark" ? "dark" : ""}`}>
          <h5 className="fw-bold mb-1">Görünüm</h5>
          <p className="text-secondary-custom small mb-4">
            Uygulamanın nasıl görüneceğini seç. Bu ayar hesabına kaydedilir.
          </p>

          <div className="d-flex flex-column gap-3">
            <div
              onClick={() => changeTheme("light")}
              className={`theme-option p-3 rounded-3 d-flex align-items-center justify-content-between ${
                theme === "light" ? "active" : ""
              } ${loading ? "opacity-50" : ""}`}
              style={{ pointerEvents: loading ? "none" : "auto" }}
            >
              <div className="d-flex align-items-center gap-3">
                <i
                  className={`bi bi-sun-fill fs-4 ${theme === "light" ? "text-warning" : ""}`}
                ></i>
                <span className="fw-bold">Varsayılan (Açık)</span>
              </div>
              {theme === "light" && (
                <i className="bi bi-check-lg text-primary fw-bold"></i>
              )}
            </div>

            <div
              onClick={() => changeTheme("dark")}
              className={`theme-option p-3 rounded-3 d-flex align-items-center justify-content-between ${
                theme === "dark" ? "active" : ""
              } ${loading ? "opacity-50" : ""}`}
              style={{ pointerEvents: loading ? "none" : "auto" }}
            >
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-moon-stars-fill fs-4 text-primary"></i>
                <span className="fw-bold">Gece Modu (Koyu)</span>
              </div>
              {theme === "dark" && (
                <i className="bi bi-check-lg text-primary fw-bold"></i>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 text-center text-secondary-custom small">
          <i className="bi bi-info-circle me-1"></i>
          {loading
            ? "Ayarlar kaydediliyor..."
            : "Tema tercihlerin hesabınla senkronize edilir."}
        </div>
      </div>
    </div>
  );
}
