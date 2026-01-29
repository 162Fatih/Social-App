import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/feed">Feed </Link>
      <Link to="/explore">Keşfet </Link>
      <Link to="/login">Giriş </Link>
      <Link to="/register">Kayıt </Link>
    </nav>
  );
}
