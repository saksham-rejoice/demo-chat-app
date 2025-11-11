import { createPost } from "../../controllers/Instagram/posts/index.js"
import { authenticate } from "../../middleware/auth.js";
export const instagramPostsRouter = (app) => {
    app.post('/instagram/posts',authenticate, createPost);
}