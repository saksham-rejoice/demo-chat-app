import {
  success,
  internalServerError,
  badRequest,
} from "../../../helpers/api-response";
import InstagramPost from "../../../models/Instagram/instagramPost";
import InstagramImage from "../../../models/Instagram/InstagramImage";
import { uploadImage } from "../../../services/imageService";

export async function createPost(req, res) {
  try {
    const { title, description, } = req.body;
    const userId = req.user._id;
    if (!req.file) {
      return badRequest(res, "Image is required");
    }
    const uploadResult = await uploadImage(req.file, "instagram/posts");
    const imageData = {
      url: uploadResult.url,
      filename: uploadResult.fileName,
      fileId: uploadResult.fileId,
      userId: userId,
    };
    const instagramImage = new InstagramImage(imageData);
    await instagramImage.save();
    const post = new InstagramPost({
      title,
      description,
      imageDetails: instagramImage._id,
      user: userId,
    });
    await post.save();
    return success(res, "Post created successfully", { post });
  } catch (error) {
    console.error("Error creating post:", error);
    return internalServerError(res, error.message);
  }
}

