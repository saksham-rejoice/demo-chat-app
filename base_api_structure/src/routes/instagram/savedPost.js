import {
  savePost,
  getSavedPost,
  removeSavedPostFromCollection,
  createCollection,
  getAllCollection,
  updateAllCollection,
  deleteCollection,
} from "../../controllers/Instagram/saved-post";
import { authenticate } from "../../middleware/auth.js";

export const instagramSavedPostRouter = (app) => {
  app.post("/api/instagram/saved-post", authenticate, savePost);
  app.get("/api/instagram/saved-post/:id", authenticate, getSavedPost);
  app.delete(
    "/api/instagram/saved-post/:id",
    authenticate,
    removeSavedPostFromCollection
  );
  app.post("/api/instagram/collections", authenticate, createCollection);
  app.get("/api/instagram/collections", authenticate, getAllCollection);
  app.put("/api/instagram/collections/:id", authenticate, updateAllCollection);
  app.delete("/api/instagram/collections/:id", authenticate, deleteCollection);
};
