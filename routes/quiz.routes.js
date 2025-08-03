// routes/quiz.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');

const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  addQuestionsToQuiz, 
  getAttemptsByQuiz
} = require('../controllers/quiz.controller');

// Public: Get all quizzes or one quiz
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);

// Admin: Create, update, delete
router.post('/', auth, isAdmin, createQuiz);
router.put('/:id', auth, isAdmin, updateQuiz);
router.delete('/:id', auth, isAdmin, deleteQuiz);

// Admin: Add questions to quiz 👇
router.post('/:quizId/questions', auth, isAdmin, addQuestionsToQuiz);
router.get('/attempts/by-quiz', auth, isAdmin, getAttemptsByQuiz);

module.exports = router;
