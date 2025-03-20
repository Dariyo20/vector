// controllers/videoController.js
const cloudinary = require('../config/cloudinary');
const VideoResponse = require('../models/VideoResponse');
const Interview = require('../models/Interview');

// @desc    Get cloudinary signature for direct frontend upload
// @route   GET /api/videos/signature
// @access  Private
exports.getSignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Generate signature
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: 'video_interviews',
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
    }, process.env.CLOUDINARY_API_SECRET);
    
    res.status(200).json({
      success: true,
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({
      success: false,
      error: 'Error generating upload signature'
    });
  }
};

// @desc    Save video metadata after upload
// @route   POST /api/videos
// @access  Private
exports.saveVideo = async (req, res) => {
  try {
    const { 
      interview, 
      question, 
      questionIndex, 
      videoUrl, 
      cloudinaryId, 
      duration, 
      size 
    } = req.body;
    
    // Verify the interview exists and user has access
    const interviewDoc = await Interview.findById(interview);
    
    if (!interviewDoc) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }
    
    // Create video entry
    const videoResponse = await VideoResponse.create({
      interview,
      question,
      questionIndex,
      videoUrl,
      cloudinaryId,
      duration,
      size,
      user: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: videoResponse
    });
  } catch (error) {
    console.error('Error saving video:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all video responses for an interview
// @route   GET /api/videos/interview/:interviewId
// @access  Private
exports.getVideoResponsesByInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    // Verify the interview exists and user has access
    const interview = await Interview.findById(interviewId);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }
    
    // Check if user is the creator of the interview or an admin
    if (interview.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access these videos'
      });
    }
    
    // Get all video responses for this interview
    const videoResponses = await VideoResponse.find({ interview: interviewId })
      .sort({ questionIndex: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: videoResponses.length,
      data: videoResponses
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    
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

// @desc    Delete a video response
// @route   DELETE /api/videos/:id
// @access  Private
exports.deleteVideo = async (req, res) => {
  try {
    const video = await VideoResponse.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    // Check if user is the creator of the video or an admin
    if (video.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this video'
      });
    }
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(video.cloudinaryId, { resource_type: 'video' });
    
    // Delete from database
    await video.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};