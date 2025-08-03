// controllers/category.controller.js
const Category = require('../models/Category');
const Quiz = require('../models/Quiz');

// Public: Get all categories with their quizzes (excluding questions)
exports.getCategoriesWithQuizzes = async (req, res) => {
  try {
    const categories = await Category.find();

    const results = await Promise.all(
      categories.map(async (cat) => {
        const quizzes = await Quiz.find({ category: cat._id })
          .select('-questions') // Exclude question IDs array
          .populate('category', 'name');

        return {
          _id: cat._id,
          name: cat.name,
          description: cat.description,
          quizzes
        };
      })
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Public: Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
