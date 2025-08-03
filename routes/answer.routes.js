// routes/answer.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { submitAnswers } = require('../controllers/answer.controller');
const { getMyAttempts, getAllAttempts } = require('../controllers/answer.controller');
const isAdmin = require('../middlewares/isAdmin.middleware');

router.get('/my', auth, getMyAttempts); // User: My attempts
router.get('/all', auth, isAdmin, getAllAttempts); // Admin: All attempts


// Only authenticated users can submit
router.post('/submit', auth, submitAnswers);

module.exports = router;
