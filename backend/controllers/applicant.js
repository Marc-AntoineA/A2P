'using strict';

const bcrypt = require('bcrypt');
const BCRYPT_SALTROUNDS = require('../settings.json').BCRYPT_SALTROUNDS;
const jwt = require('jsonwebtoken');
const TOKEN_RANDOM_SECRET = require('../settings.json').TOKEN_RANDOM_SECRET;

const Applicant = require('../models/applicant').model;
const ApplicantStatusEnum = require('../models/applicantStatus');
const Process = require('../models/process').model;

const signinForm = require('./signin-form.json');

// TODO add dynamically the choices for the campaign
exports.getSigninForm = (req, res, next) => {
  const today = new Date();
  Process.find({
    deadline: {$gt : today }
  }).then((processes) => {
    const campaigns = processes.map(p => p.label);
    signinForm[1].questions[0].choices = campaigns;
    res.status(201).json(signinForm);
  });
};

exports.createApplicant = (req, res, next) => {
  const body = req.body;
  const campaignIndex = body[1].questions[0].answer;
  const campaign = body[1].questions[0].choices[campaignIndex];
  const name = body[2].questions[0].answer;
  const password = body[2].questions[1].answer;
  const mailAddress = body[3].questions[0].answer;
  const phoneNumber = body[3].questions[1].answer;

  Process.findOne({
    label: campaign
  }).then(process => {
    bcrypt.hash(password, BCRYPT_SALTROUNDS).then((hash) => {
      const applicant = new Applicant({
        campaign: campaign,
        name: name,
        password: hash,
        mailAddress: mailAddress,
        phoneNumber: phoneNumber,
        status: 'pending',
        process: process,
      });
      applicant.save().then(() => {
        res.status(201).json({
          message: 'Applicant created successfully'
        });
      }).catch((error) => {
        res.status(500).json({
          error: error
        });
      });
    }).catch((error) => {
      res.status(503).json({
        error: {message: "An unknown error occured. Please contact the administrator of this website."}
      });
    });
  }).catch((error) => {
    res.status(503).json({
      error: {message: "An unknown error occured. Please contact the administrator of this website."}
    });
  });
};

// 401 Unauthorized error
exports.login = (req, res, next) => {
  console.log(req.body);
  const mailAddress = req.body.mail;
  const password = req.body.password;
  Applicant.findOne({
    mailAddress: mailAddress
  }).then((applicant) => {
    if (!applicant) {
      return res.status(401).json({
        error: {message: 'User or password is incorrect'}
      });
    }
    bcrypt.compare(password, applicant.password).then((valid) => {
      if (!valid) {
        return res.status(401).json({
          error: {message: 'User or password is incorrect'}
        });
      }
      const token = jwt.sign({ userId: applicant._id }, TOKEN_RANDOM_SECRET, { expiresIn: '24h' });
      res.status(200).json({
        id: applicant._id,
        token: token
      });
    }).catch((error) => {
      res.status(500).json({
        error: error
      });
    });
  }).catch((error) => {
    res.status(500).json({
      error: error
    });
  });
};

exports.getApplicant = (req, res, next) => {
  Applicant.findOne({
    _id: req.params.userId
  }).then((applicant) => {
    applicant.password = undefined;
    res.status(200).json(applicant);
  }).catch((error) => {
    res.status(500).json({
      error: error
    });
  });
};

// TODO -- avoid repetitions with getApplicantStep
// TODO check construction of this step
exports.editApplicantStep = (req, res, next) => {
  const userId = req.params.userId;
  const stepIndex = req.params.step;
  Applicant.findOne({_id: userId }).then((applicant) => {
    const steps = applicant.process.steps;
    if (isNaN(stepIndex) || stepIndex < 0 || stepIndex > steps.length) {
      /*res.status(404).json({
        error: {message: "The step " + stepIndex + " doesn't exist."}
      });*/
      return;
    }

    applicant.process.steps[stepIndex].pages = req.body;
    applicant.save().then(() => {
      res.status(204).json({message: "Applicant updated successfully."});
      return;
    }).catch((err) => {
      res.status(500).json({error: err });
      return;
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).json({error: err});
    return;
  });
};

exports.getApplicantStep = (req, res, next) => {
  const userId = req.params.userId;
  const stepIndex = req.params.step;
  Applicant.findOne({
    _id: userId
  }).then((applicant) => {
    const steps = applicant.process.steps;
    if (isNaN(stepIndex) || stepIndex < 0 || stepIndex > steps.length) {
      res.status(404).json({
        error: {message: "The step " + stepIndex + " doesn't exist."}
      });
      return;
    }
    res.status(200).json(steps[stepIndex].pages);
  });
};

exports.getAllApplicantsByProcessId = (req, res, next) => {
  const processId = req.params.processId;
  Applicant.find({
    "process._id": processId
  }).then((applicants) => {
    console.log(applicants);
    res.status(200).json(applicants);
  });
};
