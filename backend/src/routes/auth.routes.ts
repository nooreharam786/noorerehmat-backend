import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  forgotPassword,
  forgotPasswordSchema,
  finishOAuth,
  login,
  loginSchema,
  me,
  register,
  registerSchema,
  resetPassword,
  resetPasswordSchema,
  startOAuth
} from "../controllers/auth.controller";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), register);
authRoutes.post("/login", validate(loginSchema), login);
authRoutes.get("/oauth/:provider", startOAuth);
authRoutes.get("/oauth/:provider/callback", finishOAuth);
authRoutes.post("/oauth/:provider/callback", finishOAuth);
authRoutes.get("/me", authenticate, me);
authRoutes.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
authRoutes.post("/reset-password", validate(resetPasswordSchema), resetPassword);
