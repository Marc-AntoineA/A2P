'using strict';

const Applicant = require('../models/applicant').model;
const ApplicantStatusEnum = require('../models/applicantStatus');

const signinForm = require('./signin-form.json');

// TODO add dynamically the choices for the campaign
exports.getSigninForm = (req, res, next) => {
    res.status(201).json(signinForm);
};

// TODO
exports.createApplicant = (req, res, next) => {
  const body = req.body;
  console.log(body);
  const campaign = body[1].questions[0].answer;
  const name = body[2].questions[0].answer;
  const password = body[2].questions[1].answer;
  const mailAddress = body[3].questions[0].answer;
  const phoneNumber = body[3].questions[1].answer;

  // TODO crypt password
  // TODO add process corresponding to this campaign
  const applicant = new Applicant({
    "campaign": campaign,
    "name": name,
    "password": password,
    "mailAddress": mailAddress,
    "phoneNumber": phoneNumber,
    "status": 'pending'
  });
  console.log(applicant);
  applicant.save()
    .then(() => {
      res.status(201).json({
        message: 'Applicant created successfully'
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error
      });
    });
};

// TODO
exports.getApplicant = (req, res, next) => {
  console.log('TODO get applicant');
  res.status(200)
};

// TODO
exports.editApplicantStep = (req, res, next) => {
  console.log('TODO edit applicant step');
  res.status(200);
};

// TODO
exports.getApplicantStep = (req, res, next) => {
  console.log('TODO get applicant step');
  res.status(200);
};
