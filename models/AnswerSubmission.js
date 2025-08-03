// models/AnswerSubmission.js
const mongoose = require('mongoose');

// Tracks user answers per quiz attempt
const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    answer: mongoose.Schema.Types.Mixed
  }],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AnswerSubmission', submissionSchema);
