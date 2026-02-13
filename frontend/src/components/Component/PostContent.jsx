export default function PostContent({ text, image }) {
  return (
    <>
      {text && (
        <p
          className="card-text mb-2 post-text"
          style={{ fontSize: "0.95rem", lineHeight: "1.5" }}
        >
          {text}
        </p>
      )}

      {image && (
        <div className="post-media-wrapper mb-3">
          <img
            src={
              image.startsWith("http")
                ? image
                : `${import.meta.env.VITE_BACKEND_URL}${image}`
            }
            alt="Post content"
            className="post-image"
          />
        </div>
      )}
    </>
  );
}
