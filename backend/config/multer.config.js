// config/multer.config.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and random number
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // OCR.space supported formats
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/tiff",
    "image/bmp",
    "image/gif",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, TIFF, BMP, and GIF images are allowed."
      ),
      false
    );
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024, // 1MB - OCR.space free API limit
    files: 1, // Only allow one file upload at a time
  },
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error:
          "File too large. Maximum upload size is 1MB due to OCR.space free API limits.",
      });
    }
    return res.status(400).json({
      error: "File upload error: " + err.message,
    });
  } else if (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
  next();
};

module.exports = {
  upload,
  handleMulterError,
};
