import { Router } from "express";
import { getPaymentLink, paymentCallback, paymentCallbackSchema } from "../controllers/payment.controller";
import { authenticate, requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";

export const paymentRoutes = Router();

paymentRoutes.get("/imb-link", getPaymentLink);
paymentRoutes.post("/callback", authenticate, requireAdmin, validate(paymentCallbackSchema), paymentCallback);
