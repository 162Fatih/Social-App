export default function FormImagePreview({ preview, onRemove }) {
  if (!preview) return null;

  return (
    <div className="position-relative mt-2 mb-2">
      <button
        type="button"
        className="btn btn-dark btn-sm position-absolute rounded-circle m-2 opacity-75 d-flex align-items-center justify-content-center"
        style={{
          top: 0,
          right: "10px",
          zIndex: 10,
          width: "30px",
          height: "30px",
        }}
        onClick={onRemove}
      >
        <i className="bi bi-x-lg" style={{ fontSize: "14px" }}></i>
      </button>
      <img
        src={preview}
        alt="preview"
        className="img-fluid rounded-4 border w-100 shadow-sm"
        style={{ maxHeight: "350px", objectFit: "cover" }}
      />
    </div>
  );
}
