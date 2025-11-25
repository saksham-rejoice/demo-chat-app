import {
  internalServerError,
  badRequest,
  success,
} from "../../../helpers/api-response.js";
import UserModel from "../../../models/User.js";
import { logInfo, logCatchError } from "../../../services/loggerService.js";

export async function toggleFollower(request, response) {
  try {
    const { userId } = request.body;
    const { id } = request.user;

    if (!userId) {
      return badRequest(response, "userId is required");
    }

    if (userId === id) {
      return badRequest(response, "You cannot follow yourself");
    }
    const currentUser = await UserModel.findById(id);

    const targetUser = await UserModel.findById(userId);

    if (!currentUser || !targetUser) {
      return badRequest(response, "User not found");
    }

    const isFollowed = currentUser.following.includes(userId);

    if (isFollowed) {
      // ========== UNFOLLOW LOGIC ==========
      currentUser.following.pull(userId);
      targetUser.followers.pull(id);

      await currentUser.save();
      await targetUser.save();

      logInfo("User unfollowed", {
        userId: id,
        targetUserId: userId,
        action: "UNFOLLOW",
        ip: request.ip,
      });
      return success(response, "User unfollowed successfully", {
        userId,
        followed: false,
      });
    } else {
      // ========== FOLLOW LOGIC ==========
      currentUser.following.push(userId);
      targetUser.followers.push(id);

      await currentUser.save();
      await targetUser.save();

      logInfo("User followed", {
        userId: id,
        targetUserId: userId,
        action: "FOLLOW",
        ip: request.ip,
      });
      return success(response, "User followed successfully", {
        userId,
        followed: true,
      });
    }
  } catch (error) {
    logCatchError(error, { action: "TOGGLE_FOLLOW", userId: request.user?.id });
    return internalServerError(response, error.message);
  }
}

export async function getFollowers(request, response) {
  try {
    const { id } = request.user;
    const user = await UserModel.findById(id).populate("followers", "username");
    if (!user) {
      return badRequest(response, "User not found");
    }
    return success(response, "Followers fetched successfully", {
      followers: user.followers,
    });
  } catch (error) {
    logCatchError(error, { action: "GET_FOLLOWERS", userId: request.user?.id });
    return internalServerError(response, error.message);
  }
}

export async function getSuggestedUsers(request, response) {
  try {
    try {
      const { id } = request.user; 

      const loggedInUser = await UserModel.findById(id).select(
        "followers following"
      );
      if (!loggedInUser) {
        return badRequest(response, "User not found");
      }
      const allUsers = await UserModel.find().select(
        "username followers following"
      );
      let suggestedUsers = allUsers.filter((user) => {
        return (
          user._id.toString() !== id.toString() &&
          !loggedInUser.following.includes(user._id) &&
          !loggedInUser.followers.includes(user._id) &&
          !user.followers.includes(id) &&
          !user.following.includes(id)
        );
      });
      const cleanSuggestedUsers = suggestedUsers.map((user) => ({
        _id: user._id,
        username: user.username,
      }));
      return success(response, "Suggested users fetched", cleanSuggestedUsers);
    } catch (error) {
      logCatchError(error, { action: "GET_SUGGESTED_USERS_INNER", userId: request.user?.id });
      return badRequest(response, "Something went wrong");
    }
  } catch (error) {
    logCatchError(error, { action: "GET_SUGGESTED_USERS", userId: request.user?.id });
    return internalServerError(response, error.message);
  }
}

export async function getFollowing(request, response) {
  try {
    const { id } = request.user;
    const user = await UserModel.findById(id).populate("following", "username");
    if (!user) {
      return badRequest(response, "User not found");
    }
    return success(response, "Following fetched successfully", {
      following: user.following,
    });
  } catch (error) {
    logCatchError(error, { action: "GET_FOLLOWING", userId: request.user?.id });
    return internalServerError(response, error.message);
  }
}
