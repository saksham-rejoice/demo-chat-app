import getImageKit from "../helpers/imagekit.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export const uploadImage = async (file, folder = "instagram") => {
  try {
    const imagekit = getImageKit();
    if (!file) {
      throw new Error("No file provided");
    }

    // Generate a unique filename
    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Read file and convert to base64
    const fileBuffer = fs.readFileSync(file.path).toString("base64");

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: `/${folder}`,
      useUniqueFileName: false,
      overwriteFile: false,
    });

    return {
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      fileName: uploadResponse.name,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

export const deleteImage = async (fileId) => {
  try {
    if (!fileId) {
      throw new Error("No file ID provided");
    }

    const imagekit = getImageKit();
    await imagekit.deleteFile(fileId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
};

export const getImageUrl = async (path, options = {}) => {
  if (!path) return null;
  const defaultOptions = {
    width: 800,
    height: 800,
    quality: 80,
    ...options,
  };
  const imagekit = getImageKit();
  const url = await imagekit.url({
    path: path,
    transformation: [
      {
        width: defaultOptions.width,
        height: defaultOptions.height,
        quality: defaultOptions.quality,
        crop: "at_max",
      },
    ],
  });
  return url;
};
