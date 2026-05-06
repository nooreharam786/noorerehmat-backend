import nodemailer from "nodemailer";
import { env } from "../config/env";

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS) {
    console.info(`Password reset link for ${email}: ${resetUrl}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: email,
    subject: "Reset your Sacred Journey password",
    html: `
      <div style="font-family:Inter,Arial,sans-serif;color:#2d2926">
        <h2 style="color:#0B3D2E">Reset your password</h2>
        <p>Use the secure link below to choose a new password. It expires in 30 minutes.</p>
        <p><a href="${resetUrl}" style="background:#0B3D2E;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">Reset password</a></p>
      </div>
    `
  });
}
