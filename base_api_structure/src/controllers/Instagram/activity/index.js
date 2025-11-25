import {
  success,
  internalServerError,
  badRequest,
} from "../../../helpers/api-response.js";
import activitySchema from "../../../models/Instagram/activitySchema.js";

export const logActivity = async (request, response) => {
  try {
    const { type, targetUser, post, metadata } = request.body;
    const { id } = request.user;
    const activity = new activitySchema({
      user: id,
      type,
      targetUser,
      post,
      metadata,
    });
    await activity.save();
    return success(response, activity, "Activity logged successfully");
  } catch (error) {
    return internalServerError(response, error.message, error);
  }
};

export const getActivity = async (request, response) => {
  try {
    const { id } = request.user;
    const activity = await activitySchema
      .find({ user: id })
      .populate("post", "caption")
      .populate("user", "username email")
      .populate("targetUser", "username email");
    return success(response, "Activity fetched successfully", activity);
  } catch (error) {
    return internalServerError(response, error.message, error);
  }
};
