'using strict';

const mongoose = require('mongoose');

const questionWithAnswerSchema = mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

module.exports = questionWithAnswerSchema;
