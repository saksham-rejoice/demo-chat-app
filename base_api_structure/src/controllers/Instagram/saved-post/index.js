import {
  success,
  internalServerError,
  badRequest,
} from "../../../helpers/api-response";
import savedPost from "../../../models/Instagram/saveInstagramPost";
export async function savePost(request, response) {
  try {
    const { postId, collectionName } = request.body;
    const userId = request.user._id;
    const findCollection = await savedPost.findOne({
      collectionName: collectionName,
      user: userId,
    });
    if (findCollection) {
      const isPostAlreadySaved = findCollection.savedPost.includes(postId);
      if (isPostAlreadySaved) {
        return badRequest(response, "Post already saved");
      }
      findCollection.savedPost.push(postId);
      await findCollection.save();
      return success(response, "Post saved successfully");
    } else {
      const newCollection = new savedPost({
        collectionName: collectionName,
        savedPost: [postId],
        user: userId,
      });
      await newCollection.save();
      return success(response, "Post saved successfully");
    }
  } catch (error) {
    return internalServerError(response, error.message);
  }
}
export async function getSavedPost(request, response) {
  try {
    const userId = request.user._id;
    const findCollection = await savedPost.findOne({
      user: userId,
    });
    if (findCollection) {
      return success(response, "Post fetched successfully", findCollection);
    } else {
      return badRequest(response, "No post found");
    }
  } catch (error) {
    return internalServerError(response, error.message);
  }
}
export async function removeSavedPostFromCollection(request, response) {
  try {
    const { postId, collectionName } = request.body;
    const userId = request.user._id;
    const findCollection = await savedPost.findOne({
      collectionName: collectionName,
      user: userId,
    });
    if (findCollection) {
      const isPostAlreadySaved = findCollection.savedPost.includes(postId);
      if (!isPostAlreadySaved) {
        return badRequest(response, "Post not found");
      }
      findCollection.savedPost.pull(postId);
      await findCollection.save();
    } else {
      return badRequest(response, "No post found");
    }
    return success(response, "Post removed successfully");
  } catch (error) {
    return internalServerError(response, error.message);
  }
}
export async function createCollection(request, response) {
  try {
    const { collectionName } = request.body;
    const userId = request.user._id;
    const findCollection = await savedPost.findOne({
      collectionName: collectionName,
      user: userId,
    });
    if (findCollection) {
      return badRequest(response, "Collection already exists");
    } else {
      const newCollection = new savedPost({
        collectionName: collectionName,
        savedPost: [],
        user: userId,
      });
      await newCollection.save();
      return success(response, "Collection created successfully");
    }
  } catch (error) {
    return internalServerError(response, error.message);
  }
}
