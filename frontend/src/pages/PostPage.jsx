import { useEffect, useState, useCallback } from "react";
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

  // Veriyi çeken ana fonksiyon (tek merkez)
  const fetchPostDetails = useCallback(async () => {
    try {
      // Sadece postId varsa istek at
      if (!postId) return;

      const res = await getPostById(postId);
      setPost(res.data);
    } catch (error) {
      console.error("Post yüklenemedi:", error);
      // Eğer post gerçekten yoksa (başkası silmişse veya yanlış ID) ana sayfaya at
      if (error.response?.status === 404) {
        alert("Bu gönderi silinmiş veya mevcut değil.");
        navigate("/home");
      }
    } finally {
      setLoading(false);
    }
  }, [postId, navigate]);

  // Sayfa açıldığında veya bir güncelleme tetiklendiğinde çalışır
  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails, refreshTrigger]);

  // PostCard veya CommentList'ten gelen güncelleme sinyali
  const handleUpdateAll = (isDeleted = false) => {
    if (isDeleted === true) {
      // EĞER SİLİNDİYSE: Hiç fetch yapmadan direkt ana sayfaya git
      // Böylece 404 hatasına düşmeyiz.
      navigate("/home");
    } else {
      // EĞER GÜNCELLENDİYSE (Yorum/Beğeni): Sadece trigger'ı artır,
      // useEffect yukarıdaki fetchPostDetails'i bir kez düzgünce çağıracaktır.
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  if (loading) return <Loading message="Gönderi Yükleniyor..." />;
  if (!post) return <div className="p-4 text-center">Post bulunamadı.</div>;

  return (
    <div
      className={`min-vh-100 ${isDark ? "bg-black text-white" : "bg-white text-dark"}`}
    >
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div
            className={`col-12 col-md-8 col-lg-6 border-start border-end min-vh-100 p-0 ${
              isDark ? "border-secondary" : ""
            }`}
          >
            {/* Header */}
            <div
              className={`d-flex align-items-center p-3 sticky-top ${
                isDark ? "bg-black bg-opacity-75" : "bg-white bg-opacity-75"
              }`}
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

            {/* Post Detay */}
            <div className="border-bottom border-secondary border-opacity-10">
              <PostCard
                post={post}
                onUpdate={handleUpdateAll}
                isDetailView={true}
              />
            </div>

            {/* Yanıtlar Başlığı */}
            <div
              className={`p-3 border-bottom border-secondary border-opacity-10 ${
                isDark ? "bg-dark bg-opacity-25" : "bg-light"
              }`}
            >
              <span className="fw-bold small text-secondary text-uppercase">
                Yanıtlar
              </span>
            </div>

            {/* Yorumlar Listesi */}
            <CommentList
              postId={postId}
              refreshTrigger={refreshTrigger}
              onCommentDeleted={() => handleUpdateAll(false)}
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
