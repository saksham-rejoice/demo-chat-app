export interface InstagramUser {
  _id: string;
  username: string;
  email: string;
}

export interface ImageDetails {
  _id: string;
  url: string;
}

export interface InstagramPost {
  _id: string;
  caption: string;
  imageDetails: ImageDetails;
  location: string;
  hashtags: string[];
  user: InstagramUser;
  likes: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface InstagramPostsResponse {
  data: {
    posts: InstagramPost[];
  };
  message: string;
  error: boolean;
  success: boolean;
}