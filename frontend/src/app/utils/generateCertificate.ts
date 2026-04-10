import jsPDF from "jspdf";

export function generateCertificate(userName: string, courseTitle: string) {
  const pdf = new jsPDF("landscape");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // 🎨 BORDER
  pdf.setDrawColor(0, 102, 204);
  pdf.setLineWidth(3);
  pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

  pdf.setLineWidth(1);
  pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // 🎓 TITLE
  pdf.setFont("Times", "Bold");
  pdf.setFontSize(38);
  pdf.setTextColor(0, 51, 102);
  pdf.text("CERTIFICATE OF COMPLETION", pageWidth / 2, 50, {
    align: "center",
  });

  // Subtitle
  pdf.setFontSize(18);
  pdf.setFont("Times", "Normal");
  pdf.setTextColor(80);
  pdf.text("This is proudly presented to", pageWidth / 2, 75, {
    align: "center",
  });

  // 👤 USER NAME
  pdf.setFont("Times", "Bold");
  pdf.setFontSize(30);
  pdf.setTextColor(0, 0, 0);
  pdf.text(userName, pageWidth / 2, 95, {
    align: "center",
  });

  // Line under name
  pdf.setLineWidth(0.5);
  pdf.line(pageWidth / 2 - 60, 100, pageWidth / 2 + 60, 100);

  // 📘 COURSE TEXT
  pdf.setFont("Times", "Normal");
  pdf.setFontSize(18);
  pdf.text("for successfully completing the course", pageWidth / 2, 120, {
    align: "center",
  });

  // 📚 COURSE TITLE
  pdf.setFont("Times", "Bold");
  pdf.setFontSize(26);
  pdf.setTextColor(0, 102, 204);
  pdf.text(courseTitle, pageWidth / 2, 140, {
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

  // ✍️ SIGNATURE
  pdf.setFont("Times", "Normal");
  pdf.text("Authorized Signature", pageWidth - 80, pageHeight - 40);

  pdf.line(
    pageWidth - 100,
    pageHeight - 45,
    pageWidth - 40,
    pageHeight - 45
  );

  // 🏅 SEAL TEXT
  pdf.setFont("Times", "Italic");
  pdf.setFontSize(14);
  pdf.setTextColor(120);
  pdf.text("LearnHub Academy", pageWidth / 2, pageHeight - 30, {
    align: "center",
  });

  // 💾 SAVE
  pdf.save(`${courseTitle}-certificate.pdf`);
}