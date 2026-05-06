import { Router } from "express";
import { getPublicContent } from "../controllers/content.controller";

export const contentRoutes = Router();

contentRoutes.get("/public", getPublicContent);
