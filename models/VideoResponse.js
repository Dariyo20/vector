const mongoose = require('mongoose');

const VideoResponseSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true
    },
    question: {
      type: String,
      required: true
    },
    questionIndex: {
      type: Number,
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    cloudinaryId: {
      type: String,
      required: true
    },
    duration: {
      type: Number,  // Duration in seconds
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    size: {
      type: Number,  // Size in bytes
      required: true
    },
    status: {
      type: String,
      enum: ['processing', 'ready', 'error'],
      default: 'ready'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('VideoResponse', VideoResponseSchema);