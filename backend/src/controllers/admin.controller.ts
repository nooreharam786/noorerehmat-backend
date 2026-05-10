import { ApplicationStatus, PaymentStatus, Role } from "@prisma/client";
import type { Request } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { asyncHandler, HttpError } from "../utils/http";
import { paginationSchema } from "../utils/validation";
import { runLuckyDraw } from "../services/draw.service";
import { galleryImageUrl, joinGalleryUrls, publicDocumentUrl, requestOrigin, splitGalleryUrls } from "../utils/gallery";

const sortableUsers = new Set(["name", "email", "role", "createdAt"]);
const sortableApplicants = new Set(["createdAt", "status", "paymentStatus"]);
const galleryKey = "GALLERY_IMAGE_URLS";
const settingsKeys = {
  imbPaymentLink: "IMB_PAYMENT_LINK",
  resultsYoutubeUrl: "RESULTS_YOUTUBE_URL",
  galleryImageUrls: "GALLERY_IMAGE_URLS",
  termsDocumentUrl: "TERMS_DOCUMENT_URL",
  umrahPackagePrice: "UMRAH_PACKAGE_PRICE",
  socialFacebookUrl: "SOCIAL_FACEBOOK_URL",
  socialInstagramUrl: "SOCIAL_INSTAGRAM_URL",
  socialYoutubeUrl: "SOCIAL_YOUTUBE_URL",
  socialWhatsappUrl: "SOCIAL_WHATSAPP_URL",
  contactAddress: "CONTACT_ADDRESS",
  contactPhone: "CONTACT_PHONE",
  contactEmail: "CONTACT_EMAIL"
} as const;

export const listUsersSchema = z.object({
  query: paginationSchema.extend({
    sortBy: z.string().default("createdAt")
  })
});

export const listApplicantsSchema = z.object({
  query: paginationSchema.extend({
    sortBy: z.string().default("createdAt"),
    status: z.nativeEnum(ApplicationStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional()
  })
});

export const drawSchema = z.object({
  body: z.object({
    mode: z.enum(["fixed", "percentage"]).default("fixed"),
    fixedCount: z.coerce.number().int().positive().max(100000).default(125),
    percentage: z.coerce.number().positive().max(100).default(1.25)
  })
});

const optionalUrl = z.preprocess((value) => (value === "" ? undefined : value), z.string().url().optional());
const optionalEmail = z.preprocess((value) => (value === "" ? undefined : value), z.string().trim().email().optional());

export const updateSettingsSchema = z.object({
  body: z.object({
    imbPaymentLink: optionalUrl,
    resultsYoutubeUrl: optionalUrl,
    galleryImageUrls: z.string().trim().max(5000).optional(),
    termsDocumentUrl: z.string().trim().max(1000).optional(),
    umrahPackagePrice: z.coerce.number().int().nonnegative().max(10000000).optional(),
    socialFacebookUrl: optionalUrl,
    socialInstagramUrl: optionalUrl,
    socialYoutubeUrl: optionalUrl,
    socialWhatsappUrl: z.string().trim().max(500).optional(),
    contactAddress: z.string().trim().max(1000).optional(),
    contactPhone: z.string().trim().max(80).optional(),
    contactEmail: optionalEmail,
    adminName: z.string().trim().min(2).optional(),
    adminEmail: z.string().trim().email().toLowerCase().optional()
  })
});

export const createFeedbackSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    rating: z.coerce.number().int().min(1).max(5),
    message: z.string().trim().min(5).max(1000),
    location: z.string().trim().max(120).optional(),
    approved: z.boolean().optional()
  })
});

export const uploadDocumentSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(160),
    description: z.string().trim().max(500).optional(),
    kind: z.string().trim().min(2).max(40).default("dua")
  })
});

export const removeGalleryImageSchema = z.object({
  body: z.object({
    imageUrl: z.string().url()
  })
});

export const stats = asyncHandler(async (_req, res) => {
  const [totalUsers, totalApplicants, paidApplications, selectedApplications, lastDraw] = await Promise.all([
    prisma.user.count(),
    prisma.application.count(),
    prisma.application.findMany({
      where: { paymentStatus: PaymentStatus.paid },
      select: { persons: true }
    }),
    prisma.application.findMany({
      where: { status: ApplicationStatus.selected },
      select: { persons: true }
    }),
    prisma.drawResult.findFirst({ orderBy: { createdAt: "desc" } })
  ]);
  const paidUsers = paidApplications.reduce((total, item) => total + item.persons, 0);
  const selectedUsers = selectedApplications.reduce((total, item) => total + item.persons, 0);

  res.json({ success: true, data: { totalUsers, totalApplicants, paidUsers, selectedUsers, lastDraw } });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, search, sortOrder } = req.query as any;
  const sortBy = sortableUsers.has(req.query.sortBy as string) ? (req.query.sortBy as string) : "createdAt";
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } }
        ]
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.user.count({ where })
  ]);

  res.json({ success: true, data: { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } } });
});

export const listApplicants = asyncHandler(async (req, res) => {
  const { page, limit, search, status, paymentStatus, sortOrder } = req.query as any;
  const sortBy = sortableApplicants.has(req.query.sortBy as string) ? (req.query.sortBy as string) : "createdAt";
  const where = {
    ...(status ? { status } : {}),
    ...(paymentStatus ? { paymentStatus } : {}),
    ...(search
      ? {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } }
            ]
          }
        }
      : {})
  };

  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        travellers: { orderBy: { createdAt: "asc" } }
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.application.count({ where })
  ]);

  res.json({ success: true, data: { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } } });
});

export const runDraw = asyncHandler(async (req, res) => {
  const result = await runLuckyDraw({
    fixedCount: req.body.mode === "fixed" ? req.body.fixedCount : undefined,
    percentage: req.body.mode === "percentage" ? req.body.percentage : undefined
  });
  res.status(201).json({ success: true, data: result });
});

export const drawHistory = asyncHandler(async (_req, res) => {
  const items = await prisma.drawResult.findMany({ orderBy: { createdAt: "desc" }, take: 10 });
  res.json({ success: true, data: items });
});

export const getSettings = asyncHandler(async (req, res) => {
  const [settings, admin] = await Promise.all([
    prisma.setting.findMany({ where: { key: { in: Object.values(settingsKeys) } } }),
    prisma.user.findFirst({ where: { role: Role.admin }, select: { id: true, name: true, email: true } })
  ]);
  const values = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
  res.json({
    success: true,
    data: {
      imbPaymentLink: values.IMB_PAYMENT_LINK,
      resultsYoutubeUrl: values.RESULTS_YOUTUBE_URL,
      galleryImageUrls: joinGalleryUrls(values.GALLERY_IMAGE_URLS),
      termsDocumentUrl: values.TERMS_DOCUMENT_URL,
      umrahPackagePrice: Number(values.UMRAH_PACKAGE_PRICE ?? 0),
      socialFacebookUrl: values.SOCIAL_FACEBOOK_URL,
      socialInstagramUrl: values.SOCIAL_INSTAGRAM_URL,
      socialYoutubeUrl: values.SOCIAL_YOUTUBE_URL,
      socialWhatsappUrl: values.SOCIAL_WHATSAPP_URL,
      contactAddress: values.CONTACT_ADDRESS,
      contactPhone: values.CONTACT_PHONE,
      contactEmail: values.CONTACT_EMAIL,
      admin
    }
  });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const operations = [];

  for (const [bodyKey, settingKey] of Object.entries(settingsKeys)) {
    if (req.body[bodyKey] === undefined) continue;
    const value = bodyKey === "galleryImageUrls" ? joinGalleryUrls(req.body[bodyKey]) : String(req.body[bodyKey] ?? "");
    operations.push(
      prisma.setting.upsert({
        where: { key: settingKey },
        update: { value },
        create: { key: settingKey, value }
      })
    );
  }

  if (req.body.adminName || req.body.adminEmail) {
    operations.push(
      prisma.user.update({
        where: { id: req.user!.id },
        data: {
          ...(req.body.adminName ? { name: req.body.adminName } : {}),
          ...(req.body.adminEmail ? { email: req.body.adminEmail } : {})
        }
      })
    );
  }

  await prisma.$transaction(operations);
  res.json({ success: true, message: "Settings updated" });
});

async function uploadedFileUrls(req: Request) {
  const files = (req.files ?? []) as Express.Multer.File[];

  const images = await Promise.all(
    files.map((file) =>
      prisma.galleryImage.create({
        data: {
          filename: file.originalname,
          contentType: file.mimetype,
          data: file.buffer,
          size: file.size
        },
        select: { id: true }
      })
    )
  );

  return images.map((image) => galleryImageUrl(req, image.id));
}

async function removeStoredUpload(imageUrl: string, req: Request) {
  const origin = requestOrigin(req);
  if (!imageUrl.startsWith(`${origin}/uploads/gallery/`)) return;

  const id = new URL(imageUrl).pathname.split("/").pop();
  if (!id) return;

  await prisma.galleryImage.delete({ where: { id } }).catch(() => undefined);
}

export const uploadGalleryImages = asyncHandler(async (req, res) => {
  const nextUrls = await uploadedFileUrls(req);
  if (nextUrls.length === 0) {
    throw new HttpError(422, "Please choose at least one image to upload");
  }

  const existing = await prisma.setting.findUnique({ where: { key: galleryKey } });
  const currentValue = joinGalleryUrls(existing?.value);
  const value = [currentValue, ...nextUrls].filter(Boolean).join("\n");

  await prisma.setting.upsert({
    where: { key: galleryKey },
    update: { value },
    create: { key: galleryKey, value }
  });

  res.status(201).json({ success: true, data: { imageUrls: nextUrls, galleryImageUrls: value } });
});

export const removeGalleryImage = asyncHandler(async (req, res) => {
  const existing = await prisma.setting.findUnique({ where: { key: galleryKey } });
  const nextUrls = splitGalleryUrls(existing?.value).filter((url) => url !== req.body.imageUrl);
  const value = nextUrls.join("\n");

  await prisma.setting.upsert({
    where: { key: galleryKey },
    update: { value },
    create: { key: galleryKey, value }
  });
  await removeStoredUpload(req.body.imageUrl, req);

  res.json({ success: true, data: { galleryImageUrls: value } });
});

export const listFeedback = asyncHandler(async (_req, res) => {
  const items = await prisma.feedback.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  res.json({ success: true, data: items });
});

export const createFeedback = asyncHandler(async (req, res) => {
  const feedback = await prisma.feedback.create({
    data: {
      name: req.body.name,
      rating: req.body.rating,
      message: req.body.message,
      location: req.body.location,
      approved: req.body.approved ?? true,
      source: "admin"
    }
  });
  res.status(201).json({ success: true, data: feedback });
});

export const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await prisma.feedback.findUnique({ where: { id: req.params.id }, select: { id: true } });
  if (!feedback) {
    throw new HttpError(404, "Feedback not found");
  }

  await prisma.feedback.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: "Feedback deleted" });
});

export const listDocuments = asyncHandler(async (req, res) => {
  const documents = await prisma.publicDocument.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, description: true, filename: true, kind: true, createdAt: true }
  });
  res.json({ success: true, data: documents.map((document) => ({ ...document, url: publicDocumentUrl(req, document.id) })) });
});

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new HttpError(422, "Please choose a PDF to upload");
  }

  const document = await prisma.publicDocument.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      kind: req.body.kind ?? "dua",
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer,
      size: req.file.size
    },
    select: { id: true, title: true, description: true, filename: true, kind: true, createdAt: true }
  });

  res.status(201).json({ success: true, data: { ...document, url: publicDocumentUrl(req, document.id) } });
});

export const deleteDocument = asyncHandler(async (req, res) => {
  await prisma.publicDocument.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: "Document deleted" });
});
