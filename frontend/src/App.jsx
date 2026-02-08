import { Routes, Route } from "react-router-dom";

import Header from "./components/Layout/Header";

import FeedPostList from "./components/Post/FeedPostList";
import ExplorePostList from "./components/Post/ExplorePostList";

import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Profile from "./pages/ProfilePage";

import PostForm from "./components/Post/PostForm";

function App() {
  return (
    <>
      <Header />

      <div>
        <button onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}>
          Logout
        </button>
      </div>

      <div>
        <button onClick={() => { // şuanda mevcut kullanıcıyı görmek için basit bir buton ekledim, istersen kaldırabilirsin
          localStorage.getItem("token") ? alert("Token: " + localStorage.getItem("token")) : alert("Giriş yapılmamış");
        }}>
          See User
        </button>
      </div>

      <PostForm onPostCreated={() => {
        // Post oluşturulduktan sonra yapılacak işlemler (örneğin, post listesini yenilemek)
        console.log("Yeni bir post oluşturuldu!");
      }} />

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

/*
import Navbar from "./components/Navbar";
<Navbar />

import Like from './components/Like-Component/Like';
<Like />
*/
