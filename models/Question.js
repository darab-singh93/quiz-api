const mongoose = require('mongoose');

// Independent Question Schema
const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['MCQ', 'TF'], required: true },
  options: [String], // Only for MCQ type
  answer: { type: Number, required: true }, // now stores index
  time: { type: Number, required: true } // Time in minutes to answer this question
}, { timestamps: true });
module.exports = mongoose.model('Question', questionSchema);
