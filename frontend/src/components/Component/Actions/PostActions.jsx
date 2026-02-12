import Like from "./Like";
import CommentButton from "./CommentButton";
import SaveButton from "./SaveButton";

export default function PostActions({
  postId,
  likedByCurrentUser,
  likesCount,
  commentsCount,
  theme,
}) {
  return (
    <div className="d-flex justify-content-between align-items-center pt-1">
      <div className="d-flex align-items-center gap-4">
        <Like
          postId={postId}
          likedByCurrentUser={likedByCurrentUser}
          likesCount={likesCount}
          theme={theme}
        />

        <CommentButton
          commentsCount={commentsCount}
          onClick={() => console.log("Yorumlar açılıyor...")}
          theme={theme}
        />
      </div>

      <SaveButton theme={theme} />
    </div>
  );
}
