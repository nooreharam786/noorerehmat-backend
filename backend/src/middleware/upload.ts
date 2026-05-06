import multer from "multer";
import { HttpError } from "../utils/http";

export const galleryUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8
  },
  fileFilter: (_req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)) {
      cb(new HttpError(422, "Only JPG, PNG, WEBP, or GIF images are allowed"));
      return;
    }

    cb(null, true);
  }
});
