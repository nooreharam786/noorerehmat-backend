import { z } from "zod";
import { PaymentStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { asyncHandler, HttpError } from "../utils/http";
import { notifyPaymentVerified } from "../services/whatsapp.service";

export const paymentCallbackSchema = z.object({
  body: z.object({
    userId: z.string().min(1),
    status: z.nativeEnum(PaymentStatus)
  })
});

export const getPaymentLink = asyncHandler(async (req, res) => {
  const application = await prisma.application.findUnique({
    where: { userId: req.user!.id },
    include: { user: { select: { email: true, name: true } } }
  });

  if (!application) {
    throw new HttpError(404, "Apply for the lucky draw before starting payment");
  }

  if (application.paymentStatus === PaymentStatus.paid) {
    throw new HttpError(409, "This application is already marked as paid");
  }

  const setting = await prisma.setting.findUnique({ where: { key: "IMB_PAYMENT_LINK" } });
  const baseUrl = setting?.value;
  if (!baseUrl) {
    throw new HttpError(500, "Payment link is not configured");
  }

  const replacements = {
    amount: String(application.entryFee),
    coverId: application.coverId,
    userId: application.userId,
    email: application.user.email,
    name: application.user.name
  };

  const hasTemplate = Object.keys(replacements).some((key) => baseUrl.includes(`{${key}}`));
  let url = Object.entries(replacements).reduce(
    (value, [key, replacement]) => value.replaceAll(`{${key}}`, encodeURIComponent(replacement)),
    baseUrl
  );

  if (!hasTemplate) {
    const parsed = new URL(url);
    parsed.searchParams.set("amount", replacements.amount);
    parsed.searchParams.set("coverId", replacements.coverId);
    parsed.searchParams.set("userId", replacements.userId);
    url = parsed.toString();
  }

  res.json({
    success: true,
    data: {
      url,
      amount: application.entryFee,
      coverId: application.coverId,
      persons: application.persons,
      paymentStatus: application.paymentStatus
    }
  });
});

export const paymentCallback = asyncHandler(async (req, res) => {
  const application = await prisma.application.findUnique({ where: { userId: req.body.userId } });
  if (!application) {
    throw new HttpError(404, "Application not found");
  }

  const updated = await prisma.application.update({
    where: { id: application.id },
    data: { paymentStatus: req.body.status },
    include: { user: { select: { name: true } } }
  });

  notifyPaymentVerified(updated);

  res.json({ success: true, data: updated });
});
