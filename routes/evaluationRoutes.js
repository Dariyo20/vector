const express = require('express');
const { check } = require('express-validator');
const { 
  createEvaluation, 
  getEvaluationsByVideo, 
  getEvaluationsByInterview, 
  updateEvaluation, 
  deleteEvaluation,
  getInterviewStats
} = require('../controllers/evaluationController');

// Import middleware
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create a new evaluation
router.post(
  '/',
  [
    protect,
    [
      check('videoResponse', 'Video response ID is required').not().isEmpty(),
      check('score', 'Score is required and must be between 1 and 10').isInt({ min: 1, max: 10 }),
      check('comments', 'Comments are required').not().isEmpty().trim()
    ]
  ],
  createEvaluation
);

// Get all evaluations for a video response
router.get('/video/:videoResponseId', protect, getEvaluationsByVideo);

// Get all evaluations for an interview
router.get('/interview/:interviewId', protect, getEvaluationsByInterview);

// Get evaluation statistics for an interview
router.get('/stats/interview/:interviewId', protect, getInterviewStats);

// Update an evaluation
router.put(
  '/:id',
  [
    protect,
    [
      check('score', 'Score is required and must be between 1 and 10').isInt({ min: 1, max: 10 }),
      check('comments', 'Comments are required').not().isEmpty().trim()
    ]
  ],
  updateEvaluation
);

// Delete an evaluation
router.delete('/:id', protect, deleteEvaluation);

module.exports = router;