import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth";
import { galleryUpload } from "../middleware/upload";
import { validate } from "../middleware/validate";
import {
  drawHistory,
  drawSchema,
  getSettings,
  listApplicants,
  listApplicantsSchema,
  listUsers,
  listUsersSchema,
  removeGalleryImage,
  removeGalleryImageSchema,
  runDraw,
  stats,
  updateSettings,
  updateSettingsSchema,
  uploadGalleryImages
} from "../controllers/admin.controller";

export const adminRoutes = Router();

adminRoutes.use(authenticate, requireAdmin);
adminRoutes.get("/stats", stats);
adminRoutes.get("/users", validate(listUsersSchema), listUsers);
adminRoutes.get("/applicants", validate(listApplicantsSchema), listApplicants);
adminRoutes.post("/draw/run", validate(drawSchema), runDraw);
adminRoutes.get("/draw/history", drawHistory);
adminRoutes.get("/settings", getSettings);
adminRoutes.patch("/settings", validate(updateSettingsSchema), updateSettings);
adminRoutes.post("/gallery/upload", galleryUpload.array("images", 8), uploadGalleryImages);
adminRoutes.delete("/gallery/image", validate(removeGalleryImageSchema), removeGalleryImage);
