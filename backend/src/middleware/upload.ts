import fs from "fs";
import path from "path";
import multer from "multer";
import { HttpError } from "../utils/http";

const galleryDir = path.resolve(process.cwd(), "uploads/gallery");
fs.mkdirSync(galleryDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, galleryDir),
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
    cb(null, name);
  }
});

export const galleryUpload = multer({
  storage,
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
