'using strict';
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validators = require('../validators/basic');

const superviserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Superviser = mongoose.model('Superviser', superviserSchema);

Superviser.schema.path('username').validate(validators.validateMail);

module.exports.schema = superviserSchema;
module.exports.model = Superviser;
