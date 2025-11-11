import getImageKit from '../helpers/imagekit';
import { v4 as uuidv4 } from 'uuid';


export const uploadImage = async (file, folder = 'instagram') => {
  try {
    const imagekit = getImageKit();
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate a unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Convert file buffer to base64
    const fileBuffer = file.buffer.toString('base64');

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
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteImage = async (fileId) => {
  try {
    if (!fileId) {
      throw new Error('No file ID provided');
    }

    const imagekit = getImageKit();
    await imagekit.deleteFile(fileId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};

export const getImageUrl = (path, options = {}) => {
  if (!path) return null;
  
  // Default transformations
  const defaultOptions = {
    width: 800,
    height: 800,
    quality: 80,
    ...options
  };
  const imagekit = getImageKit();
  return imagekit.url({
    path: path,
    transformation: [{
      width: defaultOptions.width,
      height: defaultOptions.height,
      quality: defaultOptions.quality,
      crop: 'at_max',
    }]
  });
};
