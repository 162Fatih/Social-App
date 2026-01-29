import { useEffect, useState } from "react";
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
}
