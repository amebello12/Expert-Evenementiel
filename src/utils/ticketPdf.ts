import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { IssuedTicket } from '../types';

/**
 * Generates a high resolution QR Code data URL
 */
export async function generateQrCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 400,
      margin: 1.5,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
  } catch (err) {
    console.error('QR Code generation failed', err);
    return '';
  }
}

/**
 * Exports a branded, secure PDF e-ticket
 */
export async function downloadTicketPdf(ticket: IssuedTicket): Promise<void> {
  const qrDataUrl = await generateQrCodeDataUrl(ticket.qrCodeHash);

  // Create A5 format ticket (148 x 210 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });

  const pageWidth = 148;
  const pageHeight = 210;

  // Background Dark Theme header
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Orange accent bar
  doc.setFillColor(249, 115, 22); // #f97316
  doc.rect(0, 42, pageWidth, 3, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('EXPERT ÉVÉNEMENTIEL SÉNÉGAL', 12, 16);

  doc.setTextColor(249, 115, 22);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('BILLET ÉLECTRONIQUE OFFICIEL • ACCÈS SÉCURISÉ', 12, 23);

  doc.setTextColor(180, 180, 180);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`N° Billet : ${ticket.id}  •  Réf : ${ticket.orderId}`, 12, 33);

  // Main Event Card
  doc.setFillColor(245, 245, 247);
  doc.roundedRect(10, 52, pageWidth - 20, 148, 4, 4, 'F');
  doc.setDrawColor(220, 220, 225);
  doc.roundedRect(10, 52, pageWidth - 20, 148, 4, 4, 'S');

  // Event Title
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  const titleLines = doc.splitTextToSize(ticket.eventTitle, pageWidth - 36);
  doc.text(titleLines, 16, 64);

  // Category Badge
  const badgeY = 64 + titleLines.length * 6;
  doc.setFillColor(249, 115, 22);
  doc.roundedRect(16, badgeY - 4, 48, 8, 2, 2, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(ticket.ticketTierName.toUpperCase(), 19, badgeY + 1.5);

  // Date, Time, Venue Info
  doc.setTextColor(90, 90, 90);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('DATE & HEURE :', 16, badgeY + 13);
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`${ticket.eventDate} à ${ticket.eventTime}`, 16, badgeY + 18);

  doc.setTextColor(90, 90, 90);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('LIEU & ADRESSE :', 16, badgeY + 26);
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const venueLines = doc.splitTextToSize(`${ticket.eventVenue}, ${ticket.eventAddress || ticket.eventCity}`, pageWidth - 36);
  doc.text(venueLines, 16, badgeY + 31);

  // Attendee Details
  const attY = badgeY + 31 + venueLines.length * 5 + 4;
  doc.setDrawColor(220, 220, 225);
  doc.line(16, attY - 3, pageWidth - 16, attY - 3);

  doc.setTextColor(90, 90, 90);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('PARTICIPANT DÉSIGNÉ :', 16, attY + 4);
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(ticket.attendeeName, 16, attY + 10);

  doc.setTextColor(90, 90, 90);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tél : ${ticket.attendeePhone} • Paiement : ${ticket.paymentMethod} (${ticket.price.toLocaleString('fr-FR')} FCFA)`, 16, attY + 15);

  // QR Code
  if (qrDataUrl) {
    const qrSize = 42;
    const qrX = (pageWidth - qrSize) / 2;
    const qrY = attY + 21;

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 2, 2, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 2, 2, 'S');

    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    doc.setTextColor(110, 110, 110);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Présentez ce QR Code au contrôle à l’entrée de l’événement.', pageWidth / 2, qrY + qrSize + 6, { align: 'center' });
    doc.text(`Hash de contrôle : ${ticket.qrCodeHash}`, pageWidth / 2, qrY + qrSize + 10, { align: 'center' });
  }

  // Footer note
  doc.setTextColor(140, 140, 140);
  doc.setFontSize(6.5);
  doc.text('Billet nominatif à usage unique. Toute duplication ou falsification est strictement interdite.', pageWidth / 2, pageHeight - 6, { align: 'center' });

  // Save
  doc.save(`Billet_${ticket.id}_${ticket.attendeeName.replace(/\s+/g, '_')}.pdf`);
}
