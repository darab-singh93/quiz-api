// routes/question.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');

const {
  addQuestion,
  getQuestionsByQuiz,
  deleteQuestion,
  createQuestion // ⬅️ New controller
} = require('../controllers/question.controller');

// Public: Get all questions of a quiz
router.get('/quiz/:quizId', getQuestionsByQuiz); // 👈 updated path for clarity

// Admin: Create standalone question
router.post('/', auth, isAdmin, createQuestion); // 👈 required for POST /api/questions

// Admin: Add question to specific quiz (optional legacy support)
router.post('/quiz/:quizId', auth, isAdmin, addQuestion);

// Admin: Delete a question
router.delete('/one/:questionId', auth, isAdmin, deleteQuestion);

module.exports = router;
