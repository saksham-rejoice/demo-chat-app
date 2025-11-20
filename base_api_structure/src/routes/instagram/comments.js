import { 
  createComment, 
  getComments, 
  updateComment, 
  deleteComment,
  createReply,
  getReplies
} from "../../controllers/Instagram/comments/index.js";
import { authenticate } from "../../middleware/auth.js";

export const instagramCommentsRouter = (app) => {
  // Comment routes
  app.post('/api/instagram/comments', authenticate, createComment);
  app.get('/api/instagram/comments/:postId', authenticate, getComments);
  app.put('/api/instagram/comments/:id', authenticate, updateComment);
  app.delete('/api/instagram/comments/:id', authenticate, deleteComment);
  
  // Reply routes
  app.post('/api/instagram/comments/:commentId/reply', authenticate, createReply);
  app.get('/api/instagram/comments/:commentId/replies', authenticate, getReplies);
};