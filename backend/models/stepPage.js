'using strict';

const mongoose = require('mongoose');
const questionSchema = require('./question').schema;

const stepPageSchema = mongoose.Schema({
  label: { type: String, required: true },
  caption: { type: String, required: true },
  questions: {type: [questionSchema], required: true}
});

module.exports.schema = stepPageSchema;
module.exports.model = mongoose.model('StepPage', stepPageSchema);
