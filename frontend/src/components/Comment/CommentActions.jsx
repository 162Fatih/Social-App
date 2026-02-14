import Like from "../Component/Actions/Like";
import CommentButton from "../Component/Actions/CommentButton";
import SaveButton from "../Component/Actions/SaveButton";

export default function CommentActions({
  commentId,
  likedByCurrentUser,
  likesCount,
  repliesCount,
  onReplyClick,
}) {
  return (
    <div className="d-flex justify-content-between align-items-center pt-1">
      <div className="d-flex align-items-center gap-4">
        <Like
          postId={commentId}
          likedByCurrentUser={likedByCurrentUser}
          likesCount={likesCount}
          isComment={true}
        />

        <CommentButton commentsCount={repliesCount} onClick={onReplyClick} />
      </div>

      <SaveButton isSavedInitial={false} />
    </div>
  );
}
