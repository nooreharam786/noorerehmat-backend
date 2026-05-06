import { prisma } from "../config/prisma";
import { asyncHandler, HttpError } from "../utils/http";

export const serveGalleryImage = asyncHandler(async (req, res) => {
  const image = await prisma.galleryImage.findUnique({
    where: { id: req.params.id }
  });

  if (!image) {
    throw new HttpError(404, "Gallery image not found");
  }

  res.setHeader("Content-Type", image.contentType);
  res.setHeader("Content-Length", String(image.size));
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.send(Buffer.from(image.data));
});
