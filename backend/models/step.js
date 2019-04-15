'using strict';
const mongoose = require('mongoose');

const stepPageSchema = require('./stepPage').schema;

// validation waited, validated, todo, rejected
// TODO add validator or status
const stepSchema = mongoose.Schema({
  label: { type: String, required: true },
  mark: { type: Number, required: false, default: -1 },
  status: { type: String, required: false, default: 'todo'},
  pages: { type: [stepPageSchema], required: true }
});

module.exports.schema = stepSchema;
module.exports.model = mongoose.model('Step', stepSchema);
