const ReadingModel = require("../models/reading.model");
const OCRService = require("../services/ocr.service");
const fs = require("fs").promises;
const sharp = require("sharp");
const logger = require("../utils/logger");

class ImageController {
  constructor() {
    this.ocrService = new OCRService();
  }

  async processImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      logger.info(`Processing image: ${req.file.filename}`);

      // Basic image optimization with sharp
      const optimizedPath = `${req.file.path}_optimized.jpg`;
      await sharp(req.file.path)
        .resize(1800, 2400, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .sharpen()
        .normalize()
        .jpeg({ quality: 85 })
        .toFile(optimizedPath);

      // Perform OCR
      const ocrResult = await this.ocrService.performOCR(optimizedPath);

      // Save to database
      const reading = new ReadingModel({
        originalImage: {
          data: await fs.readFile(req.file.path),
          contentType: "image/jpeg",
        },
        processedText: ocrResult.text,
        confidence: ocrResult.confidence,
        details: ocrResult.details, // Optional: store additional details if needed
      });
      await reading.save();

      // Clean up temporary files
      await Promise.all([
        fs
          .unlink(req.file.path)
          .catch((err) => logger.error("Error deleting original file:", err)),
        fs
          .unlink(optimizedPath)
          .catch((err) => logger.error("Error deleting optimized file:", err)),
      ]);

      // Send response
      res.json({
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        ...(process.env.NODE_ENV === "development" && {
          details: ocrResult.details,
        }),
      });
    } catch (error) {
      logger.error("Error processing image:", error);
      res.status(500).json({
        error: "Image processing failed",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }

  async getReadings(req, res) {
    try {
      const readings = await ReadingModel.find()
        .select("-originalImage")
        .sort({ createdAt: -1 })
        .limit(10);
      res.json(readings);
    } catch (error) {
      logger.error("Error fetching readings:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ImageController;
