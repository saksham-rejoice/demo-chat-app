import getImageKit from "../helpers/imagekit.js";

export const uploadFile = async (file, fileName) => {
  try {
    const imagekit = getImageKit();
    const result = await imagekit.upload({
      file: file.buffer,
      fileName: fileName || file.originalname,
      folder: "/chat-files",
    });

    return {
      url: result.url,
      fileId: result.fileId,
      fileName: result.name,
      fileType: result.fileType,
    };
  } catch (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }
};

export const getFileUrl = async (fileId) => {
  try {
    const imagekit = getImageKit();
    const fileDetails = await imagekit.getFileDetails(fileId);
    return fileDetails.url;
  } catch (error) {
    throw new Error(`Failed to get file URL: ${error.message}`);
  }
};