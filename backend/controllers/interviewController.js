const Interview = require('../models/Interview');

// ==================================================
// CREATE INTERVIEW
// ==================================================

const createInterview = async (req, res) => {
  try {

    const {
      title,
      jobRole,
      experience,
      difficulty,
      interviewType,
      numberOfQuestions,
      duration
    } = req.body;

    if (
      !title ||
      !jobRole ||
      !experience ||
      !difficulty ||
      !interviewType ||
      !numberOfQuestions ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message: 'All interview fields are required'
      });
    }

    const interview = await Interview.create({
      userId: req.user.id,

      title: title.trim(),

      jobRole: jobRole.trim(),

      experience,

      difficulty,

      interviewType,

      numberOfQuestions:
        Number(numberOfQuestions),

      duration:
        Number(duration),

      status: 'Not Started',

      completedAt: null
    });

    res.status(201).json({
      success: true,
      message: 'Interview created successfully',
      interview
    });

  } catch (error) {

    console.error(
      'Create interview error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to create interview'
    });
  }
};


// ==================================================
// GET MY INTERVIEWS
// ==================================================

const getMyInterviews = async (req, res) => {
  try {

    const interviews = await Interview
      .find({
        userId: req.user.id
      })
      .sort({
        createdAt: -1
      });

    res.json({
      success: true,
      interviews
    });

  } catch (error) {

    console.error(
      'Get interviews error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to fetch interviews'
    });
  }
};


// ==================================================
// GET SINGLE INTERVIEW
// ==================================================

const getInterviewById = async (req, res) => {
  try {

    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.json({
      success: true,
      interview
    });

  } catch (error) {

    console.error(
      'Get interview error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview'
    });
  }
};


// ==================================================
// DELETE INTERVIEW
// ==================================================

const deleteInterview = async (req, res) => {
  try {

    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Result controller/model मधून delete करणार नाही.
    // route मध्ये result delete separately करू.

    res.json({
      success: true,
      message: 'Interview deleted successfully'
    });

  } catch (error) {

    console.error(
      'Delete interview error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to delete interview'
    });
  }
};


module.exports = {
  createInterview,
  getMyInterviews,
  getInterviewById,
  deleteInterview
};