import {
  getFollowers,
  getUsers,
  toggleFollower,
  getFollowing,
} from "../../controllers/Instagram/followers/index.js";
import {
  createPost,
  updatePost,
  getPostById,
  getPosts,
  deletePost,
  uploadPostImage,
  deleteUploadImage,
  trendingHastags,
  getPostsByHashtag,
} from "../../controllers/Instagram/posts/index.js";
import { authenticate } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";
export const instagramPostsRouter = (app) => {
  app.post(
    "/api/instagram/posts/upload",
    authenticate,
    upload.single("postImage"),
    uploadPostImage
  );

  app.delete(
    "/api/instagram/posts/delete/:id",
    authenticate,
    deleteUploadImage
  );

  app.post(
    "/api/instagram/posts",
    authenticate,
    //upload.single("postImage"),
    createPost
  );
  app.put(
    "/api/instagram/posts/:id",
    authenticate,
    upload.single("postImage"),
    updatePost
  );
  app.get("/api/instagram/posts/:id", authenticate, getPostById);
  app.get("/api/instagram/posts", authenticate, getPosts);
  app.delete("/api/instagram/posts/:id", authenticate, deletePost);
  app.get("/api/instagram/trending-hashtags", authenticate, trendingHastags);
  app.get(
    "/api/instagram/posts/trending-hashtags/:hashtag",
    authenticate,
    getPostsByHashtag
  );
  // followers
  app.get("/api/instagram/followers", authenticate, getFollowers);
  app.post("/api/instagram/followers", authenticate, toggleFollower);
  app.get("/api/instagram/suggested/users", authenticate, getUsers);
  app.get("/api/instagram/following", authenticate, getFollowing);
};
