'using strict';
const mongoose = require('mongoose');

const stepPageSchema = require('./stepPage').schema;

// validation waited, validated, todo, rejected
// TODO add validator or status
const stepSchema = mongoose.Schema({
  label: { type: String, required: true },
  mark: { type: Number, required: false },
  status: { type: String, required: false },
  pages: { type: [stepPageSchema], required: true }
});

module.exports.schema = stepSchema;
module.exports.model = mongoose.model('Step', stepSchema);
