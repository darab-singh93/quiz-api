// controllers/quiz.controller.js

const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

exports.addQuestionsToQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questionIds } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Check limit
    const totalAfterAdd = quiz.questions.length + questionIds.length;
    if (quiz.totalQuestions && totalAfterAdd > quiz.totalQuestions) {
      return res.status(400).json({ error: 'Cannot exceed totalQuestions limit' });
    }

    // Validate question IDs
    const validQuestions = await Question.find({ _id: { $in: questionIds } });
    if (validQuestions.length !== questionIds.length) {
      return res.status(400).json({ error: 'One or more questionIds are invalid' });
    }

    // Add unique questions only
    const newQuestions = questionIds.filter(qid => !quiz.questions.includes(qid));
    quiz.questions.push(...newQuestions);

    // Recalculate totalTime based on question times
    const fullQuestions = await Question.find({ _id: { $in: quiz.questions } });
    quiz.totalTime = fullQuestions.reduce((sum, q) => sum + (q.time || 0), 0);

    await quiz.save();
    res.status(200).json({ message: 'Questions added to quiz', quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Admin: Create a quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, category, totalTime, timePerQuestion, instructions,totalQuestions, type } = req.body;
    const quiz = await Quiz.create({
      title,
      category,
      totalTime,
      timePerQuestion,
      instructions,
      totalQuestions,
      type,
      createdBy: req.user.id
    });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Public: List all quizzes (optional filter by category)
exports.getAllQuizzes = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const quizzes = await Quiz.find(filter).populate('category', 'name');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Public: Get quiz by ID with full question details
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('category', 'name')
      .populate('questions'); // populate all fields

    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Modify questions based on quiz type
    const modifiedQuestions = quiz.questions.map((q) => {
      const questionObj = {
        _id: q._id,
        title: q.title,
        type: q.type,
        options: q.options,
        time: q.time,
        answer: quiz.type === 'Test' ? q.answer : ''
      };
      return questionObj;
    });

    const quizResponse = {
      _id: quiz._id,
      title: quiz.title,
      category: quiz.category,
      totalTime: quiz.totalTime,
      instructions: quiz.instructions,
      type: quiz.type,
      totalQuestions: quiz.totalQuestions,
      createdBy: quiz.createdBy,
      questions: modifiedQuestions
    };

    res.json(quizResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Admin: Update a quiz
exports.updateQuiz = async (req, res) => {
  try {
    const updates = req.body;
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin: Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Admin: Get all attempts for a specific quiz
exports.getAttemptsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.query;

    if (!quizId) {
      return res.status(400).json({ error: 'quizId query parameter is required' });
    }

    const attempts = await Answer.find({ quiz: quizId })
      .populate('user', 'name email')
      .populate('quiz', 'title type totalTime')
      .sort({ createdAt: -1 });

    const response = attempts.map((attempt) => ({
      _id: attempt._id,
      user: attempt.user,
      quiz: {
        _id: attempt.quiz._id,
        title: attempt.quiz.title,
        type: attempt.quiz.type,
        totalTime: attempt.quiz.totalTime,
      },
      score: attempt.score,
      createdAt: attempt.createdAt
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
