// routes/category.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/isAdmin.middleware');

const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoriesWithQuizzes 
} = require('../controllers/category.controller');

// Public: List categories
router.get('/', getAllCategories);
router.get('/with-quizzes', getCategoriesWithQuizzes);

// Admin routes
router.post('/', auth, isAdmin, createCategory);
router.put('/:id', auth, isAdmin, updateCategory);
router.delete('/:id', auth, isAdmin, deleteCategory);

module.exports = router;
