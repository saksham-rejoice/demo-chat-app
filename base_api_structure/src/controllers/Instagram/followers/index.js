import {
  internalServerError,
  badRequest,
  success,
} from "../../../helpers/api-response";
import UserModel from "../../../models/User";

export async function toggleFollower(request, response) {
  try {
    const { userId } = request.body;
    const { id } = request.user; // logged-in user

    if (!userId) {
      return badRequest(response, "userId is required");
    }

    if (userId === id) {
      return badRequest(response, "You cannot follow yourself");
    }

    // Logged-in user
    const currentUser = await UserModel.findById(id);
    // User being followed/unfollowed
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

      return success(response, "User followed successfully", {
        userId,
        followed: true,
      });
    }
  } catch (error) {
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
    return internalServerError(response, error.message);
  }
}

export async function getUsers(request, response) {
  try {
    const users = await UserModel.find({}, "username");
    return success(response, "Users fetched successfully", { users });
  } catch (error) {
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
    return internalServerError(response, error.message);
  }
}
