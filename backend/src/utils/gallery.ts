import type { Request } from "express";
import { env } from "../config/env";

const localUploadUrlPattern = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/uploads\/gallery\//i;

export function requestOrigin(req: Request) {
  return env.API_PUBLIC_URL ?? `${req.protocol}://${req.get("host")}`;
}

export function galleryImageUrl(req: Request, id: string) {
  return `${requestOrigin(req)}/uploads/gallery/${id}`;
}

export function splitGalleryUrls(value?: string) {
  return (value ?? "")
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter((url) => url && !localUploadUrlPattern.test(url));
}

export function joinGalleryUrls(value?: string) {
  return splitGalleryUrls(value).join("\n");
}
