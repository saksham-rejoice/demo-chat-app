import multer from "multer";
import { uploadFileController, getFileController } from "../../controllers/files";
import { authenticate } from "../../middleware/auth";

const upload = multer({ storage: multer.memoryStorage() });

export const fileRouter = (app) => {
  app.post("/api/files/upload", authenticate, upload.single("file"), uploadFileController);
  app.get("/api/files/:fileId", authenticate, getFileController);
};