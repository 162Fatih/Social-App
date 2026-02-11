/*import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function LoginPage() {
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log(`Giriş başarılı: ${email}`);
      const response = await api.get("/auth/me"); 
      //console.log("Kullanıcı bilgileri çekildi:", response.data);
      setUser(response.data);
      navigate("/");
    } catch (err) {
      setError("Giriş başarısız oldu."); //${err || "Lütfen bilgilerinizi kontrol edin."}
    }
  };

  return (
    <div>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
}*/

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Link'i de ekledik
import api from "../api/axios";

export default function LoginPage() {
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Her denemede hatayı sıfırla
    try {
      await login(email, password);
      console.log(`Giriş başarılı: ${email}`);
      const response = await api.get("/auth/me");
      setUser(response.data);

      // DEĞİŞİKLİK: "/" yerine "/home" yaptık
      navigate("/home");
    } catch (err) {
      setError("Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  // --- YENİ EKLENEN MİSAFİR FONKSİYONU ---
  const handleGuestLogin = () => {
    // Hiçbir doğrulama yapmadan direkt home sayfasına yolluyoruz
    navigate("/home");
  };

  return (
    // Sayfayı ortalamak için Bootstrap flex yapıları
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Giriş Yap</h2>

        {/* Hata Mesajı Alanı */}
        {error && (
          <div className="alert alert-danger p-2 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
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

          {/* Şifre Input */}
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

          {/* Giriş Butonu */}
          <button type="submit" className="btn btn-primary w-100">
            Giriş Yap
          </button>
        </form>

        {/* Kayıt Ol Linki */}
        <div className="text-center mt-3">
          <small className="text-muted">
            Hesabın yok mu?{" "}
            <Link to="/register" className="text-decoration-none">
              Kayıt Ol
            </Link>
          </small>
        </div>

        {/* Ayırıcı Çizgi */}
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
