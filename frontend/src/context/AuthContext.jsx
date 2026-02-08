import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api
        .get("/auth/me")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const register = async (username, email, password) => {
    const res = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, setUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

/* ================ KODUN ÇALIŞMA MANTIĞI (ÖZET) ================

1. createContext(): 
   - Uygulamanın "Global Hafızasını" (kasasını) oluşturur. 
   - Kullanıcı verisi, login/logout fonksiyonları bu kasanın içinde duracak ve uygulamanın her yerinden erişilebilecek.

2. AuthProvider ({ children }): 
   - Buradaki "children", main.jsx'te sarmaladığımız <App /> bileşenidir.
   - Bu bileşen, tüm uygulamanın "Güvenlik Görevlisi" gibi davranır.

3. useEffect (Dedektif): 
   - Sayfa her yenilendiğinde (F5) veya uygulama ilk açıldığında bir kere çalışır.
   - Tarayıcının cebine (localStorage) bakar: "Token var mı? Varsa bu token hala geçerli mi?"
   - Eğer geçerliyse kullanıcıyı otomatik olarak giriş yapmış sayar (setUser).

4. login & register: 
   - Backend'e gidip doğrulamayı yapar.
   - Gelen "token"ı localStorage'a kaydeder (Böylece tarayıcı kapansa bile oturum kalır).
   - "setUser" ile React'e "Tamam, içeri aldık" bilgisini verir.

5. !loading && children: 
   - Burası çok kritik bir güvenlik önlemidir.
   - "Dedektif (useEffect) işini bitirmeden sayfayı gösterme" demektir.
   - Bu sayede kullanıcı giriş yapmış olsa bile, saliselik olarak Login ekranını görüp sonra Ana Sayfaya atlaması (flicker) engellenir.

6. useAuth Hook'u: 
   - Diğer dosyalarda (örn: Navbar.js) uzun uzun "useContext(AuthContext)" yazmak yerine,
   - Sadece "const { user } = useAuth()" yazarak verilere ulaşmanı sağlayan pratik bir kısayoldur.
==============================================================
*/