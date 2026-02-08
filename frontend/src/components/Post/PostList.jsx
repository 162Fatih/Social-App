import { useEffect, useState } from "react";
import { getPosts } from "../../api/post.api";
import PostCard from "./PostCard";

export default function PostList() {
  const [posts, setPosts] = useState([]); // useState ile posts adında bir durum oluşturduk, başlangıç değeri boş dizi ve değer güncelleme fonksiyonu setPosts

  const fetchPosts = async () => {
    const res = await getPosts();
    setPosts(res.data);
  };

  useEffect(() => { // useEffect ile bileşen yüklendiğinde fetchPosts fonksiyonunu çağırıyoruz
    fetchPosts();
  }, []);

    return (
    <div>
        {posts
        .filter(p => p && p.user)
        .map(post => (
            <PostCard
            key={post._id}
            post={post}
            onUpdate={fetchPosts}
            />
        ))}
    </div>
    );
}
