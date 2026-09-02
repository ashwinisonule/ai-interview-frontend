const mongoose = require('mongoose');

const questionResultSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },

    correctAnswer: {
      type: String,
      default: ''
    },

    userAnswer: {
      type: String,
      default: ''
    },

    isCorrect: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: false
  }
);

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true
    },

    interviewTitle: {
      type: String,
      required: true
    },

    jobRole: {
      type: String,
      required: true
    },

    questions: {
      type: [questionResultSchema],
      required: true
    },

    totalQuestions: {
      type: Number,
      default: 0
    },

    answeredQuestions: {
      type: Number,
      default: 0
    },

    correctAnswers: {
      type: Number,
      default: 0
    },

    wrongAnswers: {
      type: Number,
      default: 0
    },

    score: {
      type: Number,
      default: 0
    },

    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'Result',
  resultSchema
);