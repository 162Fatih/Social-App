import { useState, useEffect } from "react";
import ExplorePostList from "../components/Post/ExplorePostList";
import RightAside from "../components/Layout/RightAside";

export default function Explore() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div
      className={`min-vh-100 ${theme === "dark" ? "bg-black text-white" : "bg-white text-dark"}`}
      style={{ transition: "background-color 0.3s ease" }}
    >
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div
            className={`col-12 col-md-8 col-lg-6 border-start border-end min-vh-100 p-0 ${
              theme === "dark" ? "border-secondary" : ""
            }`}
          >
            <div className="px-3 pt-3">
              <h4 className="fw-bold mb-4">Keşfet</h4>

              <ExplorePostList theme={theme} />
            </div>
          </div>

          <div className="col-lg-4 d-none d-lg-block">
            <RightAside theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}
