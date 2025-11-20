import { uploadFile, getFileUrl } from "../../services/fileService.js";
import { success, badRequest, internalServerError } from "../../helpers";

export const uploadFileController = async (req, res) => {
  try {
    if (!req.file) {
      return badRequest(res, "No file provided");
    }

    const result = await uploadFile(req.file, req.body.fileName);
    success(res, "File uploaded successfully", result);
  } catch (error) {
    internalServerError(res, "File upload failed");
  }
};

export const getFileController = async (req, res) => {
  try {
    const { fileId } = req.params;
    const url = await getFileUrl(fileId);
    success(res, "File retrieved successfully", { url });
  } catch (error) {
    internalServerError(res, "Failed to get file");
  }
};