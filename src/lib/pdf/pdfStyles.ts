/**
 * PDF Styling Constants
 * Centralized color palette and typography settings for consistent PDF design
 */

export const PDF_COLORS = {
  primary: { r: 102, g: 126, b: 234 },
  secondary: { r: 66, g: 135, b: 245 },
  text: { r: 0, g: 0, b: 0 },
  textLight: { r: 128, g: 128, b: 128 },
  white: { r: 255, g: 255, b: 255 },
} as const;

export const PDF_FONT_SIZES = {
  title: 24,
  heading: 18,
  subheading: 14,
  body: 12,
  small: 10,
} as const;

export const PDF_SPACING = {
  section: 10,
  paragraph: 7,
  line: 5,
  item: 6,
} as const;

export const PDF_LAYOUT = {
  marginX: 20,
  marginY: 20,
  headerHeight: 40,
  pageBreakThreshold: 250,
} as const;
