import jsPDF from "jspdf";
import QRCode from "qrcode";

export async function generateCertificate(
  userName: string,
  courseTitle: string
) {
  const pdf = new jsPDF("landscape");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const certId = "CERT-" + Date.now();

  // 🟡 BACKGROUND WATERMARK
  pdf.setTextColor(230);
  pdf.setFontSize(100);
  pdf.text("LEARNHUB", pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: 45,
  });

  // 🔵 BORDER
  pdf.setDrawColor(0, 102, 204);
  pdf.setLineWidth(3);
  pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

  pdf.setLineWidth(1);
  pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // 🏷 LOGO TEXT (replace with image if you want)
  pdf.setFont("Times", "Bold");
  pdf.setFontSize(22);
  pdf.setTextColor(0, 102, 204);
  pdf.text("LearnHub Academy", 30, 30);

  // 🎓 TITLE
  pdf.setFontSize(36);
  pdf.setTextColor(0, 51, 102);
  pdf.text("CERTIFICATE OF COMPLETION", pageWidth / 2, 55, {
    align: "center",
  });

  // Subtitle
  pdf.setFontSize(18);
  pdf.setTextColor(80);
  pdf.text("This certificate is proudly awarded to", pageWidth / 2, 80, {
    align: "center",
  });

  // 👤 NAME
  pdf.setFont("Times", "Bold");
  pdf.setFontSize(30);
  pdf.setTextColor(0);
  pdf.text(userName, pageWidth / 2, 100, { align: "center" });

  pdf.line(pageWidth / 2 - 60, 105, pageWidth / 2 + 60, 105);

  // 📘 TEXT
  pdf.setFont("Times", "Normal");
  pdf.setFontSize(18);
  pdf.text(
    "for successfully completing the certified course",
    pageWidth / 2,
    125,
    { align: "center" }
  );

  // 📚 COURSE TITLE
  pdf.setFont("Times", "Bold");
  pdf.setFontSize(26);
  pdf.setTextColor(0, 102, 204);
  pdf.text(courseTitle, pageWidth / 2, 145, {
    align: "center",
  });

  // 📅 DATE
  pdf.setFontSize(14);
  pdf.setTextColor(0);
  pdf.text(
    `Date: ${new Date().toLocaleDateString()}`,
    40,
    pageHeight - 40
  );

  // 🆔 CERTIFICATE ID
  pdf.text(`Certificate ID: ${certId}`, 40, pageHeight - 25);

  // ✍️ SIGNATURE
  pdf.text("Authorized Signature", pageWidth - 80, pageHeight - 40);
  pdf.line(
    pageWidth - 100,
    pageHeight - 45,
    pageWidth - 40,
    pageHeight - 45
  );

  // 🏅 GOLD SEAL (simple circle)
  pdf.setDrawColor(212, 175, 55);
  pdf.setFillColor(255, 215, 0);
  pdf.circle(pageWidth - 60, 60, 15, "FD");

  pdf.setFontSize(10);
  pdf.setTextColor(120, 90, 0);
  pdf.text("Verified", pageWidth - 60, 62, { align: "center" });

  // 🔐 QR CODE (verification link)
  const qrData = `https://yourdomain.com/verify/${certId}`;

  const qrImage = await QRCode.toDataURL(qrData);

  pdf.addImage(qrImage, "PNG", pageWidth - 70, pageHeight - 80, 40, 40);

  pdf.setFontSize(10);
  pdf.text("Scan to verify", pageWidth - 50, pageHeight - 35, {
    align: "center",
  });

  // 🏁 FOOTER
  pdf.setFont("Times", "Italic");
  pdf.setFontSize(14);
  pdf.setTextColor(120);
  pdf.text("LearnHub Academy", pageWidth / 2, pageHeight - 15, {
    align: "center",
  });

  // 💾 SAVE
  pdf.save(`${courseTitle}-certificate.pdf`);
}