import { uploadFile, getFileUrl } from "../../services/fileService.js";
import { success, badRequest, internalServerError } from "../../helpers";
import { logInfo, logError } from "../../services/loggerService.js";

export const uploadFileController = async (req, res) => {
  try {
    if (!req.file) {
      return badRequest(res, "No file provided");
    }

    const result = await uploadFile(req.file, req.body.fileName);
    logInfo("File uploaded successfully", { userId: req.user._id, action: "FILE_UPLOAD", fileName: result.fileName, ip: req.ip });
    success(res, "File uploaded successfully", result);
  } catch (error) {
    logError("File upload failed", { userId: req.user._id, action: "FILE_UPLOAD", error: error.message, ip: req.ip });
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