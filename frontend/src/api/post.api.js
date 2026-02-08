import api from "./axios";

export const createPost = (data) =>
  api.post("/posts", data);

/*export const getPosts = () =>
  api.get("/posts");*/

export const getFeedPosts = () => {
  return api.get("/posts");
};

export const getExplorePosts = () => {
  return api.get("/posts/explore");
};

export const likePost = (postId) =>
  api.put(`/posts/like/${postId}`);

export const deletePost = (postId) =>
  api.delete(`/posts/${postId}`);