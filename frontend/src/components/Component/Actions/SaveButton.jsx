import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import "../../../styles/SaveButton.css";

export default function SaveButton({ isSavedInitial = false }) {
  const { theme } = useTheme();
  const [isSaved, setIsSaved] = useState(isSavedInitial);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const isDark = theme === "dark";

  return (
    <button
      onClick={handleSave}
      className={`btn btn-link text-decoration-none p-0 shadow-none border-0 bg-transparent ${
        isSaved ? "text-primary" : isDark ? "text-white" : "text-muted"
      }`}
    >
      <i
        className={`bi ${isSaved ? "bi-bookmark-fill" : "bi-bookmark"} fs-5`}
      ></i>
    </button>
  );
}
