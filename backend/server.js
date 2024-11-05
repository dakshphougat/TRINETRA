const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db.config");
const { upload, handleMulterError } = require("./config/multer.config");
const ImageController = require("./controllers/image.controller");
const logger = require("./utils/logger");

// Load environment variables
dotenv.config();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Initialize Express app
const app = express();

// Initialize ImageController
const imageController = new ImageController();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream: logger.stream }));

// Connect to MongoDB
connectDB()
  .then(() => {
    logger.info("MongoDB connected successfully");
  })
  .catch((err) => {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Image processing route
app.post(
  "/api/process-image",
  upload.single("image"), // Handle single file upload
  handleMulterError, // Handle multer errors
  async (req, res) => {
    console.log('processImage route hit');
    try {
      await imageController.processImage(req, res);
    } catch (error) {
      logger.error("Error in image processing route:", error);
      res.status(500).json({
        error: "Image processing failed",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

// Get all readings route
app.get("/api/readings", async (req, res) => {
  try {
    await imageController.getReadings(req, res);
  } catch (error) {
    logger.error("Error in get readings route:", error);
    res.status(500).json({
      error: "Failed to fetch readings",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Serve static files from uploads directory
//if (process.env.NODE_ENV !== 'production') {
app.use("/uploads", express.static("uploads"));
//}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Unhandled error:", err);
  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// Start server with error handling
const startServer = async () => {
  const PORT = process.env.PORT || 3001;

  try {
    const server = app.listen(PORT, () => {
      logger.info(
        `Server running on port ${PORT} in ${
          process.env.NODE_ENV || "development"
        } mode`
      );
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        logger.error(`Port ${PORT} is already in use`);
        const newPort = PORT + 1;
        logger.info(`Attempting to use port ${newPort}`);
        server.listen(newPort);
      } else {
        logger.error("Server error:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Promise Rejection:", err);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
});

module.exports = app; // Export for testing purposes
