import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/http";
import { splitGalleryUrls } from "../utils/gallery";

export const getPublicContent = asyncHandler(async (_req, res) => {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: ["RESULTS_YOUTUBE_URL", "GALLERY_IMAGE_URLS"]
      }
    }
  });

  const values = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));

  res.json({
    success: true,
    data: {
      resultsYoutubeUrl: values.RESULTS_YOUTUBE_URL ?? "",
      galleryImageUrls: splitGalleryUrls(values.GALLERY_IMAGE_URLS)
    }
  });
});
