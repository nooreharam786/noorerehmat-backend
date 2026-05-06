import { PaymentStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { asyncHandler, HttpError } from "../utils/http";

const entryFeePerPerson = 1500;

export const indianStates = [
  { code: "AN", name: "Andaman and Nicobar Islands" },
  { code: "AP", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CH", name: "Chandigarh" },
  { code: "CT", name: "Chhattisgarh" },
  { code: "DN", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { code: "DL", name: "Delhi" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JK", name: "Jammu and Kashmir" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "LA", name: "Ladakh" },
  { code: "LD", name: "Lakshadweep" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "MN", name: "Manipur" },
  { code: "ML", name: "Meghalaya" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OD", name: "Odisha" },
  { code: "PY", name: "Puducherry" },
  { code: "PB", name: "Punjab" },
  { code: "RJ", name: "Rajasthan" },
  { code: "SK", name: "Sikkim" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "TG", name: "Telangana" },
  { code: "TR", name: "Tripura" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "UK", name: "Uttarakhand" },
  { code: "WB", name: "West Bengal" }
];

const stateCodes = new Set(indianStates.map((state) => state.code));

export const applySchema = z.object({
  body: z.object({
    phone: z.string().trim().min(7).max(20),
    stateCode: z.string().trim().toUpperCase().refine((value) => stateCodes.has(value), "Select a valid state"),
    city: z.string().trim().min(2).max(80),
    persons: z.coerce.number().int().min(1).max(20)
  })
});

async function nextCoverId(stateCode: string) {
  const latest = await prisma.application.findFirst({
    where: { coverId: { startsWith: stateCode } },
    orderBy: { coverId: "desc" },
    select: { coverId: true }
  });
  const latestNumber = latest?.coverId ? Number(latest.coverId.slice(2)) : 0;
  return `${stateCode}${String((Number.isFinite(latestNumber) ? latestNumber : 0) + 1).padStart(6, "0")}`;
}

export const apply = asyncHandler(async (req, res) => {
  const state = indianStates.find((item) => item.code === req.body.stateCode)!;
  const existing = await prisma.application.findUnique({ where: { userId: req.user!.id } });

  if (existing?.paymentStatus === PaymentStatus.paid) {
    throw new HttpError(409, "Paid applications cannot be edited. Please contact support for changes.");
  }

  const coverId = existing && existing.stateCode === req.body.stateCode ? existing.coverId : await nextCoverId(req.body.stateCode);
  const application = await prisma.application.upsert({
    where: { userId: req.user!.id },
    update: {
      coverId,
      phone: req.body.phone,
      stateCode: state.code,
      stateName: state.name,
      city: req.body.city,
      persons: req.body.persons,
      entryFee: req.body.persons * entryFeePerPerson
    },
    create: {
      userId: req.user!.id,
      coverId,
      phone: req.body.phone,
      stateCode: state.code,
      stateName: state.name,
      city: req.body.city,
      persons: req.body.persons,
      entryFee: req.body.persons * entryFeePerPerson
    }
  });

  res.status(201).json({ success: true, data: application });
});

export const myApplication = asyncHandler(async (req, res) => {
  const application = await prisma.application.findUnique({ where: { userId: req.user!.id } });
  res.json({ success: true, data: application });
});

export const states = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: { states: indianStates, entryFeePerPerson } });
});

export const markPaid = asyncHandler(async (req, res) => {
  const application = await prisma.application.findUnique({ where: { userId: req.user!.id } });
  if (!application) {
    throw new HttpError(404, "Apply for the lucky draw before marking payment");
  }

  const updated = await prisma.application.update({
    where: { id: application.id },
    data: { paymentStatus: PaymentStatus.paid }
  });

  res.json({ success: true, data: updated });
});
