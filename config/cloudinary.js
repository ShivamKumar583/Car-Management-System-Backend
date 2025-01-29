const cloudinary = require('cloudinary').v2; // Correct import for Cloudinary v2

// Initialize Cloudinary configuration
exports.cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  } catch (error) {
    console.log('Error connecting to Cloudinary:', error);
  }
};


exports.uploadImagesToCloudinary = async (files) => {
  console.log('Uploading files:', files);

  const imageUrls = [];
  try {
    // Ensure files exist
    if (!files || files.length === 0) {
      return ({ success: false, message: 'No files provided for upload' });
    }

    // Loop through each file and upload to Cloudinary
    for (let file of files) {
      if (!file.buffer) {
        throw new Error('File buffer not found');
      }

      // Upload file buffer to Cloudinary
      const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
        resource_type: 'auto', // Auto-detect file type
      });

      imageUrls.push(result.secure_url); // Store the secure URL
    }
  } catch (error) {
    console.error('Error in uploading images:', error);
    throw error;
  }

  console.log('Uploaded image URLs:', imageUrls);
  return imageUrls;
};
