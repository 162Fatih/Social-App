import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav
        className="navbar navbar-expand bg-dark border-bottom border-body"
        data-bs-theme="dark"
      >
        <div className="container">
          <Link to="/" className="navbar-brand">
            Social App
          </Link>

          <div className="navbar-nav ms-auto">
            {/* <NavLink className="nav-link" to="/feed">Feed</NavLink>
                    <NavLink className="nav-link" to="/explore">Keşfet</NavLink> */}
            <NavLink className="nav-link" to="/login">
              Giriş
            </NavLink>
            <NavLink className="nav-link" to="/register">
              Kayıt
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

/*
import { Link } from "react-router-dom";

<a href="/" className="navbar-brand">Social App</a>
<Link to="/feed">Feed </Link>
<Link to="/explore">Keşfet </Link>
<Link to="/login">Giriş </Link>
<Link to="/register">Kayıt </Link>
*/
