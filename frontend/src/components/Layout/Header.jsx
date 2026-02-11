import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  // Hizalama için standart stil
  const iconStyle = {
    width: "24px",
    display: "inline-block",
    textAlign: "center",
  };

  return (
    <header
      style={{
        position: "sticky", // Yapışkan özellik
        top: "0", // En tepeye yapış
        zIndex: 1000, // Diğer içeriklerin (postların) üstünde dursun
        width: "100%", // Tam genişlik
      }}
    >
      <nav
        className="navbar navbar-expand bg-dark border-bottom border-body"
        data-bs-theme="dark"
      >
        <div className="container">
          <div className="navbar-nav ms-auto d-flex flex-row gap-3">
            {!user && (
              <>
                <NavLink
                  className="nav-link d-flex align-items-center"
                  to="/login"
                >
                  <span className="me-2" style={iconStyle}>
                    <i className="bi bi-box-arrow-in-right"></i>
                  </span>
                  <span>Giriş Yap</span>
                </NavLink>

                <NavLink
                  className="nav-link d-flex align-items-center"
                  to="/register"
                >
                  <span className="me-2" style={iconStyle}>
                    <i className="bi bi-person-plus"></i>
                  </span>
                  <span>Kayıt Ol</span>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
