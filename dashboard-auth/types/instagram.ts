// -----------------------------
// Core Reusable Interfaces
// -----------------------------

export interface BaseResponse {
  message: string;
  error: boolean;
  success: boolean;
}

export interface BaseTimestamps {
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// -----------------------------
// User Interfaces
// -----------------------------

export interface InstagramUser {
  _id: string;
  username: string;
  email?: string; // optional for endpoints that do not return email
}

export interface User {
  _id: string;
  username: string;
}

// For lists
export interface UsersData {
  users: User[];
}

// -----------------------------
// Image Interfaces
// -----------------------------

export interface ImageDetails {
  _id: string;
  url: string;
}

// -----------------------------
// Post Interfaces
// -----------------------------

export interface InstagramPost extends BaseTimestamps {
  _id: string;
  caption: string;
  imageDetails: ImageDetails;
  location: string;
  hashtags: string[];
  user: InstagramUser | string; // sometimes server returns just ID
  likes: string[];
  comments: string[];
}

export interface InstagramPostsResponse extends BaseResponse {
  data: {
    posts: InstagramPost[];
  };
}

// -----------------------------
// Photo Upload
// -----------------------------

export interface UploadInstagramPhotoRequest {
  image: File;
}

export interface UploadInstagramPhotoResponse extends BaseResponse {
  data: ImageDetails;
}

// -----------------------------
// Publish Post
// -----------------------------

export interface PublishInstagramPostRequest {
  caption: string;
  location: string;
  hashtags: string[];
  imageId: string;
}

// -----------------------------
// Trending Hashtags
// -----------------------------

export interface TrendingHashtag {
  hashtag: string;
  count: number;
}

export interface TrendingHashtagResponse extends BaseResponse {
  data: {
    trendingHashtags: TrendingHashtag[];
  };
}

// -----------------------------
// Saved Posts / Collections
// -----------------------------

export interface SavedPost {
  postId: string;
  collectionName?: string;
}

export interface SavedPostData extends BaseTimestamps {
  _id: string;
  caption: string;
  imageDetails: ImageDetails;
  location: string;
  hashtags: string[];
  user: string; // saved post often returns user ID only
  likes: string[];
  comments: string[];
}

export interface SavedCollectionData extends BaseTimestamps {
  _id: string;
  collectionName: string;
  savedPost: SavedPostData[];
  user: string;
}

export interface SavedPostsResponse extends BaseResponse {
  data: SavedCollectionData;
}

export interface Collection {
  collectionName: string;
  postId?: string;
}

// -----------------------------
// Suggested Users
// -----------------------------

export interface SuggestedUsersResponse extends BaseResponse {
  data: UsersData;
}

// -----------------------------
// Followers / Following
// -----------------------------

export interface Follower {
  _id: string;
  username: string;
}

export interface FollowersData {
  followers: Follower[];
}

export interface FollowersResponse extends BaseResponse {
  data: FollowersData;
}

export interface FollowingUser {
  _id: string;
  username: string;
}

export interface FollowingData {
  following: FollowingUser[];
}

export interface FollowingResponse extends BaseResponse {
  data: FollowingData;
}
