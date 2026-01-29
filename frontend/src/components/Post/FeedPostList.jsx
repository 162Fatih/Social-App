import { useEffect, useState } from "react";
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
}
