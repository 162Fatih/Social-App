export default function ProfileSavedCollections({
  activeCollection,
  setActiveCollection,
  collections,
}) {
  return (
    <div className="mb-4">
      <div
        className="d-flex gap-2 overflow-auto pb-2"
        style={{ whiteSpace: "nowrap" }}
      >
        {collections.map((col) => (
          <button
            key={col}
            onClick={() => setActiveCollection(col)}
            className={`btn btn-sm rounded-pill px-3 ${activeCollection === col ? "btn-dark" : "btn-outline-secondary"}`}
          >
            {col}
          </button>
        ))}
        <button className="btn btn-sm btn-outline-primary rounded-pill px-3">
          <i className="bi bi-plus-lg"></i> Yeni Klasör
        </button>
      </div>
      <hr className="mt-2 opacity-25" />
    </div>
  );
}
