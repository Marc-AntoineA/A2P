'using strict';

const mongoose = require('mongoose');

// TODO check in validation if type is in [_, _, _, _, _, _]
const questionSchema = mongoose.Schema({
  'label': { type: String, required: true },
  'type': { type: String, required: true }
  'mandatory': { type: Boolean, required: true },
  'choices': { type: [String], required: false }
});

module.exports = questionSchema;
