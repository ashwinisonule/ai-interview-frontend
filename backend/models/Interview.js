const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    jobRole: {
      type: String,
      required: true,
      trim: true
    },

    experience: {
      type: String,
      required: true
    },

    difficulty: {
      type: String,
      required: true
    },

    interviewType: {
      type: String,
      required: true
    },

    numberOfQuestions: {
      type: Number,
      required: true
    },

    duration: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started'
    },

    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'Interview',
  interviewSchema
);