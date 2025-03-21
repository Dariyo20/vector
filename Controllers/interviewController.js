const Interview = require('../models/Interview');

// @desc    Create a new interview
// @route   POST /api/interviews
// @access  Private
exports.createInterview = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    
    // Create interview with current user as creator
    const interview = await Interview.create({
      title,
      description,
      questions,
      creator: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (error) {
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

// @desc    Get all interviews (for current user) with pagination
// @route   GET /api/interviews
// @access  Private
exports.getInterviews = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Query to find interviews for current user
    const query = { creator: req.user.id };
    
    // Get total count of interviews
    const total = await Interview.countDocuments(query);
    
    // Find interviews with pagination
    const interviews = await Interview.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by most recent first
    
    // Pagination result
    const pagination = {};
    
    // Add next page if available
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    // Add previous page if available
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: interviews.length,
      pagination: {
        ...pagination,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      },
      data: interviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
// @access  Private
exports.getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({
        success: false, 
        error: 'Interview not found'
      });
    }
    
    // Check if user is the creator of the interview
    if (interview.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this interview'
      });
    }
    
    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
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

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private
exports.updateInterview = async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }
    
    // Check if user is the creator of the interview
    if (interview.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this interview'
      });
    }
    
    interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
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
        error: 'Interview not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }
    
    // Check if user is the creator of the interview
    if (interview.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this interview'
      });
    }
    
    await interview.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
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