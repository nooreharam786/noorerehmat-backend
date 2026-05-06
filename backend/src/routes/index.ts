import { Router } from "express";
import { adminRoutes } from "./admin.routes";
import { applicationRoutes } from "./application.routes";
import { authRoutes } from "./auth.routes";
import { contentRoutes } from "./content.routes";
import { paymentRoutes } from "./payment.routes";

export const apiRoutes = Router();

apiRoutes.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", service: "sacred-journey-api" } });
});

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/applications", applicationRoutes);
apiRoutes.use("/content", contentRoutes);
apiRoutes.use("/payments", paymentRoutes);
apiRoutes.use("/admin", adminRoutes);
