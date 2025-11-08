import { uploadFile, getFileUrl } from "../../services/fileService.js";
import { success, badRequest } from "../../helpers";

export const uploadFileController = async (req, res) => {
  try {
    if (!req.file) {
      return badRequest(req, res, null, "No file provided");
    }

    const result = await uploadFile(req.file, req.body.fileName);
    success(req, res, result);
  } catch (error) {
    badRequest(req, res, error, "File upload failed");
  }
};

export const getFileController = async (req, res) => {
  try {
    const { fileId } = req.params;
    const url = await getFileUrl(fileId);
    success(req, res, { url });
  } catch (error) {
    badRequest(req, res, error, "Failed to get file");
  }
};