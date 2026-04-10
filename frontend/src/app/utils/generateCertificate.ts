import jsPDF from "jspdf";
import QRCode from "qrcode";

export async function generateCertificate(
  userName: string,
  courseTitle: string
) {
  const pdf = new jsPDF("landscape");

  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();

  const certId = "CERT-" + Date.now();

  // ===== BACKGROUND WATERMARK =====
  pdf.setTextColor(230);
  pdf.setFontSize(90);
  pdf.text("LEARNHUB", w / 2, h / 2, {
    align: "center",
    angle: 45,
  });

  // ===== BORDER =====
  pdf.setDrawColor(0, 102, 204);
  pdf.setLineWidth(2);
  pdf.rect(12, 12, w - 24, h - 24);

  pdf.setLineWidth(0.8);
  pdf.rect(18, 18, w - 36, h - 36);

  // ===== HEADER =====
  pdf.setFont("Times", "Bold");
  pdf.setFontSize(20);
  pdf.setTextColor(0, 102, 204);
  pdf.text("LearnHub Academy", 25, 30);

  // ===== TITLE =====
  pdf.setFontSize(34);
  pdf.setTextColor(0, 51, 102);
  pdf.text("CERTIFICATE OF COMPLETION", w / 2, 55, {
    align: "center",
  });

  // ===== SUBTITLE =====
  pdf.setFont("Times", "Normal");
  pdf.setFontSize(16);
  pdf.setTextColor(80);
  pdf.text("This certificate is proudly awarded to", w / 2, 75, {
    align: "center",
  });

  // ===== NAME =====
  pdf.setFont("Times", "Bold");
  pdf.setFontSize(28);
  pdf.setTextColor(0);
  pdf.text(userName, w / 2, 95, { align: "center" });

  pdf.setDrawColor(0, 102, 204);
  pdf.line(w / 2 - 50, 100, w / 2 + 50, 100);

  // ===== COURSE TEXT =====
  pdf.setFont("Times", "Normal");
  pdf.setFontSize(16);
  pdf.text(
    "for successfully completing the certified course",
    w / 2,
    120,
    { align: "center" }
  );

  // ===== COURSE TITLE =====
  pdf.setFont("Times", "Bold");
  pdf.setFontSize(22);
  pdf.setTextColor(0, 102, 204);

  // handle long title wrapping
  const splitTitle = pdf.splitTextToSize(courseTitle, 180);
  pdf.text(splitTitle, w / 2, 140, { align: "center" });

  // ===== LEFT FOOTER =====
  pdf.setFontSize(12);
  pdf.setTextColor(0);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 30, h - 35);
  pdf.text(`Certificate ID: ${certId}`, 30, h - 20);

  // ===== SIGNATURE (RIGHT SIDE CLEAN) =====
  const sigX = w - 90;
  const sigY = h - 35;

  pdf.line(sigX - 20, sigY - 5, sigX + 40, sigY - 5);
  pdf.setFontSize(12);
  pdf.text("Authorized Signature", sigX + 10, sigY + 5, {
    align: "center",
  });

  // ===== QR CODE (BOTTOM RIGHT, NO OVERLAP) =====
  const qrData = `https://yourdomain.com/verify/${certId}`;
  const qrImage = await QRCode.toDataURL(qrData);

  pdf.addImage(qrImage, "PNG", w - 70, h - 90, 40, 40);

  pdf.setFontSize(10);
  pdf.text("Scan to verify", w - 50, h - 45, { align: "center" });

  // ===== GOLD SEAL (TOP RIGHT, PROPERLY PLACED) =====
  const sealX = w - 60;
  const sealY = 70;

  pdf.setDrawColor(212, 175, 55);
  pdf.setFillColor(255, 215, 0);
  pdf.circle(sealX, sealY, 14, "FD");

  pdf.setFontSize(10);
  pdf.setTextColor(120, 90, 0);
  pdf.text("Verified", sealX, sealY + 3, { align: "center" });

  // ===== FOOTER CENTER =====
  pdf.setFont("Times", "Italic");
  pdf.setFontSize(12);
  pdf.setTextColor(120);
  pdf.text("LearnHub Academy", w / 2, h - 10, { align: "center" });

  // ===== SAVE =====
  pdf.save(`${courseTitle}-certificate.pdf`);
}