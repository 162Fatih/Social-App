import { useState, useRef } from "react";
import { createPost } from "../../api/post.api";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

import FormImagePreview from "../Component/FormImagePreview";
import Avatar from "../Component/Avatar";

import "../../styles/PostForm.css";

export default function PostForm({ onPostCreated, theme }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (image) formData.append("image", image);

      await createPost(formData);
      setText("");
      removeImage();
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error("Post hatası:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`card border-0 border-bottom rounded-0 px-3 py-2 post-form-card ${theme === "dark" ? "dark" : ""}`}
    >
      <div className="d-flex">
        <div className="me-3">
          <Avatar userId={user?._id || user?.id} profileImage={user?.avatar} />
        </div>

        <div className="w-100 mt-1">
          <div className="mb-1">
            <Link
              to={`/profile/${user?._id || user?.id}`}
              className="text-decoration-none fw-bold username-link"
              style={{ fontSize: "0.95rem" }}
            >
              {user?.username || "Kullanıcı"}
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              className="form-control border-0 shadow-none fs-5 p-0 mt-1 post-textarea"
              rows="2"
              placeholder="Gönderi paylaş..."
              style={{
                resize: "none",
                backgroundColor: "transparent",
                minHeight: "60px",
              }}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <FormImagePreview preview={imagePreview} onRemove={removeImage} />

            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-link text-primary p-2 border-0 shadow-none rounded-circle hover-bg-light"
                  onClick={() => fileInputRef.current.click()}
                >
                  <i className="bi bi-image fs-5"></i>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="d-none"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <button
                type="submit"
                disabled={(!text.trim() && !image) || isSubmitting}
                className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm"
              >
                {isSubmitting ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  "Paylaş"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
