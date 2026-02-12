import { useState } from "react";
import "../../../styles/SaveButton.css";

export default function SaveButton({ isSavedInitial = false, theme }) {
  const [isSaved, setIsSaved] = useState(isSavedInitial);

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Buraya ileride kaydetme API çağrısını ekleyebilirsin
  };

  return (
    <button
      onClick={handleSave}
      className={`btn btn-link text-decoration-none p-0 shadow-none border-0 bg-transparent ${isSaved ? "text-primary" : "text-muted"}`}
    >
      <i
        className={`bi ${isSaved ? "bi-bookmark-fill" : "bi-bookmark"} fs-5`}
      ></i>
    </button>
  );
}
