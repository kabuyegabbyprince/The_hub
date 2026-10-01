import { jsPDF } from 'jspdf';

/**
 * Generates and triggers download of an official The Hub Certificate of Verified Competence PDF
 * @param {Object} certData
 * @param {string} certData.learnerName
 * @param {string} certData.courseTitle
 * @param {string} certData.category
 * @param {string} certData.date
 * @param {string} certData.certificateId
 * @param {string} [certData.instructorName]
 * @param {string} [certData.level]
 */
export function generateCertificatePdf({
  learnerName = 'Kezia Umutoni',
  courseTitle = 'HTML, CSS & Modern Web Design',
  category = 'Technology & Software',
  date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  certificateId = `HUB-RWA-${Date.now().toString().slice(-6)}`,
  instructorName = 'Jean-Paul Nsengiyumva',
  level = 'Level 2: Practitioner'
}) {
  // A4 Landscape: 297mm width x 210mm height
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const width = 297;
  const height = 210;

  // Background Fill (Soft warm ivory / slate-50)
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, width, height, 'F');

  // Outer Decorative Border (Deep Midnight Navy)
  doc.setDrawColor(15, 23, 42); // #0f172a
  doc.setLineWidth(3);
  doc.rect(10, 10, width - 20, height - 20);

  // Inner Thin Accent Border (Crimson Red hairline)
  doc.setDrawColor(220, 38, 38); // #dc2626
  doc.setLineWidth(0.8);
  doc.rect(13, 13, width - 26, height - 26);

  // Corner Ornaments
  doc.setFillColor(30, 58, 138); // #1e3a8a
  doc.rect(9, 9, 6, 6, 'F');
  doc.rect(width - 15, 9, 6, 6, 'F');
  doc.rect(9, height - 15, 6, 6, 'F');
  doc.rect(width - 15, height - 15, 6, 6, 'F');

  // Header - Organization Title
  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('THE HUB · SKILLBRIDGE RWANDA', width / 2, 28, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('NATIONAL DATA-INFORMED SKILLS ECOSYSTEM · NISR 2026 BENCHMARK', width / 2, 33, { align: 'center' });

  // Main Certificate Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.text('CERTIFICATE OF VERIFIED COMPETENCE', width / 2, 50, { align: 'center' });

  // Subtitle
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.text('This is to officially certify that', width / 2, 62, { align: 'center' });

  // Learner Name (Large, prominent)
  doc.setTextColor(15, 23, 42);
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.text(learnerName.toUpperCase(), width / 2, 78, { align: 'center' });

  // Decorative Underline under learner name
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(1);
  doc.line(70, 82, width - 70, 82);

  // Body Description
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(
    `has successfully passed the comprehensive curriculum, practical assessments, and capstone challenges for`,
    width / 2,
    92,
    { align: 'center' }
  );

  // Course Title Box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(45, 98, width - 90, 16, 3, 3, 'FD');

  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(courseTitle, width / 2, 108.5, { align: 'center' });

  // Details row: Track, Level, Date
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Sector: ${category}  ·  Assessed Level: ${level}`, width / 2, 124, { align: 'center' });

  // Verification Seal / Badge graphic (Left center)
  doc.setDrawColor(30, 58, 138);
  doc.setFillColor(238, 242, 255);
  doc.circle(42, 158, 16, 'FD');
  doc.setDrawColor(220, 38, 38);
  doc.circle(42, 158, 14, 'D');

  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('VERIFIED', 42, 156, { align: 'center' });
  doc.setTextColor(220, 38, 38);
  doc.setFontSize(7);
  doc.text('COMPETENCE', 42, 161, { align: 'center' });

  // Signatures Area
  // Signature 1: Academic & Skills Director
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(80, 168, 135, 168);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(instructorName, 107.5, 173, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Academic Course Lead', 107.5, 178, { align: 'center' });

  // Signature 2: Platform Director
  doc.line(width - 135, 168, width - 80, 168);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('The Hub Skills Registry', width - 107.5, 173, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Director of Skill Verification', width - 107.5, 178, { align: 'center' });

  // Footer Metadata
  doc.setTextColor(100, 116, 139);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.text(`Date Issued: ${date}`, 25, 194);
  doc.text(`Certificate ID: ${certificateId}`, width / 2, 194, { align: 'center' });
  doc.text(`Verify: https://thehub.rw/verify/${certificateId}`, width - 25, 194, { align: 'right' });

  // Save / Trigger Download
  const filename = `Certificate-${courseTitle.replace(/[^a-zA-Z0-9]/g, '_')}-${learnerName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
}
