/*import { useEffect, useState } from "react";
import { getFeedPosts } from "../../api/post.api";
import PostCard from "./PostCard";

export default function FeedPostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getFeedPosts().then(res => setPosts(res.data));
  }, []);

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}*/

import { useEffect, useState } from "react";
import { getFeedPosts } from "../../api/post.api";
import PostCard from "./PostCard";
import { useAuth } from "../../context/AuthContext"; // AuthContext'i ekledik

export default function FeedPostList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Yükleniyor durumu
  const [error, setError] = useState(null); // Hata mesajı durumu
  const { user } = useAuth(); // Kullanıcıyı kontrol et

  // Veri çekme işini bir fonksiyona atadık (Yeniden kullanılabilir olsun diye)
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await getFeedPosts();
      setPosts(res.data);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      setError("Postlar yüklenirken bir sorun oluştu.");
    } finally {
      //setIsLoading(false); // Başarılı da olsa başarısız da olsa yüklemeyi bitir
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  useEffect(() => {
    // Eğer kullanıcı yoksa hiç API isteği atma (Senin istediğin güvenlik)
    if (user) {
      fetchPosts();
    }
  }, [user]);

  // 1. Durum: Kullanıcı giriş yapmamış
  if (!user) {
    return (
      <div className="alert alert-warning">
        Lütfen içerikleri görmek için giriş yapınız.
      </div>
    );
  }

  // 2. Durum: Yükleniyor
  /*if (isLoading) {
    return <div>Yükleniyor...</div>;
  }*/

  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "50vh" }}>
        {/* Bootstrap Dönme Animasyonu */}
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
        <p className="mt-3 text-muted fw-bold">Akış Yenileniyor...</p>
      </div>
    );
  }

  // 3. Durum: Hata var
if (error) {
    return (
      <div className="text-center mt-5">
        <p className="text-danger fs-5">{error}</p>
        <button className="btn btn-outline-primary" onClick={fetchPosts}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard 
          key={post._id} 
          post={post} 
          onUpdate={fetchPosts} // 👈 ÖNEMLİ: Listeyi yenileme fonksiyonunu çocuğa gönderiyoruz
        />
      ))}
    </div>
  );
}
