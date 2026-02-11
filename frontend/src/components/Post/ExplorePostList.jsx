import { useEffect, useState } from "react";
import { getExplorePosts } from "../../api/post.api";
import PostCard from "./PostCard";

export default function ExplorePostList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
        const res = await getExplorePosts();
        setPosts(res.data);
    } catch (error) {
        console.error("Explore postları yüklenemedi", error);
    } finally {
        setTimeout(() => setIsLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchPosts(); 
  }, []);


  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
        <p className="mt-3 text-muted fw-bold">Keşfet Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      {posts.map(post => (
        <PostCard 
            key={post._id} 
            post={post}
            onUpdate={fetchPosts} 
        />
      ))}
    </div>
  );
}
