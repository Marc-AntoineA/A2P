'using strict';

const mongoose = require('mongoose');

const stepSchema = require('./step').schema;

// TODO status should be something like opened, closed...
// TODO in applicant-api, send only opened steps
const processSchema = mongoose.Schema({
  deadline: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  location: { type: String, required: true },
  label: { type: String, required: true },
  status: { type: String, required: true },
  steps: { type: [stepSchema], required: true }
});

module.exports.schema = processSchema;
module.exports.model = mongoose.model('Process', processSchema);
