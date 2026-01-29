import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import FeedPostList from "./components/Post/FeedPostList";
import ExplorePostList from "./components/Post/ExplorePostList";

import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Profile from "./pages/ProfilePage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<div>Ana sayfa</div>} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/feed" element={<FeedPostList />} />
        <Route path="/explore" element={<ExplorePostList />} />

        <Route path="/profile/:id" element={<Profile />} />

        <Route path="*" element={<div>404 – Sayfa yok</div>} />
      </Routes>
    </>
  );
}

export default App;
