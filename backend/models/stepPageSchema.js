'using strict';

const mongoose = require('mongoose');
const questionSchema = require('./questionSchema');

const stepPageSchema = mongoose.Schema({
  'label': { type: String, required: true },
  'caption': { type: String, required: true },
  'questions': {type: [questionSchema], required: true}
});

module.exports = stepPageSchema;
