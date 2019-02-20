'use strict';

const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
  'mail': String,
  'dateofbirth': String
});

const ApplicantModel = new mongoose.model('Applicant', ApplicantSchema);

// Adding methods here

export default ApplicantModel;
