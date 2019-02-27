'using strict';

const Applicant = require('../models/applicant').model;
const ApplicantStatusEnum = require('../models/applicantStatus');

// TODO
exports.createApplicant = (req, res, next) => {
  // TODO crypt password
  // TODO add process corresponding to this campaign
  const body = req.body;
  const applicant = new Applicant({
    "mailAddress": body.mailAddress,
    "password": body.password,
    "campaign": body.campaign,
    "status": 'pending'
  });

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
exports.getApplicantProcess = (req, res, next) => {
  console.log('TODO get applicant process');
  res.status(200)
};

// TODO
exports.modifyApplicantProcess = (req, res, next) => {
  console.log('TODO modify applicant process');
  res.status(200);
}
