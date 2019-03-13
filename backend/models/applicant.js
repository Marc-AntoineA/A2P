'using strict';
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const processSchema = require('./process').schema;
const validators = require('../validators/basic');

const applicantSchema = mongoose.Schema({
  name: { type: String, required: true },
  mailAddress: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  campaign: { type: String, required: true },
  status: { type: String, required: true }, // TODO rejected, accepted class X...,
  process: { type: processSchema, required: true },
});

applicantSchema.plugin(uniqueValidator);

const Applicant = mongoose.model('Applicant', applicantSchema);

Applicant.schema.path('mailAddress').validate(validators.validateMail);
Applicant.schema.path('phoneNumber').validate(validators.validatePhone);
Applicant.schema.path('status').validate(validators.validateStatus);

module.exports.schema = applicantSchema;
module.exports.model = Applicant;
