const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  originalImage: {
    data: Buffer,
    contentType: String
  },
  processedText: String,
  confidence: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reading', ReadingSchema);