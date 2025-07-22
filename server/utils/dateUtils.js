/**
 * Format date for display in emails and other contexts
 * @param {Date|string} date - The date to format
 * @param {string} format - The format type ('long', 'short', 'medium')
 * @returns {string} - The formatted date string
 */
function formatDate(date, format = 'long') {
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    const options = {
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      },
      medium: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      short: {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric'
      }
    };

    return dateObj.toLocaleDateString('en-US', options[format] || options.long);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Format date and time for display
 * @param {Date|string} date - The date to format
 * @returns {string} - The formatted date and time string
 */
function formatDateTime(date) {
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid Date';
  }
}

/**
 * Get relative time string (e.g., "2 hours ago", "3 days ago")
 * @param {Date|string} date - The date to compare
 * @returns {string} - The relative time string
 */
function getRelativeTime(date) {
  try {
    const dateObj = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return formatDate(date, 'medium');
  } catch (error) {
    console.error('Error getting relative time:', error);
    return 'Invalid Date';
  }
}

module.exports = {
  formatDate,
  formatDateTime,
  getRelativeTime
};
