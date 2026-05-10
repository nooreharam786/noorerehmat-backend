import { prisma } from "../config/prisma";
import { asyncHandler } from "../utils/http";
import { publicDocumentUrl, splitGalleryUrls } from "../utils/gallery";
import { z } from "zod";

const publicSettingKeys = [
  "RESULTS_YOUTUBE_URL",
  "GALLERY_IMAGE_URLS",
  "TERMS_DOCUMENT_URL",
  "UMRAH_PACKAGE_PRICE",
  "SOCIAL_FACEBOOK_URL",
  "SOCIAL_INSTAGRAM_URL",
  "SOCIAL_YOUTUBE_URL",
  "SOCIAL_WHATSAPP_URL",
  "CONTACT_ADDRESS",
  "CONTACT_PHONE",
  "CONTACT_EMAIL"
];

export const createFeedbackSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    rating: z.coerce.number().int().min(1).max(5),
    message: z.string().trim().min(5).max(1000),
    location: z.string().trim().max(120).optional()
  })
});

export const getPublicContent = asyncHandler(async (_req, res) => {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: publicSettingKeys
      }
    }
  });

  const values = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));

  res.json({
    success: true,
    data: {
      resultsYoutubeUrl: values.RESULTS_YOUTUBE_URL ?? "",
      galleryImageUrls: splitGalleryUrls(values.GALLERY_IMAGE_URLS),
      termsDocumentUrl: values.TERMS_DOCUMENT_URL ?? "",
      umrahPackagePrice: Number(values.UMRAH_PACKAGE_PRICE ?? 0),
      socials: {
        facebook: values.SOCIAL_FACEBOOK_URL ?? "",
        instagram: values.SOCIAL_INSTAGRAM_URL ?? "",
        youtube: values.SOCIAL_YOUTUBE_URL ?? "",
        whatsapp: values.SOCIAL_WHATSAPP_URL ?? ""
      },
      contact: {
        address: values.CONTACT_ADDRESS ?? "",
        phone: values.CONTACT_PHONE ?? "",
        email: values.CONTACT_EMAIL ?? ""
      }
    }
  });
});

export const listPublicDocuments = asyncHandler(async (req, res) => {
  const documents = await prisma.publicDocument.findMany({
    where: { kind: (req.query.kind as string) || "dua" },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, description: true, filename: true, kind: true, createdAt: true }
  });

  res.json({
    success: true,
    data: documents.map((document) => ({
      ...document,
      url: publicDocumentUrl(req, document.id)
    }))
  });
});

export const listPublicFeedback = asyncHandler(async (_req, res) => {
  const feedback = await prisma.feedback.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 9,
    select: { id: true, name: true, rating: true, message: true, location: true, createdAt: true }
  });
  res.json({ success: true, data: feedback });
});

export const createFeedback = asyncHandler(async (req, res) => {
  const feedback = await prisma.feedback.create({
    data: {
      name: req.body.name,
      rating: req.body.rating,
      message: req.body.message,
      location: req.body.location,
      source: "public",
      approved: true
    }
  });

  res.status(201).json({ success: true, data: feedback });
});
