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

export const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new HttpError(422, "Only PDF files are allowed"));
      return;
    }

    cb(null, true);
  }
});
