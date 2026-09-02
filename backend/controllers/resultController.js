const Result = require('../models/Result');
const Interview = require('../models/Interview');


// ==================================================
// ANSWER CHECKER
// ==================================================

const checkAnswer = (
  userAnswer,
  correctAnswer
) => {

  const userText =
    (userAnswer || '')
      .toLowerCase()
      .trim();

  const correctText =
    (correctAnswer || '')
      .toLowerCase()
      .trim();

  if (!userText || !correctText) {
    return false;
  }


  // Exact answer
  if (userText === correctText) {
    return true;
  }


  // Normalize
  const cleanUser =
    userText.replace(
      /[^a-z0-9\s]/g,
      ' '
    );

  const cleanCorrect =
    correctText.replace(
      /[^a-z0-9\s]/g,
      ' '
    );


  const correctWords =
    cleanCorrect
      .split(/\s+/)
      .filter(
        word => word.length > 3
      );


  if (!correctWords.length) {
    return false;
  }


  const matchedWords =
    correctWords.filter(
      word =>
        cleanUser.includes(word)
    );


  const percentage =
    (
      matchedWords.length /
      correctWords.length
    ) * 100;


  // At least 60% concepts required
  return percentage >= 60;
};


// ==================================================
// SAVE / UPDATE RESULT
// ==================================================

const saveResult = async (req, res) => {

  try {

    const {
      interviewId,
      questions
    } = req.body;


    // ------------------------------------------------
    // VALIDATION
    // ------------------------------------------------

    if (
      !interviewId ||
      !Array.isArray(questions)
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Interview ID and questions are required'

      });

    }


    // ------------------------------------------------
    // FIND USER INTERVIEW
    // ------------------------------------------------

    const interview =
      await Interview.findOne({

        _id:
          interviewId,

        userId:
          req.user.id

      });


    if (!interview) {

      return res.status(404).json({

        success: false,

        message:
          'Interview not found'

      });

    }


    // ------------------------------------------------
    // CHECK AND CALCULATE ANSWERS
    // ------------------------------------------------

    let answeredQuestions = 0;

    let correctAnswers = 0;

    let wrongAnswers = 0;


    const checkedQuestions =
      questions.map(
        item => {

          const userAnswer =
            (item.userAnswer || '')
              .trim();


          const correctAnswer =
            (item.correctAnswer || '')
              .trim();


          // Answered
          if (
            userAnswer.length > 0
          ) {

            answeredQuestions++;

          }


          // Check answer
          const isCorrect =
            checkAnswer(
              userAnswer,
              correctAnswer
            );


          if (isCorrect) {

            correctAnswers++;

          }

          else if (
            userAnswer.length > 0
          ) {

            wrongAnswers++;

          }


          return {

            question:
              item.question || '',

            correctAnswer,

            userAnswer,

            isCorrect

          };

        }
      );


    // ------------------------------------------------
    // TOTAL QUESTIONS
    // ------------------------------------------------

    const totalQuestions =
      checkedQuestions.length;


    // ------------------------------------------------
    // UNANSWERED
    // ------------------------------------------------

    const unansweredQuestions =
      Math.max(
        0,
        totalQuestions -
        answeredQuestions
      );


    // ------------------------------------------------
    // SCORE
    // ------------------------------------------------

    const score =
      totalQuestions > 0
        ? Math.round(
            (
              correctAnswers /
              totalQuestions
            ) * 100
          )
        : 0;


    // ==================================================
    // IMPORTANT
    // RETAKE SUPPORT
    // ==================================================

    /*
     * Find existing result for this interview.
     *
     * If result exists:
     * UPDATE it with new answers.
     *
     * If result does not exist:
     * CREATE new result.
     */

    let result =
      await Result.findOne({

        interviewId:
          interview._id,

        userId:
          req.user.id

      });


    // ==================================================
    // UPDATE EXISTING RESULT
    // ==================================================

    if (result) {

      result.questions =
        checkedQuestions;

      result.totalQuestions =
        totalQuestions;

      result.answeredQuestions =
        answeredQuestions;

      result.correctAnswers =
        correctAnswers;

      result.wrongAnswers =
        wrongAnswers;

      result.score =
        score;

      result.interviewTitle =
        interview.title;

      result.jobRole =
        interview.jobRole;

      result.completedAt =
        new Date();


      await result.save();


      // ------------------------------------------------
      // UPDATE INTERVIEW
      // ------------------------------------------------

      interview.status =
        'Completed';

      interview.completedAt =
        new Date();

      await interview.save();


      console.log(
        'Retake result UPDATED:',
        result._id
      );


      return res.status(200).json({

        success: true,

        isRetake: true,

        message:
          'Interview retake result updated successfully',

        result

      });

    }


    // ==================================================
    // CREATE NEW RESULT
    // ==================================================

    result =
      await Result.create({

        userId:
          req.user.id,

        interviewId:
          interview._id,

        interviewTitle:
          interview.title,

        jobRole:
          interview.jobRole,

        questions:
          checkedQuestions,

        totalQuestions,

        answeredQuestions,

        correctAnswers,

        wrongAnswers,

        score,

        completedAt:
          new Date()

      });


    // ------------------------------------------------
    // MARK INTERVIEW COMPLETED
    // ------------------------------------------------

    interview.status =
      'Completed';

    interview.completedAt =
      new Date();

    await interview.save();


    console.log(
      'New result CREATED:',
      result._id
    );


    return res.status(201).json({

      success: true,

      isRetake: false,

      message:
        'Interview result saved successfully',

      result

    });


  } catch (error) {

    console.error(
      'Save result error:',
      error
    );


    return res.status(500).json({

      success: false,

      message:
        'Failed to save interview result',

      error:
        error.message

    });

  }

};


// ==================================================
// GET ALL RESULTS
// ==================================================

const getMyResults = async (
  req,
  res
) => {

  try {

    const results =
      await Result
        .find({
          userId:
            req.user.id
        })
        .populate(
          'interviewId'
        )
        .sort({
          completedAt: -1
        });


    res.json({

      success: true,

      results

    });


  } catch (error) {

    console.error(
      'Get results error:',
      error
    );


    res.status(500).json({

      success: false,

      message:
        'Failed to fetch results'

    });

  }

};


// ==================================================
// GET SINGLE RESULT
// ==================================================

const getResultById = async (
  req,
  res
) => {

  try {

    const result =
      await Result
        .findOne({

          _id:
            req.params.id,

          userId:
            req.user.id

        })
        .populate(
          'interviewId'
        );


    if (!result) {

      return res.status(404).json({

        success: false,

        message:
          'Result not found'

      });

    }


    res.json({

      success: true,

      result

    });


  } catch (error) {

    console.error(
      'Get result error:',
      error
    );


    res.status(500).json({

      success: false,

      message:
        'Failed to fetch result'

    });

  }

};


// ==================================================
// DELETE RESULT
// ==================================================

const deleteResultByInterview =
  async (
    req,
    res
  ) => {

    try {

      const result =
        await Result.findOneAndDelete({

          interviewId:
            req.params.interviewId,

          userId:
            req.user.id

        });


      res.json({

        success: true,

        message:
          result
            ? 'Result deleted successfully'
            : 'No result found'

      });


    } catch (error) {

      console.error(
        'Delete result error:',
        error
      );


      res.status(500).json({

        success: false,

        message:
          'Failed to delete result'

      });

    }

  };


// ==================================================
// EXPORT
// ==================================================

module.exports = {

  saveResult,

  getMyResults,

  getResultById,

  deleteResultByInterview

};