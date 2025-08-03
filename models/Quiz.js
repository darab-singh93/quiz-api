const mongoose = require('mongoose');

/// Quiz links to a category and contains quiz metadata
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  instructions: String,
  type: { type: String, enum: ['Live', 'Test'], required: true },
  totalQuestions: Number, // Auto-calculated
  totalTime: Number,      // Auto-calculated (sum of question times)
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
