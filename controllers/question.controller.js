// controllers/question.controller.js
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// Admin: Add question to a quiz
exports.addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { serialNumber, title, type, options, answer } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const question = await Question.create({
      quiz: quizId,
      serialNumber,
      title,
      type,
      options,
      answer: quiz.type === 'test' ? answer : undefined // allow answer only if it's a test quiz
    });

    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Public: Get all questions of a quiz
exports.getQuestionsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const projection = quiz.type === 'test' ? '-answer' : ''; // don't send answers to users
    const questions = await Question.find({ quiz: quizId }).select(projection);

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Create a question
exports.createQuestion = async (req, res) => {
  try {
    const { title, type, options, answer, time } = req.body;

    const question = new Question({
      title,
      type,
      options,
      answer,
      time
    });

    await question.save();
    res.status(201).json({ message: 'Question created successfully', question });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
