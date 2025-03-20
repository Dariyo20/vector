const { validationResult } = require('express-validator');
const Evaluation = require('../models/Evaluation');
const VideoResponse = require('../models/VideoResponse');
const Interview = require('../models/Interview');

/**
 * @desc    Create a new evaluation
 * @route   POST /api/evaluations
 * @access  Private (Evaluator/Admin only)
 */
exports.createEvaluation = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { videoResponse, score, comments } = req.body;
    
    // Verify the video response exists
    const videoResponseDoc = await VideoResponse.findById(videoResponse);
    
    if (!videoResponseDoc) {
      return res.status(404).json({
        success: false,
        error: 'Video response not found'
      });
    }
    
    // Check if user has permission to evaluate this video
    // First, get the associated interview
    const interview = await Interview.findById(videoResponseDoc.interview);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Associated interview not found'
      });
    }
    
    // Verify user is an evaluator or admin
    if (req.user.role !== 'evaluator' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to submit evaluations'
      });
    }
    
    // Check if user already evaluated this video response
    const existingEvaluation = await Evaluation.findOne({
      videoResponse,
      evaluator: req.user.id
    });
    
    if (existingEvaluation) {
      return res.status(400).json({
        success: false,
        error: 'You have already evaluated this video response'
      });
    }
    
    // Create evaluation
    const evaluation = await Evaluation.create({
      videoResponse,
      evaluator: req.user.id,
      score,
      comments
    });
    
    res.status(201).json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    console.error('Error creating evaluation:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'You have already evaluated this video response'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Get all evaluations for a video response
 * @route   GET /api/evaluations/video/:videoResponseId
 * @access  Private
 */
exports.getEvaluationsByVideo = async (req, res) => {
  try {
    const { videoResponseId } = req.params;
    
    // Verify the video response exists
    const videoResponse = await VideoResponse.findById(videoResponseId);
    
    if (!videoResponse) {
      return res.status(404).json({
        success: false,
        error: 'Video response not found'
      });
    }
    
    // Get associated interview
    const interview = await Interview.findById(videoResponse.interview);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Associated interview not found'
      });
    }
    
    // Check authorization: Only allow access to:
    // 1. The video creator (applicant)
    // 2. The interview creator (interviewer)
    // 3. Evaluators assigned to this interview
    // 4. Admins
    const isAuthorized = 
      videoResponse.user.toString() === req.user.id || 
      interview.creator.toString() === req.user.id || 
      req.user.role === 'evaluator' || 
      req.user.role === 'admin';
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access these evaluations'
      });
    }
    
    // Get all evaluations for this video response with evaluator details
    const evaluations = await Evaluation.find({ videoResponse: videoResponseId })
      .populate('evaluator', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations
    });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Video response not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Get all evaluations for an interview (across all video responses)
 * @route   GET /api/evaluations/interview/:interviewId
 * @access  Private
 */
exports.getEvaluationsByInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    // Verify the interview exists
    const interview = await Interview.findById(interviewId);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }
    
    // Check if user is the creator of the interview or an admin
    const isAuthorized = 
      interview.creator.toString() === req.user.id || 
      req.user.role === 'evaluator' || 
      req.user.role === 'admin';
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access these evaluations'
      });
    }
    
    // Get all video responses for this interview
    const videoResponses = await VideoResponse.find({ interview: interviewId });
    
    // Get all evaluations for these video responses
    const videoResponseIds = videoResponses.map(video => video._id);
    
    const evaluations = await Evaluation.find({ 
      videoResponse: { $in: videoResponseIds } 
    })
      .populate('evaluator', 'name email')
      .populate({
        path: 'videoResponse',
        select: 'question questionIndex user',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations
    });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Update an evaluation
 * @route   PUT /api/evaluations/:id
 * @access  Private (Evaluator/Admin only)
 */
exports.updateEvaluation = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { score, comments } = req.body;
    
    let evaluation = await Evaluation.findById(req.params.id);
    
    if (!evaluation) {
      return res.status(404).json({
        success: false,
        error: 'Evaluation not found'
      });
    }
    
    // Check if user is the creator of the evaluation or an admin
    if (evaluation.evaluator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this evaluation'
      });
    }
    
    // Update evaluation
    evaluation = await Evaluation.findByIdAndUpdate(
      req.params.id,
      { score, comments, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    console.error('Error updating evaluation:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Evaluation not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Delete an evaluation
 * @route   DELETE /api/evaluations/:id
 * @access  Private (Evaluator/Admin only)
 */
exports.deleteEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    
    if (!evaluation) {
      return res.status(404).json({
        success: false,
        error: 'Evaluation not found'
      });
    }
    
    // Check if user is the creator of the evaluation or an admin
    if (evaluation.evaluator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this evaluation'
      });
    }
    
    // Delete evaluation
    await evaluation.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Evaluation not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

/**
 * @desc    Get evaluation statistics for an interview
 * @route   GET /api/evaluations/stats/interview/:interviewId
 * @access  Private
 */
exports.getInterviewStats = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    // Verify the interview exists
    const interview = await Interview.findById(interviewId);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }
    
    // Check if user is the creator of the interview or an admin
    const isAuthorized = 
      interview.creator.toString() === req.user.id || 
      req.user.role === 'evaluator' || 
      req.user.role === 'admin';
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access these statistics'
      });
    }
    
    // Get all video responses for this interview
    const videoResponses = await VideoResponse.find({ interview: interviewId });
    const videoResponseIds = videoResponses.map(video => video._id);
    
    // Aggregate statistics
    const stats = await Evaluation.aggregate([
      {
        $match: { videoResponse: { $in: videoResponseIds } }
      },
      {
        $group: {
          _id: '$videoResponse',
          averageScore: { $avg: '$score' },
          minScore: { $min: '$score' },
          maxScore: { $max: '$score' },
          evaluationCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'videoresponses',
          localField: '_id',
          foreignField: '_id',
          as: 'videoDetails'
        }
      },
      {
        $unwind: '$videoDetails'
      },
      {
        $project: {
          _id: 1,
          question: '$videoDetails.question',
          questionIndex: '$videoDetails.questionIndex',
          userId: '$videoDetails.user',
          averageScore: 1,
          minScore: 1,
          maxScore: 1,
          evaluationCount: 1
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: 1,
          question: 1,
          questionIndex: 1,
          applicant: {
            _id: '$userDetails._id',
            name: '$userDetails.name',
            email: '$userDetails.email'
          },
          averageScore: { $round: ['$averageScore', 1] },
          minScore: 1,
          maxScore: 1,
          evaluationCount: 1
        }
      },
      {
        $sort: { 'applicant.name': 1, questionIndex: 1 }
      }
    ]);
    
    // Calculate overall stats
    let overallStats = {
      totalEvaluations: 0,
      averageScore: 0,
      videoResponsesEvaluated: 0,
      totalVideoResponses: videoResponses.length
    };
    
    if (stats.length > 0) {
      const totalScores = stats.reduce((acc, curr) => {
        return acc + (curr.averageScore * curr.evaluationCount);
      }, 0);
      
      const totalEvaluations = stats.reduce((acc, curr) => {
        return acc + curr.evaluationCount;
      }, 0);
      
      overallStats.totalEvaluations = totalEvaluations;
      overallStats.averageScore = parseFloat((totalScores / totalEvaluations).toFixed(1));
      overallStats.videoResponsesEvaluated = stats.length;
    }
    
    res.status(200).json({
      success: true,
      overallStats,
      videoResponseStats: stats
    });
  } catch (error) {
    console.error('Error fetching evaluation statistics:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};