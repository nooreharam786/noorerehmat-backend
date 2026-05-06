import path from "path";

const isVercel = Boolean(process.env.VERCEL);
const uploadRoot = isVercel ? path.join("/tmp", "uploads") : path.resolve(process.cwd(), "uploads");

export const galleryUploadDir = path.join(uploadRoot, "gallery");

export function resolveGalleryUpload(filename: string) {
  return path.join(galleryUploadDir, filename);
}
