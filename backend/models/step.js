'using strict';
const mongoose = require('mongoose');

const stepPageSchema = require('./stepPage').schema;

const stepSchema = mongoose.Schema({
  label: { type: String, required: true },
  mark: { type: Number, required: false },
  pages: { type: [stepPageSchema], required: true }
});

module.exports.schema = stepSchema;
module.exports.model = mongoose.model('Step', stepSchema);
