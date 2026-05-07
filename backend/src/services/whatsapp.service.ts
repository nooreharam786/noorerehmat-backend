import { PaymentStatus } from "@prisma/client";
import { env } from "../config/env";

type NotifyApplication = {
  coverId: string;
  phone: string;
  persons: number;
  entryFee: number;
  paymentStatus?: PaymentStatus;
  user?: {
    name: string;
  };
};

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

async function sendWhatsAppText(phone: string, message: string) {
  const to = normalizePhone(phone);
  if (!to) return;

  if (!env.WHATSAPP_ACCESS_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) {
    console.info(`WhatsApp not configured. Message for ${to}: ${message}`);
    return;
  }

  const response = await fetch(
    `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          preview_url: false,
          body: message
        }
      })
    }
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`WhatsApp send failed: ${response.status} ${body}`);
  }
}

function safeNotify(task: Promise<void>) {
  task.catch((error) => {
    console.error(error instanceof Error ? error.message : "WhatsApp notification failed");
  });
}

export function notifyApplicationSubmitted(application: NotifyApplication) {
  safeNotify(
    sendWhatsAppText(
      application.phone,
      [
        `Assalamu Alaikum${application.user?.name ? ` ${application.user.name}` : ""}.`,
        `Your Noor-e-Rehmat application has been submitted successfully.`,
        `Cover ID: ${application.coverId}`,
        `Persons: ${application.persons}`,
        `Amount: Rs.${application.entryFee.toLocaleString("en-IN")}`,
        `Please complete payment so your cover can enter verification.`
      ].join("\n")
    )
  );
}

export function notifyPaymentVerified(application: NotifyApplication) {
  if (application.paymentStatus !== PaymentStatus.paid) return;

  safeNotify(
    sendWhatsAppText(
      application.phone,
      [
        `Payment verified for Noor-e-Rehmat cover ${application.coverId}.`,
        `Your ${application.persons} registered traveller seat${application.persons > 1 ? "s are" : " is"} now included in the paid draw pool.`,
        `Please keep this Cover ID safe for result tracking.`
      ].join("\n")
    )
  );
}

export function notifyDrawSelected(applications: NotifyApplication[]) {
  for (const application of applications) {
    safeNotify(
      sendWhatsAppText(
        application.phone,
        [
          `MashaAllah! Your Noor-e-Rehmat cover ${application.coverId} has been selected in the draw.`,
          `Registered persons: ${application.persons}`,
          `Our team will contact you for verification and next steps.`
        ].join("\n")
      )
    );
  }
}
