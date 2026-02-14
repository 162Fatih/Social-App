import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById } from "../api/post.api";
import PostCard from "../components/Post/PostCard";
import CommentList from "../components/Comment/CommentList";
import RightAside from "../components/Layout/RightAside";
import { useTheme } from "../context/ThemeContext";
import Loading from "../components/Loading";

export default function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchPostDetails = async () => {
    try {
      const res = await getPostById(postId);
      setPost(res.data);
    } catch (error) {
      console.error("Post yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId, refreshTrigger]);

  if (loading) return <Loading message="Gönderi Yükleniyor..." />;
  if (!post) return <div className="p-4 text-center">Post bulunamadı.</div>;

  return (
    <div
      className={`min-vh-100 ${isDark ? "bg-black text-white" : "bg-white text-dark"}`}
    >
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div
            className={`col-12 col-md-8 col-lg-6 border-start border-end min-vh-100 p-0 ${isDark ? "border-secondary" : ""}`}
          >
            <div
              className={`d-flex align-items-center p-3 sticky-top ${isDark ? "bg-black bg-opacity-75" : "bg-white bg-opacity-75"}`}
              style={{ backdropFilter: "blur(10px)", zIndex: 10 }}
            >
              <button
                className={`btn border-0 p-0 me-3 ${isDark ? "text-white" : "text-dark"}`}
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left fs-4"></i>
              </button>
              <h5 className="mb-0 fw-bold">Gönderi</h5>
            </div>

            <div className="border-bottom border-secondary border-opacity-10">
              <PostCard
                post={post}
                onUpdate={fetchPostDetails}
                isDetailView={true}
              />
            </div>

            <div
              className={`p-3 border-bottom border-secondary border-opacity-10 ${isDark ? "bg-dark bg-opacity-25" : "bg-light"}`}
            >
              <span className="fw-bold small text-secondary uppercase">
                Yanıtlar
              </span>
            </div>

            <CommentList
              postId={postId}
              refreshTrigger={refreshTrigger}
              onCommentDeleted={fetchPostDetails}
            />
          </div>

          <div className="col-lg-4 d-none d-lg-block">
            <RightAside />
          </div>
        </div>
      </div>
    </div>
  );
}
