import {
  success,
  internalServerError,
  badRequest,
} from "../../../helpers/api-response.js";
import Comment from "../../../models/Instagram/Comments.js";

// Comment CRUD
export const createComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const userId = req.user._id;
    
    if (!postId || !comment) {
      return badRequest(res, "Post ID and comment text are required");
    }
    
    const newComment = new Comment({
      userId,
      postId,
      comment,
    });
    await newComment.save();
    await newComment.populate('userId', 'username');
    
    return success(res, "Comment created successfully", { comment: newComment });
  } catch (error) {
    return internalServerError(res, error.message);
  }
};

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Get only top-level comments (no parentId)
    const comments = await Comment.find({ 
      postId,
      parentId: null
    })
      .populate('userId', 'username')
      .populate({
        path: 'replies',
        populate: {
          path: 'userId',
          select: 'username',
        },
        options: { sort: { createdAt: 1 } }
      })
      .sort({ createdAt: -1 });
    
    return success(res, "Comments fetched successfully", { comments });
  } catch (error) {
    return internalServerError(res, error.message);
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;
    
    if (!comment) {
      return badRequest(res, "Comment text is required");
    }
    
    const existingComment = await Comment.findById(id);
    if (!existingComment) {
      return badRequest(res, "Comment not found");
    }
    
    if (existingComment.userId.toString() !== userId.toString()) {
      return badRequest(res, "You can only update your own comments");
    }
    
    existingComment.comment = comment;
    await existingComment.save();
    
    return success(res, "Comment updated successfully", existingComment);
  } catch (error) {
    return internalServerError(res, error.message);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const comment = await Comment.findById(id);
    if (!comment) {
      return badRequest(res, "Comment not found");
    }
    
    if (comment.userId.toString() !== userId.toString()) {
      return badRequest(res, "You can only delete your own comments");
    }
    
    await Comment.findByIdAndDelete(id);
    return success(res, "Comment deleted successfully", {});
  } catch (error) {
    return internalServerError(res, error.message);
  }
};

// Reply function
export const createReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;
    
    if (!comment) {
      return badRequest(res, "Reply text is required");
    }
    
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return badRequest(res, "Parent comment not found");
    }
    
    const reply = new Comment({
      userId,
      postId: parentComment.postId,
      comment,
      parentId: commentId,
    });
    await reply.save();
    
    parentComment.replies.push(reply._id);
    await parentComment.save();
    
    await reply.populate('userId', 'username');
    return success(res, "Reply created successfully", { reply });
  } catch (error) {
    return internalServerError(res, error.message);
  }
};

export const getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const replies = await Comment.find({ parentId: commentId })
      .populate('userId', 'username')
      .populate({
        path: 'replies',
        populate: {
          path: 'userId',
          select: 'username'
        }
      })
      .sort({ createdAt: 1 });
    
    return success(res, "Replies fetched successfully", { replies });
  } catch (error) {
    return internalServerError(res, error.message);
  }
};

