import {
  success,
  badRequest,
  internalServerError,
} from "../../../helpers/api-response";
import InstagramStoriesSchema from "../../../models/Instagram/InstagramStories";
import User from "../../../models/User";
import { deleteImage } from "../../../services/imageService";
export const createStory = async (req, res) => {
  try {
    const { imageId } = req.body;
    const userId = req.user.id;
    if (!imageId) {
      return badRequest(res, "Image is required");
    }
    const newStory = new InstagramStoriesSchema({
      userId: userId,
      imageId,
    });
    await newStory.save();
    return success(res, "Story created successfully");
  } catch (error) {
    console.log(error);
    return internalServerError(res, error.message);
  }
};

export const getStory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get following list
    const user = await User.findById(userId).select("following");
    const followingIds = (user.following || []).map(id => id.toString());

    // Story owners: following + self
    const userIds = [...followingIds, userId.toString()];

    // Fetch stories
    const stories = await InstagramStoriesSchema.find({
      userId: { $in: userIds },
      expiresAt: { $gt: new Date() }
    })
      .populate({
        path: "imageId",
        select: "url",
      })
      .populate({
        path: "userId",
        select: "username",
      })
      .sort({ createdAt: -1 });

    // Group stories by userId
    const groupedStories = stories.reduce((acc, story) => {
      const uid = story.userId._id.toString();

      if (!acc[uid]) {
        acc[uid] = {
          userId: story.userId._id,
          username: story.userId.username,
          imageUrls: []
        };
      }

      acc[uid].imageUrls.push(story.imageId.url);
      return acc;
    }, {});

    // Separate logged-in user & others
    const myStories = groupedStories[userId] || null;
    const otherStories = Object.values(groupedStories)
      .filter(s => s.userId.toString() !== userId);

    return success(res, "Stories fetched successfully", {
      myStories,
      otherStories
    });

  } catch (error) {
    return internalServerError(res, error.message);
  }
};

