import {
  createPost,
  updatePost,
  getPostById,
  getPosts,
  deletePost,
} from "../../controllers/Instagram/posts/index.js";
import { authenticate } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";
export const instagramPostsRouter = (app) => {
  app.post(
    "/api/instagram/posts",
    authenticate,
    upload.single("postImage"),
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
};
