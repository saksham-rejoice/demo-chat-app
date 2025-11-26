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
import HashTags from "../../../models/Instagram/hashTags.js";
import User from "../../../models/User.js";

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
    logInfo("Instagram image uploaded", {
      userId,
      action: "INSTAGRAM_IMAGE_UPLOAD",
      imageId: instagramImage._id,
      ip: request.ip,
    });
    return success(response, "Image uploaded successfully", {
      url: instagramImage.url,
      _id: instagramImage._id,
    });
  } catch (error) {
    logError("Error uploading image", {
      userId: request.user._id,
      action: "INSTAGRAM_IMAGE_UPLOAD",
      ip: request.ip,
      error: error.message,
    });
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
    logError("Error deleting image", {
      userId: request.user._id,
      action: "INSTAGRAM_IMAGE_DELETE",
      ip: request.ip,
      error: error.message,
    });
    return internalServerError(response, error.message);
  }
}

export async function createPost(req, res) {
  try {
    const { caption, location, imageId } = req.body;
    const userId = req.user._id;
    if (!caption) return badRequest(res, "Caption is required");
    if (!location) return badRequest(res, "Location is required");
    const extractedTags = caption.match(/#\w+/g) || [];
    const cleanTags = extractedTags.map((tag) => tag.toLowerCase());
    const post = await InstagramPost.create({
      caption,
      location,
      imageDetails: imageId,
      user: userId,
      hashtagRefs: [],
    });
    const hashtagDocs = await Promise.all(
      cleanTags.map((tag) =>
        HashTags.create({
          hashtag: tag, // store as "#travel"
          post: post._id,
          user: userId,
        })
      )
    );
    post.hashtagRefs = hashtagDocs.map((doc) => doc._id);
    await post.save();
    logInfo("Instagram post created", {
      userId,
      action: "INSTAGRAM_POST_CREATE",
      postId: post._id,
      ip: req.ip,
    });
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

export async function getPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const posts = await InstagramPost.find()
      .populate("user", "username email")
      .populate("imageDetails", "url")
      .populate("hashtagRefs", "hashtag")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const totalPosts = await InstagramPost.countDocuments();
    const hasMore = offset + posts.length < totalPosts;
    const userId = req.user.id;
    logInfo("Instagram posts fetched", {
      userId,
      action: "INSTAGRAM_POSTS_FETCH",
      ip: req.ip,
    });
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
    logError("Error fetching posts", {
      userId: req.user.id,
      action: "INSTAGRAM_POSTS_FETCH",
      ip: req.ip,
      error: error.message,
    });
    console.error("Error fetching posts:", error);
    return internalServerError(res, error.message);
  }
}

export async function getPostById(req, res) {
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
}

export async function updatePost(req, res) {
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
    logInfo("Instagram post updated", {
      userId,
      action: "INSTAGRAM_POST_UPDATE",
      postId: id,
      ip: req.ip,
    });
    return success(res, "Post updated successfully", { post });
  } catch (error) {
    logError("Error updating post", {
      userId: req.user._id,
      action: "INSTAGRAM_POST_UPDATE",
      postId: id,
      ip: req.ip,
      error: error.message,
    });
    console.error("Error updating post:", error);
    return internalServerError(res, error.message);
  }
}

export async function deletePost(req, res) {
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
    logInfo("Instagram post deleted", {
      userId,
      action: "INSTAGRAM_POST_DELETE",
      postId: id,
      ip: req.ip,
    });
    return success(res, "Post deleted successfully");
  } catch (error) {
    logError("Error deleting post", {
      userId: req.user._id,
      action: "INSTAGRAM_POST_DELETE",
      postId: id,
      ip: req.ip,
      error: error.message,
    });
    console.error("Error deleting post:", error);
    return internalServerError(res, error.message);
  }
}

export async function trendingHastags(request, response) {
  try {
    const userId = request.user.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return badRequest(res, "User not found");
    }
    const trendingHashtags = await HashTags.aggregate([
      {
        $group: {
          _id: "$hashtag",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          hashtag: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);
    logInfo("Trending hashtags fetched", {
      userId,
      action: "INSTAGRAM_TRENDING_HASHTAGS",
      ip: request.ip,
    });
    return success(response, "Trending hashtags fetched successfully", {
      trendingHashtags: trendingHashtags,
    });
  } catch (error) {
    logError("Error fetching trending hashtags", {
      userId: request.user.id,
      action: "INSTAGRAM_TRENDING_HASHTAGS",
      ip: request.ip,
      error: error.message,
    });
    console.error("Error fetching trending hashtags:", error);
    return internalServerError(res, error.message);
  }
}

export async function getPostsByHashtag(req, res) {
  try {
    const { hashtag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const userId = req.user.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return badRequest(res, "User not found");
    }
    const result = await HashTags.find({ hashtag: `#${hashtag}` })
      .populate("post")
      .skip(offset)
      .limit(limit);
    return success(res, "Posts fetched successfully", { result });
  } catch (error) {
    console.error("Error fetching posts by hashtag:", error);
    return internalServerError(res, error.message);
  }
}
