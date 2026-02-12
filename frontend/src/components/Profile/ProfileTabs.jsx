export default function ProfileTabs({ activeTab, setActiveTab, theme }) {
  const tabs = [
    { id: "posts", label: "Gönderiler" },
    { id: "likes", label: "Beğenilenler" },
    { id: "saved", label: "Kaydedilenler" },
  ];

  const isDark = theme === "dark";

  return (
    <div className={`px-4 border-bottom ${isDark ? "border-secondary" : ""}`}>
      <ul className="nav nav-tabs nav-fill border-0">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link border-0 rounded-0 py-3 ${
                activeTab === tab.id
                  ? isDark
                    ? "active bg-transparent text-white border-bottom border-primary border-3" // Koyu mod aktif
                    : "active bg-transparent fw-bold border-bottom border-dark border-3" // Açık mod aktif
                  : isDark
                    ? "text-secondary"
                    : "text-muted"
              }`}
              style={{
                backgroundColor: "transparent",
                transition: "color 0.2s, border-bottom 0.2s",
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
