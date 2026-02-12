import { useEffect, useState } from "react";
import { getExplorePosts } from "../../api/post.api";
import PostCard from "./PostCard";
import Loading from "../Loading";

export default function ExplorePostList({ theme }) {
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
    return <Loading message="Keşfet Yükleniyor..." theme={theme} />;
  }

  return (
    <div className="mt-3">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onUpdate={fetchPosts}
          theme={theme}
        />
      ))}
    </div>
  );
}
