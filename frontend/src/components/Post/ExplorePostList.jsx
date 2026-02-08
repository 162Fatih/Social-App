/*import { useEffect, useState } from "react";
import { getExplorePosts } from "../../api/post.api";
import PostCard from "./PostCard";

export default function ExplorePostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getExplorePosts().then(res => setPosts(res.data));
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
import { getExplorePosts } from "../../api/post.api";
import PostCard from "./PostCard";

export default function ExplorePostList() {
  const [posts, setPosts] = useState([]);

  // 1. Veri çekme işini bir fonksiyona atıyoruz (Tekrar çağırabilmek için)
  const fetchPosts = async () => {
    try {
        const res = await getExplorePosts();
        setPosts(res.data);
    } catch (error) {
        console.error("Explore postları yüklenemedi", error);
    }
  };

  useEffect(() => {
    fetchPosts(); // Sayfa açılınca çalıştır
  }, []);

  return (
    <div className="container mt-3">
      {posts.map(post => (
        <PostCard 
            key={post._id} 
            post={post}
            
            // 👇 İŞTE EKSİK OLAN PARÇA BURASIYDI 👇
            // Post silinince bu fonksiyon çalışacak ve listeyi yenileyecek
            onUpdate={fetchPosts} 
        />
      ))}
    </div>
  );
}
