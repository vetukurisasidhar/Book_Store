const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Ensure Cloudinary configuration is loaded
cloudinary.config();

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure Cloudinary storage directly.
// This is the sole storage engine now. Local disk fallback is removed.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bookstore/covers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }]
  }
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 8 } // 8MB limit
});

module.exports = upload;
