'using strict';

const mongoose = require('mongoose');

const stepSchema = require('./step').schema;

const processSchema = mongoose.Schema({
  label: { type: String, required: true },
  steps: { type: [stepSchema], required: true }
});

module.exports.schema = processSchema;
module.exports.model = mongoose.model('Process', processSchema);
