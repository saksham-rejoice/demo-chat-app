import apiClient from "./apiClient";
import apiEndpoints from "./endpoint";
import { InstagramPostsResponse, InstagramPost } from "@/types/instagram";

export const getInstagramPosts = async (): Promise<InstagramPost[]> => {
  try {
    const response = await apiClient.get<InstagramPostsResponse>(
      apiEndpoints.instagram.posts.list
    );
    return response.data.data.posts;
  } catch (error) {
    throw error;
  }
};

export const getInstagramPostById = async (
  id: string
): Promise<InstagramPost> => {
  try {
    const response = await apiClient.get<{ data: { post: InstagramPost } }>(
      `${apiEndpoints.instagram.posts.getById}/${id}`
    );
    return response.data.data.post;
  } catch (error) {
    throw error;
  }
};

// comments

export const postComment = async (postId: number, text: string): Promise<any> => {
  try {
    const response = await apiClient.post(
      apiEndpoints.instagram.comments.create,
      { postId, comment: text }
    );
    return response.data.data.comment;
  } catch (error) {
    throw error;
  }
};

export const getComments = async (postId: number): Promise<any> => {
  try {
    const response = await apiClient.get(
      `${apiEndpoints.instagram.comments.list}/${postId}`
    );
    return response.data.data.comments;
  } catch (error) {
    throw error;
  }
};

export const postReply = async (commentId: string, text: string): Promise<any> => {
  try {
    const response = await apiClient.post(
      `${apiEndpoints.instagram.comments.create}/${commentId}/reply`,
      { comment: text }
    );
    return response.data.data.reply;
  } catch (error) {
    throw error;
  }
};

export const getReplies = async (commentId: string): Promise<any> => {
  try {
    const response = await apiClient.get(
      `${apiEndpoints.instagram.comments.list}/${commentId}/replies`
    );
    return response.data.data.replies;
  } catch (error) {
    throw error;
  }
};
