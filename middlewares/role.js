const config = require('../config/default');

// Role-based authorization middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'User role not found',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    
    next();
  };
};

// Helper middleware for specific roles
exports.isInterviewer = (req, res, next) => {
  if (req.user.role !== config.roles.INTERVIEWER) {
    return res.status(403).json({
      success: false,
      message: 'Only interviewers can access this resource',
    });
  }
  next();
};

exports.isApplicant = (req, res, next) => {
  if (req.user.role !== config.roles.APPLICANT) {
    return res.status(403).json({
      success: false,
      message: 'Only applicants can access this resource',
    });
  }
  next();
};