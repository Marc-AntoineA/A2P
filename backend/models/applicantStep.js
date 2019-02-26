'using strict';
const mongoose = require('mongoose');

const questionWithAnswerSchema = require('./questionWithAnswerSchema');

const applicantStepSchema = mongoose.Schema({
  submitted: { type: Boolean, required: true },
  validated: { type: Boolean, required: true },
  mark: { type: Number, required: true },
  questionWithAnswer: [questionWithAnswerSchema]
});

module.exports =  mongoose.model('ApplicantStep', applicantStepSchema);
