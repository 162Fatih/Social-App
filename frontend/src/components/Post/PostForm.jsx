import { useState } from "react";
import { createPost } from "../../api/post.api";

export default function PostForm({ onPostCreated }) {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await createPost({ text });
    setText("");
    if (onPostCreated) {
      onPostCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Ne düşünüyorsun?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Paylaş</button>
    </form>
  );
}
