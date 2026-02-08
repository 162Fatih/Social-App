import { createContext, useContext, useState, useEffect } from "react";

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {

  const [globalLikes, setGlobalLikes] = useState({});

  const updateGlobalLike = (postId, liked, count) => {
    setGlobalLikes((prev) => ({
      ...prev,
      [postId]: { liked, count },
    }));
  };

  const getLikeStatus = (postId, initialLiked, initialCount) => {
    if (globalLikes[postId]) {
      return globalLikes[postId];
    }
    return { liked: initialLiked, count: initialCount };
  };

  return (
    <LikeContext.Provider value={{ updateGlobalLike, getLikeStatus }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useGlobalLike = () => useContext(LikeContext);