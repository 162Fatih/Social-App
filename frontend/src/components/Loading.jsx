export default function Loading({ message = "Yükleniyor...", theme }) {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "50vh" }}
    >
      <div
        className="spinner-border text-primary"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span className="visually-hidden">Yükleniyor...</span>
      </div>

      <p
        className="mt-3 fw-bold"
        style={{
          color: theme === "dark" ? "#71767b" : "#6c757d",
          transition: "color 0.3s ease",
        }}
      >
        {message}
      </p>
    </div>
  );
}
