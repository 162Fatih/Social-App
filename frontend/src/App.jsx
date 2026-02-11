import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Layout/Header";
import Navbar from "./components/Navbar";

import FeedPostList from "./components/Post/FeedPostList";
import ExplorePostList from "./components/Post/ExplorePostList";

import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Profile from "./pages/ProfilePage";

function App() {
  const location = useLocation();

  const hideLayoutRoutes = ["/login", "/register"];
  const showLayout = !hideLayoutRoutes.includes(location.pathname);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/*showLayout && */ <Header />}

      <div className="d-flex flex-grow-1">
        {/* SOL: Navbar */}
        {showLayout && (
          <aside className="bg-dark" style={{ width: "280px" }}>
            <Navbar />
          </aside>
        )}

        <main className="flex-grow-1 p-4 bg-light">
          <Routes>
            <Route path="/" element={<div>Ana Sayfa İçeriği</div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/feed" element={<FeedPostList />} />
            <Route path="/explore" element={<ExplorePostList />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
