import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { useGlobalLike } from "../../context/LikeContext";

import './Like.css';

export default function Like({ postId, likes = [] }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const { getLikeStatus, updateGlobalLike } = useGlobalLike();
    
    const initialLikedState = user && likes.includes(user._id);
    const initialCountState = likes.length;

    const { liked: isLiked, count: likeCount } = getLikeStatus(postId, initialLikedState, initialCountState);

    /*useEffect(() => {
        console.log("Like durumu güncellendi:", isLiked);
    },[isLiked]);*/

    const handleLikeClick = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        const newLikedStatus = !isLiked;
        const newCount = isLiked ? likeCount - 1 : likeCount + 1;

        updateGlobalLike(postId, newLikedStatus, newCount);

        try {
            const res = await api.put(`/posts/${postId}/like`);
            
            if (res.data) {
                updateGlobalLike(postId, res.data.liked, res.data.likesCount);
            }
        } catch (error) {
            console.error("Beğeni hatası:", error);
            updateGlobalLike(postId, isLiked, likeCount);
        }
    };

    return (
        <button 
            className={`btn d-flex align-items-center gap-2 border-0 bg-transparent p-0 like-btn ${isLiked ? 'liked' : ''}`} 
            onClick={handleLikeClick}
        >

            <i className="bi bi-hand-thumbs-up fs-4"></i>
            <i className="bi bi-hand-thumbs-up-fill fs-4"></i>
            
            <span className="fw-bold user-select-none">
                {likeCount}
            </span>
        </button>
    );
}