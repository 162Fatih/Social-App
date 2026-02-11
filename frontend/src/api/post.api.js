import api from "./axios";

export const createPost = (data) =>
  api.post("/posts/create", data);

export const getFeedPosts = () => {
  return api.get("/posts");
};

export const getExplorePosts = () => {
  return api.get("/posts/explore");
};

export const likePost = (postId) =>
  api.put(`/posts/${postId}/like`);

export const deletePost = (postId) =>
  api.delete(`/posts/delete/${postId}`);