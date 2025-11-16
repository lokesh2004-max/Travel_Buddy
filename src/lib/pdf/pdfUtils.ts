/**
 * PDF Text Utilities
 * Helper functions for sanitizing and formatting text in PDFs
 */

/**
 * Removes emoji characters that may not render properly in jsPDF
 */
export const removeEmojis = (text: string): string =>
  text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();

/**
 * Converts special characters to ASCII equivalents
 */
export const normalizeToAscii = (text: string): string =>
  text
    .replace(/₹/g, 'INR ')
    .replace(/[–—−]/g, '-')
    .normalize('NFKD')
    .replace(/[^\x00-\x7F]/g, '');

/**
 * Complete text sanitization for PDF rendering
 */
export const sanitizeText = (text: string): string => 
  normalizeToAscii(removeEmojis(text));

/**
 * Safely truncates array to specified length
 */
export const truncateArray = <T>(array: T[], maxLength: number): T[] =>
  array.slice(0, maxLength);
