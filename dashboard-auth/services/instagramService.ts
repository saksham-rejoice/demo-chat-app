import apiClient from "./apiClient";
import apiEndpoints from "./endpoint";
import {
  InstagramPostsResponse,
  InstagramPost,
  UploadInstagramPhotoRequest,
  UploadInstagramPhotoResponse,
  PublishInstagramPostRequest,
  BaseResponse,
  TrendingHashtagResponse,
  SavedPost,
  SavedCollectionData,
  SavedPostsResponse,
  Collection,
  SuggestedUsersResponse,
  FollowersResponse,
  FollowingResponse,
  ActivityLogRequest,
  ActivityLogResponse,
  StoryRequest,
  StoryResponse,
  ProfileResponse,
  UpdateProfileRequest,
} from "@/types/instagram";

export const uploadInstagramPhoto = async ({
  image,
}: UploadInstagramPhotoRequest): Promise<UploadInstagramPhotoResponse> => {
  try {
    const formData = new FormData();
    formData.append("postImage", image);

    const response = await apiClient.post<UploadInstagramPhotoResponse>(
      apiEndpoints.instagram.posts.upload,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteInstagramPhoto = async (id: any): Promise<any> => {
  try {
    const response = await apiClient.delete(
      `${apiEndpoints.instagram.posts.delete}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const publishInstagramPost = async (
  data: PublishInstagramPostRequest
): Promise<BaseResponse> => {
  try {
    const response = await apiClient.post(
      apiEndpoints.instagram.posts.publish,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

export const trendingHashtags = async (): Promise<TrendingHashtagResponse> => {
  try {
    const response = await apiClient.get(
      apiEndpoints.instagram.posts.trendingHashtags
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// comments

export const postComment = async (
  postId: number,
  text: string
): Promise<BaseResponse> => {
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

export const postReply = async (
  commentId: string,
  text: string
): Promise<any> => {
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

// saved instagram post
export const saveInstagramPost = async ({
  postId,
  collectionName,
}: SavedPost): Promise<BaseResponse> => {
  try {
    const response = await apiClient.post(
      `${apiEndpoints.instagram.savedPosts.save}`,
      {
        postId,
        collectionName,
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getSavedPosts = async (
  id: string
): Promise<SavedCollectionData> => {
  try {
    const response = await apiClient.get<SavedPostsResponse>(
      `${apiEndpoints.instagram.savedPosts.list}/${id}`
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// saved post collection
export const createCollection = async ({
  collectionName,
  postId,
}: Collection): Promise<any> => {
  try {
    // First create the collection
    await apiClient.post(`${apiEndpoints.instagram.collection.create}`, {
      collectionName,
    });

    // Then save the post to it if postId is provided
    if (postId) {
      await saveInstagramPost({ postId, collectionName });
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
};
export const getCollection = async (): Promise<any> => {
  try {
    const response = await apiClient.get(
      `${apiEndpoints.instagram.collection.list}`
    );
    // Backend returns array directly, not nested in collections property
    return { collections: response.data.data || [] };
  } catch (error) {
    throw error;
  }
};
export const updateCollection = async (
  id: string,
  collectionName: string
): Promise<BaseResponse> => {
  try {
    const response = await apiClient.put(
      `${apiEndpoints.instagram.collection.update}/${id}`,
      {
        collectionName,
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
export const deleteCollection = async (id: string): Promise<BaseResponse> => {
  try {
    const response = await apiClient.delete(
      `${apiEndpoints.instagram.collection.delete}/${id}`
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
// suggestions

export const getSuggestedUsers = async (): Promise<SuggestedUsersResponse> => {
  try {
    const response = await apiClient.get(
      `${apiEndpoints.instagram.follow.suggestion}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// followers
export const getFollowers = async (): Promise<FollowersResponse> => {
  try {
    const response = await apiClient.get(
      `${apiEndpoints.instagram.follow.get}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFollowing = async (): Promise<FollowingResponse> => {
  try {
    const response = await apiClient.get(
      `${apiEndpoints.instagram.follow.getFollowing}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const followUser = async (id: string): Promise<BaseResponse> => {
  try {
    const response = await apiClient.post(
      `${apiEndpoints.instagram.follow.toggle}`,
      { userId: id }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const likePost = async (id: string): Promise<BaseResponse> => {
  try {
    const url = `${apiEndpoints.instagram.posts.like(id)}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Activity
export const logActivity = async (
  data: ActivityLogRequest
): Promise<BaseResponse> => {
  try {
    const response = await apiClient.post(
      apiEndpoints.instagram.activity.log,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getActivity = async (): Promise<ActivityLogResponse> => {
  try {
    const response = await apiClient.get(apiEndpoints.instagram.activity.list);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Instagram Stories
export const getStories = async (): Promise<StoryResponse> => {
  try {
    const response = await apiClient.get(apiEndpoints.instagram.stories.list);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createStory = async (
  data: StoryRequest
): Promise<BaseResponse> => {
  try {
    const response = await apiClient.post(
      apiEndpoints.instagram.stories.create,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Profile
export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await apiClient.get(apiEndpoints.instagram.profile.list);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<BaseResponse> => {
  try {
    const response = await apiClient.put(
      apiEndpoints.instagram.profile.updateDetails,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadPhoto = async (imageId: string): Promise<BaseResponse> => {
  try {
    const response = await apiClient.post(
      apiEndpoints.instagram.profile.updatePhoto,
      { imageId }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to upload photo");
  }
};
