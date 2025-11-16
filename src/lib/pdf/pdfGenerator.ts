/**
 * PDF Generator for Travel Booking Itineraries
 * Creates professionally formatted PDF documents with trip and buddy details
 */

import jsPDF from 'jspdf';
import { sanitizeText, truncateArray } from './pdfUtils';
import { PDF_COLORS, PDF_FONT_SIZES, PDF_SPACING, PDF_LAYOUT } from './pdfStyles';

export interface TripDetails {
  name: string;
  duration: string;
  approximateCost: string;
  rating: number;
  description: string;
  tripHighlights: string[];
}

export interface BuddyDetails {
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  matchPercentage: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
}

export interface PDFGeneratorOptions {
  trip: TripDetails;
  buddy: BuddyDetails;
  customer: CustomerDetails;
}

/**
 * Generates a travel booking itinerary PDF
 * @returns Blob containing the PDF document, or null on error
 */
export const generateBookingPDF = (options: PDFGeneratorOptions): Blob | null => {
  const { trip, buddy, customer } = options;

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos: number = PDF_LAYOUT.marginY;

    // Set default font for better character support
    doc.setFont('helvetica');

    // ===== HEADER SECTION =====
    renderHeader(doc, pageWidth);
    yPos = 50;

    // ===== TRIP DETAILS SECTION =====
    yPos = renderTripDetails(doc, trip, yPos, pageWidth);

    // ===== TRAVEL BUDDY SECTION =====
    yPos = renderBuddyDetails(doc, buddy, yPos, pageWidth, pageHeight);

    // ===== CUSTOMER DETAILS SECTION =====
    yPos = renderCustomerDetails(doc, customer, yPos, pageWidth, pageHeight);

    // ===== FOOTER =====
    renderFooter(doc, pageWidth, pageHeight);

    return doc.output('blob');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return null;
  }
};

/**
 * Renders the PDF header with branding
 */
const renderHeader = (doc: jsPDF, pageWidth: number): void => {
  const { primary, white } = PDF_COLORS;
  
  doc.setFillColor(primary.r, primary.g, primary.b);
  doc.rect(0, 0, pageWidth, PDF_LAYOUT.headerHeight, 'F');
  doc.setTextColor(white.r, white.g, white.b);
  doc.setFontSize(PDF_FONT_SIZES.title);
  doc.text('Travel Booking Itinerary', pageWidth / 2, 25, { align: 'center' });
};

/**
 * Renders trip information section
 */
const renderTripDetails = (
  doc: jsPDF,
  trip: TripDetails,
  startY: number,
  pageWidth: number
): number => {
  let yPos = startY;
  const { primary, secondary, text } = PDF_COLORS;

  // Section Title
  doc.setFontSize(PDF_FONT_SIZES.heading);
  doc.setTextColor(primary.r, primary.g, primary.b);
  doc.text('Trip Details', PDF_LAYOUT.marginX, yPos);
  yPos += PDF_SPACING.section;

  // Trip Info
  doc.setFontSize(PDF_FONT_SIZES.body);
  doc.setTextColor(text.r, text.g, text.b);
  
  const tripInfo = [
    `Destination: ${sanitizeText(trip.name)}`,
    `Duration: ${sanitizeText(trip.duration)}`,
    `Budget: ${sanitizeText(trip.approximateCost)}`,
    `Rating: ${trip.rating} stars`,
  ];

  tripInfo.forEach((line) => {
    doc.text(line, PDF_LAYOUT.marginX, yPos);
    yPos += PDF_SPACING.paragraph;
  });

  yPos += PDF_SPACING.line;

  // Description with text wrapping
  doc.setFontSize(PDF_FONT_SIZES.small);
  const wrappedDescription = doc.splitTextToSize(
    sanitizeText(trip.description),
    pageWidth - 2 * PDF_LAYOUT.marginX
  );
  doc.text(wrappedDescription, PDF_LAYOUT.marginX, yPos);
  yPos += wrappedDescription.length * PDF_SPACING.line + PDF_SPACING.section;

  // Trip Highlights
  doc.setFontSize(PDF_FONT_SIZES.subheading);
  doc.setTextColor(secondary.r, secondary.g, secondary.b);
  doc.text('Trip Highlights', PDF_LAYOUT.marginX, yPos);
  yPos += PDF_SPACING.paragraph;

  doc.setFontSize(PDF_FONT_SIZES.small);
  doc.setTextColor(text.r, text.g, text.b);
  
  const highlights = truncateArray(trip.tripHighlights, 5);
  highlights.forEach((highlight) => {
    doc.text(`• ${sanitizeText(highlight)}`, PDF_LAYOUT.marginX + 5, yPos);
    yPos += PDF_SPACING.item;
  });

  yPos += PDF_SPACING.section;
  return yPos;
};

/**
 * Renders travel buddy information
 */
const renderBuddyDetails = (
  doc: jsPDF,
  buddy: BuddyDetails,
  startY: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPos = startY;
  const { primary, text } = PDF_COLORS;

  // Check if we need a new page
  if (yPos > PDF_LAYOUT.pageBreakThreshold) {
    doc.addPage();
    yPos = PDF_LAYOUT.marginY;
  }

  // Section Title
  doc.setFontSize(PDF_FONT_SIZES.heading);
  doc.setTextColor(primary.r, primary.g, primary.b);
  doc.text('Your Travel Buddy', PDF_LAYOUT.marginX, yPos);
  yPos += PDF_SPACING.section;

  // Buddy Info
  doc.setFontSize(PDF_FONT_SIZES.body);
  doc.setTextColor(text.r, text.g, text.b);
  
  const buddyInfo = [
    `Name: ${buddy.name}`,
    `Age: ${buddy.age} years`,
    `Location: ${buddy.location}`,
    `Match Percentage: ${buddy.matchPercentage}%`,
  ];

  buddyInfo.forEach((line) => {
    doc.text(line, PDF_LAYOUT.marginX, yPos);
    yPos += PDF_SPACING.paragraph;
  });

  yPos += PDF_SPACING.line;

  // Bio with text wrapping
  doc.setFontSize(PDF_FONT_SIZES.small);
  const wrappedBio = doc.splitTextToSize(
    sanitizeText(buddy.bio),
    pageWidth - 2 * PDF_LAYOUT.marginX
  );
  doc.text(wrappedBio, PDF_LAYOUT.marginX, yPos);
  yPos += wrappedBio.length * PDF_SPACING.line + PDF_SPACING.paragraph;

  // Interests
  doc.setFontSize(PDF_FONT_SIZES.body);
  doc.text('Interests:', PDF_LAYOUT.marginX, yPos);
  yPos += PDF_SPACING.paragraph;
  
  doc.setFontSize(PDF_FONT_SIZES.small);
  const interestsText = sanitizeText(buddy.interests.join(', '));
  const wrappedInterests = doc.splitTextToSize(
    interestsText,
    pageWidth - 2 * PDF_LAYOUT.marginX - 5
  );
  doc.text(wrappedInterests, PDF_LAYOUT.marginX + 5, yPos);
  yPos += wrappedInterests.length * PDF_SPACING.line + PDF_SPACING.section;

  return yPos;
};

/**
 * Renders customer details section
 */
const renderCustomerDetails = (
  doc: jsPDF,
  customer: CustomerDetails,
  startY: number,
  pageWidth: number,
  pageHeight: number
): number => {
  let yPos = startY;
  const { secondary, text } = PDF_COLORS;

  // Check if we need a new page
  if (yPos > PDF_LAYOUT.pageBreakThreshold) {
    doc.addPage();
    yPos = PDF_LAYOUT.marginY;
  }

  // Section Title
  doc.setFontSize(PDF_FONT_SIZES.heading);
  doc.setTextColor(secondary.r, secondary.g, secondary.b);
  doc.text('Customer Details', PDF_LAYOUT.marginX, yPos);
  yPos += PDF_SPACING.section;

  // Customer Info
  doc.setFontSize(PDF_FONT_SIZES.body);
  doc.setTextColor(text.r, text.g, text.b);
  doc.text(`Name: ${customer.name}`, PDF_LAYOUT.marginX, yPos);
  yPos += PDF_SPACING.paragraph;
  doc.text(`Email: ${customer.email}`, PDF_LAYOUT.marginX, yPos);

  return yPos;
};

/**
 * Renders footer message
 */
const renderFooter = (doc: jsPDF, pageWidth: number, pageHeight: number): void => {
  const { textLight } = PDF_COLORS;
  
  doc.setFontSize(PDF_FONT_SIZES.small);
  doc.setTextColor(textLight.r, textLight.g, textLight.b);
  doc.text(
    'Thank you for choosing us! We hope you have an amazing journey!',
    pageWidth / 2,
    pageHeight - PDF_LAYOUT.marginY,
    { align: 'center' }
  );
};
