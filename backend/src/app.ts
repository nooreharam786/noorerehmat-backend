import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./config/env";
import { serveGalleryImage } from "./controllers/gallery.controller";
import { errorHandler, notFound } from "./middleware/error";
import { apiRoutes } from "./routes";

export const app = express();
const allowedOrigins = (env.CORS_ORIGINS ?? `${env.FRONTEND_URL},${env.ADMIN_URL}`)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(
  cors({
    origin: env.NODE_ENV === "development" ? true : allowedOrigins,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.get("/uploads/gallery/:id", serveGalleryImage);
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);

app.get("/", (_req, res) => {
  res.json({ success: true, data: { message: "Sacred Journey API", version: "1.0.0" } });
});

app.use("/api", apiRoutes);

if (env.NODE_ENV === "production") {
  const adminOutDir = path.resolve(__dirname, "../../admin/out");
  app.use("/admin", express.static(adminOutDir));
  app.get("/admin/*", (_req, res) => {
    res.sendFile(path.join(adminOutDir, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);
