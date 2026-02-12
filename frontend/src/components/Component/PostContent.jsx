export default function PostContent({ text, image }) {
  const backendUrl = "http://localhost:5000";

  return (
    <>
      <p
        className="card-text mb-3"
        style={{ fontSize: "0.95rem", lineHeight: "1.5" }}
      >
        {text}
      </p>
      {image && (
        <div className="post-image-container mb-3">
          <img
            src={image.startsWith("http") ? image : `${backendUrl}${image}`}
            alt="Post content"
            className="img-fluid w-100"
            style={{
              maxHeight: "500px",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
        </div>
      )}
    </>
  );
}
