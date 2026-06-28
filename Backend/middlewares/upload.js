const multer = require('multer');
const path = require('path');
const fs = require('fs');

// If Cloudinary URL is set, use cloud storage; otherwise local disk storage
const useCloudinary = !!process.env.CLOUDINARY_URL;

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

let upload;

if (useCloudinary) {
  // Use multer-storage-cloudinary
  const { v2: cloudinary } = require('cloudinary');
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'bookstore/covers',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, crop: 'limit' }]
    }
  });

  upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 8 } // 8MB
  });
} else {
  // Ensure uploads folder exists
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
  });
}

module.exports = upload;
