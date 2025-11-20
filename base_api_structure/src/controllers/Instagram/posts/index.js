import {
  success,
  internalServerError,
  badRequest,
} from "../../../helpers/api-response";
import InstagramPost from "../../../models/Instagram/instagramPost";
import InstagramImage from "../../../models/Instagram/InstagramImage";
import { uploadImage, deleteImage } from "../../../services/imageService";
import { cleanupTempFile } from "../../../middleware/upload.js";

export async function createPost(req, res) {
  try {
    const { caption, hashtags, location } = req.body;
    const userId = req.user._id;
    if (!caption) {
      return badRequest(res, "Caption is required");
    }
    if (!hashtags) {
      return badRequest(res, "Hashtags is required");
    }
    if (!location) {
      return badRequest(res, "Location is required");
    }
    const file = req.file;
    if (!file) {
      return badRequest(res, "Post image is rquired");
    }
    const uploadResult = await uploadImage(file, "instagram/posts");
    const parsedHashtags = JSON.parse(hashtags);
    const imageData = {
      url: uploadResult.url,
      filename: uploadResult.fileName,
      fileId: uploadResult.fileId,
      userId: userId,
    };
    const instagramImage = new InstagramImage(imageData);
    await instagramImage.save();
    const post = new InstagramPost({
      caption: caption,
      hashtags: parsedHashtags,
      location: location,
      imageDetails: instagramImage._id,
      user: userId,
    });
    await post.save();
    return success(res, "Post created successfully", { post });
  } catch (error) {
    console.error("Error creating post:", error);
    return internalServerError(res, error.message);
  } finally {
    if (req.file) {
      cleanupTempFile(req.file.path);
    }
  }
}

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const posts = await InstagramPost.find()
      .populate("user", "username email")
      .populate("imageDetails", "url")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
      
    const totalPosts = await InstagramPost.countDocuments();
    const hasMore = offset + posts.length < totalPosts;
    
    return success(res, "Posts fetched successfully", { 
      posts, 
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasMore
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return internalServerError(res, error.message);
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await InstagramPost.findById(id)
      .populate("user", "username email")
      .populate("imageDetails", "url");
    if (!post) {
      return badRequest(res, "Post not found");
    }
    return success(res, "Post fetched successfully", { post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return internalServerError(res, error.message);
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption, description, hashtags, location } = req.body;
    const file = req.file;
    const userId = req.user._id;
    const post = await InstagramPost.findById(id);
    if (!post) {
      return badRequest(res, "Post not found");
    }
    if (post.imageDetails) {
      const imageDetails = await InstagramImage.findById(post.imageDetails);
      await deleteImage(imageDetails.fileId);
      const uploadResult = await uploadImage(file, "instagram/posts");
      const imageData = {
        url: uploadResult.url,
        filename: uploadResult.fileName,
        fileId: uploadResult.fileId,
        userId: userId,
      };
      const instagramImage = new InstagramImage(imageData);
      await instagramImage.save();
      post.imageDetails = instagramImage._id;
      const deleteOldImageDetails = await InstagramImage.findByIdAndDelete(
        post.imageDetails
      );
    }
    if (caption !== undefined) post.caption = caption;
    if (description !== undefined) post.description = description;
    if (hashtags !== undefined) post.hashtags = JSON.parse(hashtags);
    if (location !== undefined) post.location = location;
    await post.save();
    return success(res, "Post updated successfully", { post });
  } catch (error) {
    console.error("Error updating post:", error);
    return internalServerError(res, error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await InstagramPost.findById(id);
    if (!post) {
      return badRequest(res, "Post not found");
    }

    if (post.imageDetails) {
      const imageDetails = await InstagramImage.findById(post.imageDetails);
      await deleteImage(imageDetails.fileId);
      await InstagramImage.findByIdAndDelete(post.imageDetails);
    }
    await InstagramPost.findByIdAndDelete(id);
    return success(res, "Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    return internalServerError(res, error.message);
  }
};
