const express = require('express');

const {
  saveResult,
  getMyResults,
  getResultById,
  deleteResultByInterview
} = require('../controllers/resultController');

const authMiddleware =
  require('../middleware/authMiddleware');

const router = express.Router();


// SAVE RESULT

router.post(
  '/',
  authMiddleware,
  saveResult
);


// GET ALL MY RESULTS

router.get(
  '/',
  authMiddleware,
  getMyResults
);


// DELETE RESULT BY INTERVIEW

router.delete(
  '/interview/:interviewId',
  authMiddleware,
  deleteResultByInterview
);


// GET SINGLE RESULT

router.get(
  '/:id',
  authMiddleware,
  getResultById
);


module.exports = router;