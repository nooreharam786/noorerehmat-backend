import crypto from "crypto";
import { ApplicationStatus, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { HttpError } from "../utils/http";

type DrawInput = {
  fixedCount?: number;
  percentage?: number;
};

function shuffle<T>(items: T[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = crypto.randomInt(index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export async function runLuckyDraw(input: DrawInput) {
  const usePercentage = typeof input.percentage === "number" && input.percentage > 0;
  const requestedFixedCount = input.fixedCount ?? 125;

  return prisma.$transaction(async (tx) => {
    const paidApplicants = await tx.application.findMany({
      where: { paymentStatus: PaymentStatus.paid },
      select: { id: true, persons: true }
    });

    if (paidApplicants.length === 0) {
      throw new HttpError(400, "No paid applicants are available for the draw");
    }

    const totalPaidPersons = paidApplicants.reduce((total, applicant) => total + applicant.persons, 0);
    const calculatedCount = usePercentage
      ? Math.ceil(totalPaidPersons * ((input.percentage ?? 1.25) / 100))
      : requestedFixedCount;
    const seatLimit = Math.min(calculatedCount, totalPaidPersons);
    const tickets = paidApplicants.flatMap((applicant) => Array.from({ length: applicant.persons }, () => applicant.id));
    const selectedIds = new Set<string>();
    let selectedPersonCount = 0;

    for (const applicationId of shuffle(tickets)) {
      if (selectedIds.has(applicationId)) continue;

      const applicant = paidApplicants.find((item) => item.id === applicationId);
      if (!applicant) continue;
      if (selectedPersonCount > 0 && selectedPersonCount + applicant.persons > seatLimit) continue;

      selectedIds.add(applicationId);
      selectedPersonCount += applicant.persons;
      if (selectedPersonCount >= seatLimit) break;
    }

    await tx.application.updateMany({
      where: { paymentStatus: PaymentStatus.paid },
      data: { status: ApplicationStatus.not_selected }
    });

    await tx.application.updateMany({
      where: { id: { in: [...selectedIds] } },
      data: { status: ApplicationStatus.selected }
    });

    const result = await tx.drawResult.create({
      data: {
        totalUsers: totalPaidPersons,
        selectedCount: selectedPersonCount,
        percentage: usePercentage ? new Prisma.Decimal(input.percentage ?? 1.25).toNumber() : null
      }
    });

    return result;
  });
}
