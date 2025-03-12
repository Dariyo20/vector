const express = require('express');
const router = express.Router();
const { 
  createInterview, 
  getInterviews, 
  getInterview, 
  updateInterview, 
  deleteInterview 
} = require('../Controllers/interviewController');
const { auth } = require('../middlewares/auth');

// Protect all routes with authentication middleware
router.use(auth);

// Create and get all interviews
router.route('/')
  .post(createInterview)
  .get(getInterviews);

// Get, update and delete interview by ID
router.route('/:id')
  .get(getInterview)
  .put(updateInterview)
  .delete(deleteInterview);

module.exports = router;