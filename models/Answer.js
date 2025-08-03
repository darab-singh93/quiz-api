// models/Answer.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      selectedAnswer: String
    }
  ],
  score: Number
}, { timestamps: true });

module.exports = mongoose.model('Answer', answerSchema);
