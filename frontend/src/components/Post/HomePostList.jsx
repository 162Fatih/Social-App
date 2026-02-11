import { useEffect, useState } from "react";
import { getHomePosts } from "../../api/post.api";
import PostCard from "./PostCard";
import PostForm from "./PostForm";
import { useAuth } from "../../context/AuthContext";

// --- YENİ BİLEŞEN: HomeHeader ---
function HomeHeader() {
  return (
    <div className="home-header">
      {/* Navbar'daki logo stiliyle aynı (fs-4 ve px-2) */}
      <h1
        className="fs-4 px-3 mb-0 fw-normal"
        style={{ height: "40px", display: "flex", alignItems: "center" }}
      >
        Ana Sayfa
      </h1>
      <hr className="mt-3 mb-4" />
    </div>
  );
}

export default function HomePostList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getHomePosts();
      setPosts(res.data);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      setError("Postlar yüklenirken bir sorun oluştu.");
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  if (!user) {
    return (
      <div className="alert alert-warning text-center shadow-sm m-4">
        👋 İçerikleri görmek için lütfen{" "}
        <a href="/login" className="alert-link">
          giriş yapınız
        </a>
        .
      </div>
    );
  }

  return (
    <div className="mx-auto pt-2">
      {/* 1. ÖZEL HEADER */}
      <HomeHeader />

      {/* 2. POST PAYLAŞMA FORMU */}
      <div className="mb-4">
        <PostForm onPostCreated={fetchPosts} />
      </div>

      {/* 3. AYIRICI ÇİZGİ (İsteğe bağlı, Header'da zaten var) */}
      <hr className="my-4 border-secondary opacity-25" />

      {/* 4. POST LİSTESİ */}
      <div className="d-flex flex-column gap-3 px-2">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
          ))
        ) : (
          <div className="text-center py-5 text-muted bg-light rounded border">
            <p>Henüz hiç gönderi yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
