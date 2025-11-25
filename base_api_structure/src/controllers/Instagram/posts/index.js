import {
  success,
  internalServerError,
  badRequest,
} from "../../../helpers/api-response.js";
import InstagramPost from "../../../models/Instagram/instagramPost.js";
import InstagramImage from "../../../models/Instagram/InstagramImage.js";
import { uploadImage, deleteImage } from "../../../services/imageService.js";
import { cleanupTempFile } from "../../../middleware/upload.js";
import { logInfo, logError } from "../../../services/loggerService.js";

//image management

export async function uploadPostImage(request, response) {
  try {
    const file = request.file;
    const userId = request.user._id;
    if (!file) {
      return badRequest(response, "No file uploaded");
    }
    const uploadResult = await uploadImage(file, "instagram/posts");
    const imageData = {
      url: uploadResult.url,
      filename: uploadResult.fileName,
      fileId: uploadResult.fileId,
      userId: userId,
    };
    const instagramImage = new InstagramImage(imageData);
    await instagramImage.save();
    logInfo("Instagram image uploaded", { userId, action: "INSTAGRAM_IMAGE_UPLOAD", imageId: instagramImage._id, ip: request.ip });
    return success(response, "Image uploaded successfully", {
      url: instagramImage.url,
      _id: instagramImage._id,
    });
  } catch (error) {
    return internalServerError(response, error.message);
  }
}

export async function deleteUploadImage(request, response) {
  try {
    const { id } = request.params;
    const result = await InstagramImage.findOne({ _id: id }).select("fileId");
    await deleteImage(result.fileId);
    await InstagramImage.findByIdAndDelete(id);
    return success(response, "Image deleted successfully", {
      fileId: result.fileId,
    });
  } catch (error) {
    return internalServerError(response, error.message);
  }
}

export async function createPost(req, res) {
  try {
    const { caption, hashtags, location, imageId } = req.body;
    const userId = req.user._id;
    if (!caption) {
      return badRequest(res, "Caption is required");
    }
    if (hashtags.length === 0) {
      return badRequest(res, "Hashtags is required");
    }
    if (!location) {
      return badRequest(res, "Location is required");
    }
    const post = new InstagramPost({
      caption: caption,
      hashtags: hashtags,
      location: location,
      imageDetails: imageId,
      user: userId,
    });
    await post.save();
    logInfo("Instagram post created", { userId, action: "INSTAGRAM_POST_CREATE", postId: post._id, ip: req.ip });
    return success(res, "Post publish successfully");
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
        hasMore,
      },
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
    logInfo("Instagram post deleted", { userId, action: "INSTAGRAM_POST_DELETE", postId: id, ip: req.ip });
    return success(res, "Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    return internalServerError(res, error.message);
  }
};

export const trendingHastags = async (request, response) => {
  try {
    const trendingHashtags = await InstagramPost.aggregate([
      { $match: { hashtags: { $exists: true, $ne: [], $ne: null } } },
      { $unwind: "$hashtags" },
      { $match: { hashtags: { $ne: null, $ne: "" } } },
      { $group: { _id: "$hashtags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      // { $limit: 10 },
      { $project: { hashtag: "$_id", count: 1, _id: 0 } },
    ]);
    return success(response, "Trending hashtags fetched successfully", {
      trendingHashtags,
    });
  } catch (error) {
    console.error("Error fetching trending hashtags:", error);
    return internalServerError(res, error.message);
  }
};

export const getPostsByHashtag = async (req, res) => {
  try {
    const { hashtag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const posts = await InstagramPost.find({ hashtags: hashtag })
      .populate("user", "username email")
      .populate("imageDetails", "url")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const totalPosts = await InstagramPost.countDocuments({
      hashtags: hashtag,
    });
    const hasMore = offset + posts.length < totalPosts;

    return success(res, "Posts fetched successfully", {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching posts by hashtag:", error);
    return internalServerError(res, error.message);
  }
};