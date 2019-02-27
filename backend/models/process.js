'using strict';

const mongoose = require('mongoose');

const stepPage = require('./stepPage').schema;

const processSchema = mongoose.Schema({
  label: { type: String, required: true },
  steps: { type: [stepPage], required: true }
});

module.exports.schema = processSchema;
module.exports.model = mongoose.model('Process', processSchema);
