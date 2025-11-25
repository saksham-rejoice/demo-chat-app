import {
  internalServerError,
  badRequest,
  success,
} from "../../../helpers/api-response.js";
import PostModel from "../../../models/Instagram/instagramPost.js";
import { logInfo } from "../../../services/loggerService.js";

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await PostModel.findById(postId);
    if (!post) {
      return badRequest(res, "Post not found");
    }

    const isLiked = post.likes.includes(userId);

    const update = isLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    await PostModel.findByIdAndUpdate(postId, update);

    logInfo(isLiked ? "Post unliked" : "Post liked", { 
      userId, 
      postId, 
      action: isLiked ? "POST_UNLIKE" : "POST_LIKE", 
      ip: req.ip 
    });

    return success(
      res,
      isLiked ? "Like removed successfully" : "Like added successfully"
    );
  } catch (error) {
    return internalServerError(res, error.message);
  }
};
