import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Header from "./components/Layout/Header";
import Navbar from "./components/Navbar";

import HomePostList from "./components/Post/HomePostList";
import ExplorePostList from "./components/Post/ExplorePostList";

import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Profile from "./pages/ProfilePage";

function App() {
  const location = useLocation();
  const { user } = useAuth();

  const hideLayoutRoutes = ["/login", "/register"];
  const showLayout = !hideLayoutRoutes.includes(location.pathname);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        {showLayout && (
          <aside className="bg-dark" style={{ width: "280px" }}>
            <Navbar />
          </aside>
        )}

        <div className="d-flex flex-column flex-grow-1">
          {user ? null : <Header />}

          <main className="flex-grow-1 p-0 bg-light">
            <Routes>
              {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
              <Route
                path="/"
                element={
                  user ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/home" element={<HomePostList />} />
              <Route path="/explore" element={<ExplorePostList />} />
              <Route path="/profile/:id" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
