import PostCard from "./PostCard";

export default function HomePostList({ posts, fetchPosts, theme }) {
  return (
    <div className="d-flex flex-column gap-3 px-2">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onUpdate={fetchPosts}
            theme={theme}
          />
        ))
      ) : (
        <div className="text-center py-5 text-muted bg-light rounded border">
          <p>Henüz hiç gönderi yok.</p>
        </div>
      )}
    </div>
  );
}
