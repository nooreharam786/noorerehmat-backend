import { z } from "zod";
import { PaymentStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { asyncHandler, HttpError } from "../utils/http";

export const paymentCallbackSchema = z.object({
  body: z.object({
    userId: z.string().min(1),
    status: z.nativeEnum(PaymentStatus)
  })
});

export const getPaymentLink = asyncHandler(async (_req, res) => {
  const setting = await prisma.setting.findUnique({ where: { key: "IMB_PAYMENT_LINK" } });
  res.json({ success: true, data: { url: setting?.value } });
});

export const paymentCallback = asyncHandler(async (req, res) => {
  const application = await prisma.application.findUnique({ where: { userId: req.body.userId } });
  if (!application) {
    throw new HttpError(404, "Application not found");
  }

  const updated = await prisma.application.update({
    where: { id: application.id },
    data: { paymentStatus: req.body.status }
  });

  res.json({ success: true, data: updated });
});
