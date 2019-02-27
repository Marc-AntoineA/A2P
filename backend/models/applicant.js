'using strict';
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const processSchema = require('./process').schema;

const applicantSchema = mongoose.Schema({
  mailAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  campaign: { type: String, required: true },
  status: { type: String, required: true }, // TODO rejected, accepted class X...,
  process: { type: [processSchema], required: true },
});

applicantSchema.plugin(uniqueValidator);

module.exports.schema = applicantSchema;
module.exports.model = mongoose.model('Applicant', applicantSchema);
