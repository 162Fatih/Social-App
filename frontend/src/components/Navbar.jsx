import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  // İkon kapsayıcısı için stil (Tüm menüde standart)
  const iconStyle = {
    width: "24px", // Sabit genişlik
    display: "inline-block",
    textAlign: "center", // İkonu ortalar
  };

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{ width: "280px", height: "100%" }}
    >
      <ul className="nav nav-pills flex-column mb-auto">
        {/* --- FEED --- */}
        <li className="nav-item">
          <NavLink
            to="/feed"
            className={({ isActive }) =>
              // d-flex ve align-items-center ekledik
              isActive
                ? "nav-link active d-flex align-items-center"
                : "nav-link text-white d-flex align-items-center"
            }
          >
            {/* İkon Grubu */}
            <span className="me-2" style={iconStyle}>
              <i className="bi bi-house-fill"></i>
            </span>
            {/* Yazı Grubu */}
            <span>Feed</span>
          </NavLink>
        </li>

        {/* --- KEŞFET --- */}
        <li>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              // d-flex ve align-items-center ekledik
              isActive
                ? "nav-link active d-flex align-items-center"
                : "nav-link text-white d-flex align-items-center"
            }
          >
            {/* İkon Grubu */}
            <span className="me-2" style={iconStyle}>
              <i className="bi bi-search"></i>
            </span>
            {/* Yazı Grubu */}
            <span>Keşfet</span>
          </NavLink>
        </li>
      </ul>

      <hr />

      {/* --- KULLANICI ALANI --- */}
      <div className="d-flex align-items-center justify-content-between">
        {/* SOL: Profil Linki */}
        <Link
          to={`/profile/${user?._id}`}
          className="d-flex align-items-center text-white text-decoration-none me-2"
          title="Profilime Git"
        >
          <img
            src={user?.profileImage || defaultAvatar}
            alt=""
            width="32"
            height="32"
            className="rounded-circle me-2"
            style={{ objectFit: "cover" }}
          />
          <strong>{user?.username || "Misafir"}</strong>
        </Link>

        {/* SAĞ: Açılır Menü */}
        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle p-1"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          ></a>

          <ul
            className="dropdown-menu dropdown-menu-dark text-small shadow"
            aria-labelledby="dropdownUser1"
          >
            {/* AYARLAR */}
            <li>
              <Link
                className="dropdown-item d-flex align-items-center"
                to="/settings"
              >
                <span className="me-2" style={iconStyle}>
                  <i className="bi bi-gear"></i>
                </span>
                <span>Ayarlar</span>
              </Link>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            {/* ÇIKIŞ YAP */}
            <li>
              <button
                className="dropdown-item d-flex align-items-center"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                <span className="me-2" style={iconStyle}>
                  <i className="bi bi-box-arrow-left"></i>
                </span>
                <span>Çıkış Yap</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
