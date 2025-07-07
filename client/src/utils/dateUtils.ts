/**
 * Utility functions for date formatting
 */

/**
 * Formats a date to "28 June 2025" format
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date | number): string => {
  if (!date) return '';

  const dateObj = new Date(date);

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return date.toString(); // Return original if invalid
  }

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return dateObj.toLocaleDateString('en-GB', options);
};

/**
 * Formats a date for blog meta information with read time
 * @param date - Date string, Date object, or timestamp
 * @param readTime - Optional read time string
 * @returns Formatted date string with optional read time
 */
export const formatBlogDate = (date: string | Date | number, readTime?: string): string => {
  const formattedDate = formatDate(date);
  return readTime ? `${formattedDate} • ${readTime}` : formattedDate;
};
