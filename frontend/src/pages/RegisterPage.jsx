import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Link eklendi

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Hata durumu eklendi

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Her denemede hatayı temizle

    try {
      // Register fonksiyonu genellikle başarılı olursa token döner ve context'i günceller
      await register(username, email, password);
      console.log("Kayıt başarılı");

      // Kayıt başarılıysa ana sayfaya gönder
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError(
        "Kayıt işlemi başarısız. Bilgileri kontrol edin veya farklı bir email deneyin.",
      );
    }
  };

  // Misafir Girişi Fonksiyonu
  const handleGuestLogin = () => {
    navigate("/home");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Kayıt Ol</h2>

        {/* Hata Mesajı */}
        {error && (
          <div className="alert alert-danger p-2 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Kullanıcı Adı */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email Adresi"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Şifre */}
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Kayıt Butonu */}
          <button type="submit" className="btn btn-primary w-100">
            Kayıt Ol
          </button>
        </form>

        {/* Giriş Linki */}
        <div className="text-center mt-3">
          <small className="text-muted">
            Zaten hesabın var mı?{" "}
            <Link to="/login" className="text-decoration-none">
              Giriş Yap
            </Link>
          </small>
        </div>

        <hr className="my-4" />

        {/* --- MİSAFİR BUTONU --- */}
        <div className="d-grid">
          <button
            onClick={handleGuestLogin}
            className="btn btn-outline-secondary"
            type="button"
          >
            Misafir Olarak Devam Et
          </button>
        </div>
      </div>
    </div>
  );
}
