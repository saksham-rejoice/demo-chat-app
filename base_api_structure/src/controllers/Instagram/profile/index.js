import {
  success,
  badRequest,
  internalServerError,
} from "../../../helpers/api-response";
import InstagramPost from "../../../models/Instagram/instagramPost";
import UserModel from "../../../models/User";
export async function updateProfileDetails(request, response) {
  try {
    const { bio, website, username, metadata } = request.body;
    const user = request.user.id;

    if (!bio || !website) {
      return badRequest(response, "Please fill all the fields");
    }
    const savedProfile = await UserModel.findByIdAndUpdate(
      user,
      {
        bio,
        website,
        username: username.toLowerCase(),
        metadata: metadata,
      },
      { new: true }
    );
    await savedProfile.save();
    return success(response, "Profile updated successfully");
  } catch (error) {
    return internalServerError(response, error.message);
  }
}
export async function updateProfilePhoto(request, response) {
  try {
    const { imageId } = request.body;
    const user = request.user.id;
    const savedProfile = await UserModel.findByIdAndUpdate(
      user,
      {
        profileImage: imageId,
      },
      { new: true }
    );
    await savedProfile.save();
    return success(response, "Profile updated successfully");
  } catch (error) {
    return internalServerError(response, error.message);
  }
}
export async function getProfileDetails(request, response) {
  try {
    const user = request.user.id;
    const savedProfile = await UserModel.findById(user).populate(
      "profileImage",
      "url"
    );
    const userPosts = await InstagramPost.find({ user: user }).populate(
      "imageDetails",
      "url"
    );
    const responseObject = {
      username: savedProfile.username,
      email: savedProfile.email,
      profileImage: savedProfile.profileImage?.url || "",
      bio: savedProfile.bio,
      website: savedProfile.website,
      followers: savedProfile.followers.length,
      following: savedProfile.following.length,
      totalPosts: userPosts.length,
      posts: userPosts,
      id: savedProfile._id,
      metadata: savedProfile.metadata,
    };
    return success(response, "Profile updated successfully", responseObject);
  } catch (error) {
    return internalServerError(response, error.message);
  }
}
