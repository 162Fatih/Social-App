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
        /* CSS'teki dinamik boyutlandırma kurallarının çalışması için bu class şart */
        <div className="post-media-wrapper mb-3">
          <img
            src={
              image.startsWith("http")
                ? image
                : `${import.meta.env.VITE_BACKEND_URL}${image}`
            }
            alt="Post content"
            /* Inline stilleri temizleyip yönetimi tamamen CSS'e bıraktık */
            className="post-image"
          />
        </div>
      )}
    </>
  );
}
