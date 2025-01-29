const multer = require('multer');

// Setup multer storage for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
