import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth";
import { galleryUpload, pdfUpload } from "../middleware/upload";
import { validate } from "../middleware/validate";
import {
  createFeedback,
  createFeedbackSchema,
  deleteDocument,
  deleteFeedback,
  drawHistory,
  drawSchema,
  getSettings,
  listDocuments,
  listFeedback,
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
  uploadDocument,
  uploadDocumentSchema,
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
adminRoutes.get("/feedback", listFeedback);
adminRoutes.post("/feedback", validate(createFeedbackSchema), createFeedback);
adminRoutes.delete("/feedback/:id", deleteFeedback);
adminRoutes.get("/documents", listDocuments);
adminRoutes.post("/documents", pdfUpload.single("document"), validate(uploadDocumentSchema), uploadDocument);
adminRoutes.delete("/documents/:id", deleteDocument);
