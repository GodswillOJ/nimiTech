const cloudinaryService = require('../services/cloudinaryService');

/**
 * Get image URL from Cloudinary
 * @param {string} filename - The filename or public_id of the image
 * @param {string} storageType - The storage type (default: 'blog')
 * @param {string} subfolder - The subfolder (default: 'featured')
 * @returns {Promise<string|null>} - The image URL or null if not found
 */
async function getImageUrl(filename, storageType = 'blog', subfolder = 'featured') {
  try {
    if (!filename) return null;
    
    // Use cloudinary service to get the image URL
    const imageUrl = await cloudinaryService.getImageUrl(filename, storageType, subfolder);
    return imageUrl;
  } catch (error) {
    console.error('Error getting image URL:', error);
    return null;
  }
}

/**
 * Get base URL for the application
 * @returns {string} - The base URL
 */
function getBaseUrl() {
  return process.env.BASE_URL || 'http://localhost:3000';
}

/**
 * Get frontend URL
 * @returns {string} - The frontend URL
 */
function getFrontendUrl() {
  return process.env.FRONTEND_URL || 'http://localhost:3000';
}

module.exports = {
  getImageUrl,
  getBaseUrl,
  getFrontendUrl
};
