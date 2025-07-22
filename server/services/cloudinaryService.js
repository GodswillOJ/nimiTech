const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate Cloudinary configuration
const validateCloudinaryConfig = () => {
  const requiredVars = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('❌ Missing Cloudinary environment variables:', missingVars);
    console.error('📝 Please add the following to your .env file:');
    missingVars.forEach(varName => {
      console.error(`   ${varName}=your_${varName.toLowerCase()}_here`);
    });
    console.error('🔗 Get your credentials from: https://console.cloudinary.com/');
    return false;
  }

  console.log('✅ Cloudinary configuration validated successfully');
  return true;
};

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    // Simple API test to verify credentials
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection test successful:', result.status);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection test failed:');
    console.error('   Error:', error.message);
    if (error.http_code === 401) {
      console.error('   🔑 This indicates invalid API credentials.');
      console.error('   📋 Please verify your Cloudinary credentials:');
      console.error('      - Cloud Name should match your Cloudinary dashboard');
      console.error('      - API Key and API Secret must be from the same account');
      console.error('      - Check for any extra spaces or special characters');
    }
    return false;
  }
};

// Validate configuration on startup
if (validateCloudinaryConfig()) {
  // Test connection if config is valid
  testCloudinaryConnection();
}

/**
 * Cloudinary File Storage Service
 * Provides cloud upload, retrieval, transformation, and deletion capabilities
 * Maintains backwards compatibility with existing controller patterns
 */
class CloudinaryService {
  constructor() {
    // Storage configurations for different file types
    this.storageConfig = {
      blog: {
        folder: 'nimitech/blog',
        resource_type: 'image',
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        maxSize: 10 * 1024 * 1024, // 10MB
        subfolders: {
          featured: 'featured',
          content: 'content',
          avatar: 'avatars'
        }
      },
      documents: {
        folder: 'nimitech/documents',
        resource_type: 'raw', // For PDFs and documents
        allowedTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        maxSize: 5 * 1024 * 1024, // 5MB
        subfolders: {
          resume: 'resume',
          coverLetter: 'coverLetter'
        }
      },
      general: {
        folder: 'nimitech/general',
        resource_type: 'auto', // Auto-detect resource type
        maxSize: 20 * 1024 * 1024, // 20MB
        allowedTypes: ['*'] // Allow all types for general storage
      }
    };
  }

  /**
   * Generate secure public ID with timestamp and random string
   */
  generateSecurePublicId(originalName, prefix = '', subfolder = '') {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const baseName = originalName
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 20);

    const parts = [prefix, baseName, timestamp, randomString].filter(Boolean);
    const publicId = parts.join('_');
    
    return subfolder ? `${subfolder}/${publicId}` : publicId;
  }

  /**
   * Validate file type and size
   */
  validateFile(file, storageType) {
    const config = this.storageConfig[storageType];
    if (!config) {
      throw new Error('Invalid storage type');
    }

    // Check file size
    if (file.size > config.maxSize) {
      throw new Error(`File size exceeds limit of ${config.maxSize / (1024 * 1024)}MB`);
    }

    // Check file type
    if (config.allowedTypes[0] !== '*' && !config.allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} not allowed`);
    }

    return true;
  }

  /**
   * Upload file to Cloudinary with optional transformations
   */
  async uploadFile(file, options = {}) {
    try {
      // Check if Cloudinary is properly configured
      if (!validateCloudinaryConfig()) {
        throw new Error('Cloudinary is not properly configured. Please check your environment variables.');
      }

      const {
        storageType = 'general',
        subfolder = '',
        prefix = '',
        transformations = {}
      } = options;

      // Validate file
      this.validateFile(file, storageType);

      const config = this.storageConfig[storageType];
      const publicId = this.generateSecurePublicId(file.originalname, prefix, subfolder);
      
      // Determine folder path
      let folder = config.folder;
      if (subfolder && config.subfolders && config.subfolders[subfolder]) {
        folder = `${folder}/${config.subfolders[subfolder]}`;
      } else if (subfolder) {
        folder = `${folder}/${subfolder}`;
      }

      // Prepare upload options
      const uploadOptions = {
        public_id: publicId,
        folder: folder,
        resource_type: config.resource_type,
        use_filename: false,
        unique_filename: false,
        overwrite: false,
        ...transformations
      };

      // Handle image-specific transformations
      if (config.resource_type === 'image' && Object.keys(transformations).length > 0) {
        if (transformations.resize) {
          uploadOptions.width = transformations.resize.width;
          uploadOptions.height = transformations.resize.height;
          uploadOptions.crop = transformations.resize.fit || 'fill';
        }
        if (transformations.quality) {
          uploadOptions.quality = transformations.quality;
        }
        if (transformations.format) {
          uploadOptions.format = transformations.format;
        }
      }

      // Validate file buffer
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error('File buffer is empty or undefined');
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        // Handle upload stream errors
        uploadStream.on('error', (error) => {
          console.error('Upload stream error:', error);
          reject(error);
        });

        try {
          // Convert buffer to stream and pipe to Cloudinary
          const readStream = streamifier.createReadStream(file.buffer);
          readStream.on('error', (error) => {
            console.error('Read stream error:', error);
            reject(error);
          });
          readStream.pipe(uploadStream);
        } catch (streamError) {
          console.error('Stream creation error:', streamError);
          reject(streamError);
        }
      });

      return {
        success: true,
        filename: `${publicId}.${result.format || 'bin'}`, // For backwards compatibility
        url: result.secure_url,
        public_id: result.public_id,
        path: result.public_id, // Use public_id as path for Cloudinary
        size: result.bytes,
        mimetype: file.mimetype,
        originalname: file.originalname,
        cloudinary_data: {
          asset_id: result.asset_id,
          version: result.version,
          format: result.format,
          resource_type: result.resource_type,
          created_at: result.created_at
        }
      };

    } catch (error) {
      // Handle specific Cloudinary errors
      if (error.http_code === 401 && error.message.includes('Invalid Signature')) {
        console.error('🔐 Cloudinary Authentication Error Details:');
        console.error('   - Error Code:', error.http_code);
        console.error('   - Message:', error.message);
        console.error('   - This usually means:');
        console.error('     1. API Secret is incorrect');
        console.error('     2. Cloud Name doesn\'t match the API credentials');
        console.error('     3. Credentials are from different Cloudinary accounts');
        console.error('   - Solution: Double-check your Cloudinary dashboard credentials');
        throw new Error('Cloudinary authentication failed. Please verify your API credentials match your Cloudinary account.');
      }
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  /**
   * Get file information from Cloudinary
   */
  async getFileInfo(publicId, storageType = 'general') {
    try {
      const config = this.storageConfig[storageType];
      
      const result = await cloudinary.api.resource(publicId, {
        resource_type: config.resource_type
      });

      return {
        filename: `${publicId}.${result.format || 'bin'}`,
        url: result.secure_url,
        path: result.public_id,
        public_id: result.public_id,
        size: result.bytes,
        createdAt: new Date(result.created_at),
        modifiedAt: new Date(result.created_at),
        exists: true,
        cloudinary_data: {
          asset_id: result.asset_id,
          version: result.version,
          format: result.format,
          resource_type: result.resource_type
        }
      };

    } catch (error) {
      if (error.http_code === 404) {
        return null; // File not found
      }
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  }

  /**
   * Delete file from Cloudinary
   */
  async deleteFile(publicId, storageType = 'general') {
    try {
      const config = this.storageConfig[storageType];
      
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: config.resource_type
      });

      if (result.result === 'ok') {
        return { success: true, message: 'File deleted successfully' };
      } else if (result.result === 'not found') {
        return { success: false, message: 'File not found' };
      } else {
        return { success: false, message: 'Failed to delete file' };
      }

    } catch (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  /**
   * Generate different image sizes for responsive images
   */
  async generateResponsiveImages(file, options = {}) {
    const {
      storageType = 'blog',
      subfolder = 'content',
      sizes = [
        { name: 'thumbnail', width: 150, height: 150 },
        { name: 'small', width: 400, height: 300 },
        { name: 'medium', width: 800, height: 600 },
        { name: 'large', width: 1200, height: 900 }
      ]
    } = options;

    const results = {};
    const baseFilename = file.originalname.replace(/\.[^/.]+$/, '');

    for (const size of sizes) {
      const transformations = {
        resize: { width: size.width, height: size.height, fit: 'fill' },
        quality: 'auto',
        format: 'auto'
      };

      const sizeOptions = {
        storageType,
        subfolder,
        prefix: `${baseFilename}_${size.name}`,
        transformations
      };

      results[size.name] = await this.uploadFile(file, sizeOptions);
    }

    return results;
  }

  /**
   * Get URL for file (backwards compatibility)
   * For Cloudinary, we can extract public_id from filename
   */
  async getImageUrl(filename, storageType = 'blog', subfolder = 'featured') {
    try {
      // Extract public_id from filename (remove extension)
      const publicId = filename.replace(/\.[^/.]+$/, '');
      const fileInfo = await this.getFileInfo(publicId, storageType);
      return fileInfo ? fileInfo.url : null;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  }

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedImageUrl(publicId, transformations = {}) {
    const {
      width,
      height,
      crop = 'fill',
      quality = 'auto',
      format = 'auto'
    } = transformations;

    return cloudinary.url(publicId, {
      width,
      height,
      crop,
      quality,
      format,
      secure: true
    });
  }

  /**
   * Cleanup old files (utility function)
   * Note: Cloudinary has built-in auto-cleanup features, but this provides manual control
   */
  async cleanupOldFiles(storageType = 'general', daysOld = 30) {
    try {
      const config = this.storageConfig[storageType];
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      // Get list of resources older than cutoff date
      const result = await cloudinary.api.resources({
        type: 'upload',
        resource_type: config.resource_type,
        prefix: config.folder,
        max_results: 500,
        created_at: { lte: cutoffDate.toISOString() }
      });

      let deletedCount = 0;
      
      // Delete old resources
      for (const resource of result.resources) {
        try {
          await cloudinary.uploader.destroy(resource.public_id, {
            resource_type: config.resource_type
          });
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete ${resource.public_id}:`, error);
        }
      }

      return { success: true, deletedCount, message: `Cleaned up ${deletedCount} old files` };

    } catch (error) {
      throw new Error(`Cleanup failed: ${error.message}`);
    }
  }

  /**
   * Get folder usage statistics
   */
  async getStorageStats(storageType = 'general') {
    try {
      const config = this.storageConfig[storageType];
      
      const result = await cloudinary.api.resources({
        type: 'upload',
        resource_type: config.resource_type,
        prefix: config.folder,
        max_results: 500
      });

      const totalSize = result.resources.reduce((sum, resource) => sum + resource.bytes, 0);
      const totalFiles = result.resources.length;

      return {
        success: true,
        stats: {
          totalFiles,
          totalSize,
          totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
          folder: config.folder,
          resourceType: config.resource_type
        }
      };

    } catch (error) {
      throw new Error(`Failed to get storage stats: ${error.message}`);
    }
  }
}

// Create singleton instance
const cloudinaryService = new CloudinaryService();

module.exports = cloudinaryService;
