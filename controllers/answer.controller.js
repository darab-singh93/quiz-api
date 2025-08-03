// controllers/answer.controller.js
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// Submit answers to a quiz
exports.submitAnswers = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    let score = 0;

    if (quiz.type === 'Test') {
      for (const ans of answers) {
        const question = await Question.findById(ans.questionId);
        if (question && question.answer === ans.selectedAnswer) {
          score++;
        }
      }
    }

    const answerDoc = await Answer.create({
      user: userId,
      quiz: quizId,
      answers,
      score: quiz.type === 'Test' ? score : undefined
    });

    res.status(201).json({
      message: 'Answers submitted',
      score: quiz.type === 'Test' ? score : null,
      total: answers.length
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all attempts by the logged-in user
exports.getMyAttempts = async (req, res) => {
  try {
    const rawAttempts = await Answer.find({ user: req.user.id })
      .populate('quiz', 'title type totalTime')
      .sort({ createdAt: -1 });

    const enhancedAttempts = [];

    for (const attempt of rawAttempts) {
      const quizType = attempt.quiz?.type || 'Test';

      const enrichedAnswers = [];

      for (const ans of attempt.answers) {
        const question = await Question.findById(ans.questionId);
        if (!question) continue;

        const enriched = {
          _id: ans._id,
          questionId: question._id,
          questionTitle: question.title,
          selectedOption: ans.selectedAnswer,
          selectedAnswer: question.options[ans.selectedAnswer] || ''
        };

        if (quizType === 'Test') {
          enriched.correctOption = question.answer;
          enriched.correctAnswer = question.options[question.answer] || '';
        }

        enrichedAnswers.push(enriched);
      }

      enhancedAttempts.push({
        _id: attempt._id,
        quiz: attempt.quiz,
        score: attempt.score,
        total: attempt.answers.length,
        createdAt: attempt.createdAt,
        answers: enrichedAnswers
      });
    }

    res.json(enhancedAttempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Admin: Get all attempts with optional filters
exports.getAllAttempts = async (req, res) => {
  try {
    const { userId, quizId } = req.query;
    const filter = {};
    if (userId) filter.user = userId;
    if (quizId) filter.quiz = quizId;

    const attempts = await Answer.find(filter)
      .populate('user', 'name email')
      .populate('quiz', 'title') // 'title' instead of 'name'
      .sort({ createdAt: -1 })
      .select('-answers'); // <-- exclude 'answers' from response

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Get attempts grouped by quiz
exports.getAttemptsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.query;
    const filter = {};
    if (quizId) filter.quiz = quizId;

    const attempts = await Answer.find(filter)
      .populate('user', 'name email')
      .populate('quiz', 'title type totalTime')
      .sort({ createdAt: -1 });

    // Group attempts by quiz ID
    const grouped = attempts.reduce((acc, attempt) => {
      const qId = attempt.quiz._id.toString();
      if (!acc[qId]) {
        acc[qId] = {
          quiz: attempt.quiz,
          attempts: []
        };
      }

      acc[qId].attempts.push({
        user: attempt.user,
        score: attempt.score,
        createdAt: attempt.createdAt
      });

      return acc;
    }, {});

    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


