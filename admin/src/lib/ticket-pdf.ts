import type { Applicant } from "@/types/api";

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function textLine(text: string, x: number, y: number, size = 11, font = "F1") {
  return `BT /${font} ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET`;
}

function wrapText(text: string, maxLength = 82) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxLength && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function downloadApplicantTicket(applicant: Applicant) {
  const date = new Date(applicant.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  const generatedAt = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  const travellers = applicant.travellers.length
    ? applicant.travellers.map((traveller, index) => `${index + 1}. ${traveller.fullName} (${traveller.phone})`)
    : ["1. Traveller details recorded with application"];

  const content: string[] = [
    "q 0.04 0.24 0.18 rg 0 735 595 107 re f Q",
    "q 0.79 0.66 0.30 rg 0 727 595 8 re f Q",
    textLine("Noor-e-Haram Trust", 48, 792, 24, "F2"),
    textLine("Lucky Draw Registration Ticket", 48, 766, 14),
    textLine(`Cover ID: ${applicant.coverId}`, 390, 782, 15, "F2"),
    textLine("This ticket is proof of registration for the Umrah support selection process.", 48, 710, 11),
    textLine("Applicant Details", 48, 672, 15, "F2"),
    textLine(`Name: ${applicant.user.name}`, 64, 646),
    textLine(`Email: ${applicant.user.email}`, 64, 626),
    textLine(`Phone: ${applicant.phone}`, 64, 606),
    textLine(`City / State: ${applicant.city}, ${applicant.stateName}`, 64, 586),
    textLine("Registration Details", 48, 548, 15, "F2"),
    textLine(`Persons: ${applicant.persons}`, 64, 522),
    textLine(`Entry Fee: Rs.${applicant.entryFee.toLocaleString("en-IN")}`, 64, 502),
    textLine(`Payment Status: ${applicant.paymentStatus.replace("_", " ")}`, 64, 482),
    textLine(`Application Status: ${applicant.status.replace("_", " ")}`, 64, 462),
    textLine(`Applied At: ${date}`, 64, 442),
    textLine("Registered Traveller(s)", 48, 404, 15, "F2")
  ];

  let y = 378;
  travellers.flatMap((item) => wrapText(item, 74)).forEach((line) => {
    content.push(textLine(line, 64, y));
    y -= 18;
  });

  content.push(
    "q 0.96 0.94 0.88 rg 48 86 499 74 re f Q",
    textLine("Important Note", 64, 140, 12, "F2"),
    textLine("Keep this ticket safely. Final verification and selection updates are handled by the trust team.", 64, 120, 10),
    textLine(`Generated: ${generatedAt}`, 64, 62, 9),
    textLine("Noor-e-Haram Trust | Faith | Service | Humanity", 320, 62, 9)
  );

  const stream = content.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `noor-e-haram-ticket-${applicant.coverId}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
