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
  isSuggested?: boolean;
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
  hashtags?: string[];
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
export interface SuggestedUsersResponse extends BaseResponse {
  data: User[];
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

// -----------------------------
//  Activity
// -----------------------------

export interface Activity {
  _id?: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  type:
    | "FOLLOW"
    | "UNFOLLOW"
    | "LOGIN"
    | "POST_UPLOAD"
    | "POST_DELETE"
    | "UPDATE_PROFILE"
    | "POST_LIKE"
    | "POST_UNLIKE"
    | "POST_COMMENT";
  targetUser?: {
    _id: string;
    username: string;
    email: string;
  } | null;
  post?: {
    _id: string;
    caption: string;
  } | null;
  metadata?: { [key: string]: any };
  createdAt?: string | Date;
  updatedAt?: string | Date;
  __v?: number;
}

export interface ActivityLogResponse extends BaseResponse {
  data: Activity[];
}
export interface ActivityLogRequest {
  type:
    | "FOLLOW"
    | "UNFOLLOW"
    | "LOGIN"
    | "POST_UPLOAD"
    | "POST_DELETE"
    | "UPDATE_PROFILE"
    | "POST_LIKE"
    | "POST_UNLIKE"
    | "POST_COMMENT";
  targetUser?: string;
  post?: string;
  metadata?: { [key: string]: any };
}

// STORIES

export interface StoryRequest {
  imageId: string;
}
export interface StoryResponse extends BaseResponse {
  data: {
    myStories: StoryUser | null;
    otherStories: StoryUser[];
  };
}

export interface StoryUser {
  userId: string;
  username: string;
  imageUrls: string[];
}

// PROFILE
export interface ProfileResponse {
  data: ProfileData;
  message: string;
  error: boolean;
  success: boolean;
}

export interface ProfileData {
  username: string;
  email: string;
  profileImage: string;
  bio: string;
  website: string;
  followers: number;
  following: number;
  totalPosts: number;
  posts: Post[];
  id: string;
  metadata: Metadata;
}

export interface Post {
  _id: string;
  caption: string;
  imageDetails: ImageDetails;
  location: string;
  hashtagRefs: string[];
  user: string;
  likes: any[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ImageDetails {
  _id: string;
  url: string;
}

export interface Metadata {
  location: LocationMetadata;
  social: SocialMetadata;
  device: DeviceMetadata;
}

export interface LocationMetadata {
  city: string | null;
  state: string | null;
  country: string | null;
  timezone: string | null;
}

export interface SocialMetadata {
  themeColor: string;
  accountType: "public" | "private";
  interests: string[];
}

export interface DeviceMetadata {
  platform: "android" | "ios" | "web" | null;
  model: string | null;
  appVersion: string | null;
  ip: string | null;
}
export interface UpdateProfileRequest {
  bio?: string;
  website?: string;
  username?: string;
  metadata?: UpdateMetadata;
}

export interface UpdateMetadata {
  location: UpdateLocationMetadata;
  social: UpdateSocialMetadata;
  device: UpdateDeviceMetadata;
}

export interface UpdateLocationMetadata {
  city: string;
  state: string;
  country: string;
  timezone: string;
}

export interface UpdateSocialMetadata {
  themeColor: string;
  accountType: "public" | "private";
  interests: string[];
}

export interface UpdateDeviceMetadata {
  platform: "android" | "ios" | "web";
  model: string;
  appVersion: string;
  ip: string;
}
