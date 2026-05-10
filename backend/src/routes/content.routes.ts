import { Router } from "express";
import { createFeedback, createFeedbackSchema, getPublicContent, listPublicDocuments, listPublicFeedback } from "../controllers/content.controller";
import { validate } from "../middleware/validate";

export const contentRoutes = Router();

contentRoutes.get("/public", getPublicContent);
contentRoutes.get("/documents", listPublicDocuments);
contentRoutes.get("/feedback", listPublicFeedback);
contentRoutes.post("/feedback", validate(createFeedbackSchema), createFeedback);
