// services/ocr.service.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const logger = require('../utils/logger');

class OCRService {
  constructor() {
    this.apiKey = process.env.OCR_SPACE_API_KEY;
    this.apiUrl = 'https://api.ocr.space/parse/image';
  }

  async performOCR(imagePath) {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(imagePath));
      
      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          'apikey': this.apiKey,
          ...formData.getHeaders(),
        },
        params: {
          language: 'eng',
          isOverlayRequired: true, // Changed to true to get word-level data
          detectOrientation: true,
          scale: true,
          OCREngine: '2', // More accurate engine
        },
      });

      if (response.data.OCRExitCode === 1) {
        const parsedResult = response.data.ParsedResults[0];
        const text = parsedResult.ParsedText;
        
        // Calculate average confidence from all words
        let totalConfidence = 0;
        let wordCount = 0;

        if (parsedResult.TextOverlay && parsedResult.TextOverlay.Lines) {
          parsedResult.TextOverlay.Lines.forEach(line => {
            if (line.Words) {
              line.Words.forEach(word => {
                if (word.WordConf) {
                  totalConfidence += parseFloat(word.WordConf);
                  wordCount++;
                }
              });
            }
          });
        }

        // Calculate average confidence
        const confidence = wordCount > 0 ? (totalConfidence / wordCount) : 0;

        logger.info(`OCR Processing completed. Text length: ${text.length}, Average confidence: ${confidence}`);

        // Log detailed confidence information in development
        if (process.env.NODE_ENV === 'development') {
          logger.debug('OCR Details:', {
            wordCount,
            totalConfidence,
            averageConfidence: confidence,
            firstFewWords: parsedResult.TextOverlay?.Lines?.[0]?.Words?.slice(0, 3)
          });
        }

        return {
          text,
          confidence: parseFloat(confidence.toFixed(2)),
          details: process.env.NODE_ENV === 'development' ? {
            wordCount,
            averageConfidence: confidence,
            ocrEngine: '2',
            processingTimeMs: response.data.ProcessingTimeInMilliseconds
          } : undefined
        };
      } else {
        const error = new Error('OCR processing failed');
        error.details = response.data;
        throw error;
      }
    } catch (error) {
      logger.error('OCR Processing Error:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }
}

module.exports = OCRService;