export default function RightAside() {
  return (
    <aside className="d-none d-lg-block ps-4 pt-2" style={{ width: "350px" }}>
      <div className="sticky-top" style={{ top: "10px" }}>
        <div className="mb-3">
          <div className="input-group bg-light rounded-pill px-3 py-1 border overflow-hidden">
            <span className="input-group-text bg-transparent border-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-transparent border-0 shadow-none"
              placeholder="Ara..."
            />
          </div>
        </div>

        <div className="bg-light rounded-4 p-3 border">
          <h5 className="fw-bold mb-3">İlginizi çekebilir</h5>
          <p className="text-muted small">
            Şimdilik burası boş, yakında içerik eklenecek.
          </p>
        </div>
      </div>
    </aside>
  );
}
