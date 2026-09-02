const express = require('express');

const {
  createInterview,
  getMyInterviews,
  getInterviewById,
  deleteInterview
} = require('../controllers/interviewController');

const authMiddleware =
  require('../middleware/authMiddleware');

const router = express.Router();


// CREATE
router.post(
  '/',
  authMiddleware,
  createInterview
);


// GET ALL MY INTERVIEWS
router.get(
  '/',
  authMiddleware,
  getMyInterviews
);


// GET SINGLE
router.get(
  '/:id',
  authMiddleware,
  getInterviewById
);


// DELETE
router.delete(
  '/:id',
  authMiddleware,
  deleteInterview
);


module.exports = router;