const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    questions: {
      type: [String],
      required: [true, 'At least one question is required'],
      validate: {
        validator: function(v) {
          return v.length > 0;
        },
        message: 'Interview must have at least one question'
      }
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', InterviewSchema);