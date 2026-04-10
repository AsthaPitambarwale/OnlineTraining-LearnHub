import jsPDF from "jspdf";

export function generateCertificate(userName: string, courseTitle: string) {
  const pdf = new jsPDF("landscape");

  pdf.setFont("Times", "Bold");
  pdf.setFontSize(40);
  pdf.text("Certificate of Completion", 148, 60, { align: "center" });

  pdf.setFontSize(20);
  pdf.setFont("Times", "Normal");
  pdf.text("This is to certify that", 148, 90, { align: "center" });

  pdf.setFontSize(28);
  pdf.setFont("Times", "Bold");
  pdf.text(userName, 148, 110, { align: "center" });

  pdf.setFontSize(20);
  pdf.setFont("Times", "Normal");
  pdf.text("has successfully completed the course", 148, 130, { align: "center" });

  pdf.setFontSize(26);
  pdf.setFont("Times", "Bold");
  pdf.text(courseTitle, 148, 150, { align: "center" });

  pdf.setFontSize(16);
  pdf.text(
    `Date: ${new Date().toLocaleDateString()}`,
    148,
    180,
    { align: "center" }
  );

  pdf.save(`${courseTitle}-certificate.pdf`);
}