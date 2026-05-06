import { Router } from "express";
import { apply, applySchema, markPaid, myApplication, states } from "../controllers/application.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";

export const applicationRoutes = Router();

applicationRoutes.get("/states", states);
applicationRoutes.use(authenticate);
applicationRoutes.post("/", validate(applySchema), apply);
applicationRoutes.get("/me", myApplication);
applicationRoutes.patch("/me/payment", markPaid);
