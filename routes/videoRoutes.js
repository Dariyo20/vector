// routes/videoRoutes.js
const express = require('express');
const {auth } = require('../middlewares/auth');
const {
  getSignature,
  saveVideo,
  getVideoResponsesByInterview,
  deleteVideo
} = require('../controllers/videoController');

const router = express.Router();

router.get('/signature', auth, getSignature);
router.post('/', auth, saveVideo);
router.get('/interview/:interviewId', auth, getVideoResponsesByInterview);
router.delete('/:id', auth, deleteVideo);

module.exports = router;