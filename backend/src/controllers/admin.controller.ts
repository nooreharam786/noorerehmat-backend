import { ApplicationStatus, PaymentStatus, Role } from "@prisma/client";
import type { Request } from "express";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { asyncHandler, HttpError } from "../utils/http";
import { paginationSchema } from "../utils/validation";
import { runLuckyDraw } from "../services/draw.service";
import { galleryUploadDir, resolveGalleryUpload } from "../utils/upload-paths";

const sortableUsers = new Set(["name", "email", "role", "createdAt"]);
const sortableApplicants = new Set(["createdAt", "status", "paymentStatus"]);
const galleryKey = "GALLERY_IMAGE_URLS";

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

export const updateSettingsSchema = z.object({
  body: z.object({
    imbPaymentLink: optionalUrl,
    resultsYoutubeUrl: optionalUrl,
    galleryImageUrls: z.string().trim().max(5000).optional(),
    adminName: z.string().trim().min(2).optional(),
    adminEmail: z.string().trim().email().toLowerCase().optional()
  })
});

export const removeGalleryImageSchema = z.object({
  body: z.object({
    imageUrl: z.string().url()
  })
});

export const stats = asyncHandler(async (_req, res) => {
  const [totalUsers, totalApplicants, paidUsers, selectedUsers, lastDraw] = await Promise.all([
    prisma.user.count(),
    prisma.application.count(),
    prisma.application.count({ where: { paymentStatus: PaymentStatus.paid } }),
    prisma.application.count({ where: { status: ApplicationStatus.selected } }),
    prisma.drawResult.findFirst({ orderBy: { createdAt: "desc" } })
  ]);

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
      include: { user: { select: { name: true, email: true } } },
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
  const [paymentLink, resultsYoutubeUrl, galleryImageUrls, admin] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "IMB_PAYMENT_LINK" } }),
    prisma.setting.findUnique({ where: { key: "RESULTS_YOUTUBE_URL" } }),
    prisma.setting.findUnique({ where: { key: "GALLERY_IMAGE_URLS" } }),
    prisma.user.findFirst({ where: { role: Role.admin }, select: { id: true, name: true, email: true } })
  ]);
  res.json({
    success: true,
    data: {
      imbPaymentLink: paymentLink?.value,
      resultsYoutubeUrl: resultsYoutubeUrl?.value,
      galleryImageUrls: galleryImageUrls?.value,
      admin
    }
  });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const operations = [];

  if (req.body.imbPaymentLink !== undefined) {
    operations.push(
      prisma.setting.upsert({
        where: { key: "IMB_PAYMENT_LINK" },
        update: { value: req.body.imbPaymentLink },
        create: { key: "IMB_PAYMENT_LINK", value: req.body.imbPaymentLink }
      })
    );
  }

  if (req.body.resultsYoutubeUrl !== undefined) {
    operations.push(
      prisma.setting.upsert({
        where: { key: "RESULTS_YOUTUBE_URL" },
        update: { value: req.body.resultsYoutubeUrl },
        create: { key: "RESULTS_YOUTUBE_URL", value: req.body.resultsYoutubeUrl }
      })
    );
  }

  if (req.body.galleryImageUrls !== undefined) {
    operations.push(
      prisma.setting.upsert({
        where: { key: "GALLERY_IMAGE_URLS" },
        update: { value: req.body.galleryImageUrls },
        create: { key: "GALLERY_IMAGE_URLS", value: req.body.galleryImageUrls }
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

function uploadedFileUrls(req: Request) {
  const files = (req.files ?? []) as Express.Multer.File[];
  const origin = `${req.protocol}://${req.get("host")}`;

  return files.map((file) => `${origin}/uploads/gallery/${file.filename}`);
}

function splitGalleryUrls(value?: string) {
  return (value ?? "")
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);
}

async function removeLocalUpload(imageUrl: string, req: Request) {
  const origin = `${req.protocol}://${req.get("host")}`;
  if (!imageUrl.startsWith(`${origin}/uploads/gallery/`)) return;

  const filename = path.basename(new URL(imageUrl).pathname);
  const target = resolveGalleryUpload(filename);
  if (!target.startsWith(galleryUploadDir)) return;

  await fs.unlink(target).catch(() => undefined);
}

export const uploadGalleryImages = asyncHandler(async (req, res) => {
  const nextUrls = uploadedFileUrls(req);
  if (nextUrls.length === 0) {
    throw new HttpError(422, "Please choose at least one image to upload");
  }

  const existing = await prisma.setting.findUnique({ where: { key: galleryKey } });
  const currentValue = existing?.value?.trim();
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
  await removeLocalUpload(req.body.imageUrl, req);

  res.json({ success: true, data: { galleryImageUrls: value } });
});
