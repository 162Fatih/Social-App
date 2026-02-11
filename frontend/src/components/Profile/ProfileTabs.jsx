export default function ProfileTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "posts", label: "Gönderiler" },
    { id: "likes", label: "Beğenilenler" },
    { id: "saved", label: "Kaydedilenler" },
  ];

  return (
    <div className="px-4 border-bottom">
      <ul className="nav nav-tabs nav-fill border-0">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link border-0 rounded-0 ${
                activeTab === tab.id
                  ? "active fw-bold border-bottom border-dark border-3"
                  : "text-muted"
              }`}
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
