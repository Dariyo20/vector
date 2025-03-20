const mongoose = require('mongoose');

const EvaluationSchema = new mongoose.Schema({
  videoResponse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VideoResponse',
    required: [true, 'Video response ID is required']
  },
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Evaluator ID is required']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [1, 'Score must be at least 1'],
    max: [10, 'Score cannot exceed 10']
  },
  comments: {
    type: String,
    required: [true, 'Comments are required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent multiple evaluations by the same evaluator for the same video response
EvaluationSchema.index({ videoResponse: 1, evaluator: 1 }, { unique: true });

// Pre-save middleware to update the updatedAt field when modified
EvaluationSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);