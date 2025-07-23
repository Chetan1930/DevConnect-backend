const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'your_folder_name', // optional
    allowed_formats: ['jpeg', 'png', 'jpg', 'heic'],
  },
});

const parser = multer({ storage });

module.exports = parser;
