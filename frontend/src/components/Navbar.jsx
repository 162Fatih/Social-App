import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css"; // CSS dosyasını import etmeyi unutma

export default function Navbar() {
  const { user } = useAuth();

  const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div className="sidebar-container">
      <Link
        to="/"
        className="navbar-brand text-white text-decoration-none fs-4 px-2"
      >
        Social App
      </Link>

      <hr className="text-white" />

      <ul className="nav nav-pills flex-column mb-auto">
        {/* --- ANA SAYFA --- */}
        <li className="nav-item">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `nav-link-custom ${isActive ? "active" : ""}`
            }
          >
            <span className="icon-box">
              <i className="bi bi-house-fill"></i>
            </span>
            <span>Ana Sayfa</span>
          </NavLink>
        </li>

        {/* --- KEŞFET --- */}
        <li>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `nav-link-custom ${isActive ? "active" : ""}`
            }
          >
            <span className="icon-box">
              <i className="bi bi-search"></i>
            </span>
            <span>Keşfet</span>
          </NavLink>
        </li>

        {/* --- GÖNDERİ PAYLAŞ BUTONU (YENİ) --- */}
        {user && (
          <li>
            <button className="btn-post-custom shadow">Gönderi Paylaş</button>
          </li>
        )}
      </ul>

      <hr className="text-white" />

      <div className="d-flex align-items-center justify-content-between">
        {/* Profil Linki */}
        <Link
          to={user ? `/profile/${user._id}` : "/login"}
          className="d-flex align-items-center text-white text-decoration-none me-2"
          title={user ? "Profilime Git" : "Giriş Yap"}
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

        {/* Dropdown */}
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
            {user ? (
              <>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/settings"
                  >
                    <span className="icon-box">
                      <i className="bi bi-gear"></i>
                    </span>
                    <span>Ayarlar</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/login"
                  >
                    <span className="icon-box">
                      <i className="bi bi-arrow-repeat"></i>
                    </span>
                    <span>Hesap Değiştir</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/login";
                    }}
                  >
                    <span className="icon-box">
                      <i className="bi bi-box-arrow-left"></i>
                    </span>
                    <span>Çıkış Yap</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/login"
                  >
                    <span className="icon-box">
                      <i className="bi bi-box-arrow-in-right"></i>
                    </span>
                    <span>Giriş Yap</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/register"
                  >
                    <span className="icon-box">
                      <i className="bi bi-person-plus"></i>
                    </span>
                    <span>Kayıt Ol</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
