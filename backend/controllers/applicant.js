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
    deadline: {$gt : today },
    status: 'open'
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

// TODO
function checkAnswer(question, answer) {
  return true;
}

// TODO check construction of this step
function editApplicantAnswers(userId, stepIndex, answers, confirm){
  return new Promise((resolve, reject) => {
    Applicant.findOne({_id: userId }).then((applicant) => {
      const steps = applicant.process.steps;
      if (isNaN(stepIndex) || stepIndex < 0 || stepIndex > steps.length) {
        reject(new Error("The step " + stepIndex + " doesn't exist."));
        return;
      }

      const step = steps[stepIndex];
      if (step.status !== 'todo' && step.status !== 'rejected') {
        reject(new Error(`A step in status ${step.status} cannot be edited`));
      }

      const pages = step.pages;
      if (pages.length != answers.length) {
          reject(new Error('Invalid request'));
          return;
      }

      for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        const page = pages[pageIndex];
        const questions = page.questions;
        const questionsAnswers = answers[pageIndex].questions;
        if (questionsAnswers.length != questions.length) {
          reject(new Error('Invalid request'));
        }
        for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
          const question = questions[questionIndex];
          if (!checkAnswer(question, questionsAnswers[questionIndex].answer)) {
            reject(new Error('Invalid request'));
          }
          question.answer = questionsAnswers[questionIndex].answer;
        }
      }

      // TODO add here automatic validation
      if (confirm)  {
        step.status = 'pending';
        console.log(step.status);
      }

      console.log('updating', JSON.stringify(applicant.process));
      Applicant.updateOne({ _id: userId}, { 'process.steps': applicant.process.steps }).then((x) => {
        console.log(x);
        resolve();
        return;
      }).catch((error) => {
        reject(error);
        return;
      });
    }).catch((error) => {
      reject(error);
      return;
    });
  });
};

exports.saveApplicantAnswers = (req, res, next) => {
  const userId = req.params.userId;
  const stepIndex = req.params.step;
  const answers = req.body;
  const confirm = false;
  editApplicantAnswers(userId, stepIndex, answers, confirm)
  .then(() => {
     res.status(204).json({ message: `Applicant ${userId} step ${stepIndex} updated successfully`})
   })
  .catch((error) => {
    console.log('176', error);
    res.status(500).json({ error: { message: error.message } });
  });
}

exports.confirmAndSaveApplicantAnswers = (req, res, next) => {
  const userId = req.params.userId;
  const stepIndex = req.params.step;
  const answers = req.body;
  const confirm = true;
  console.log('confirm and save');
  editApplicantAnswers(userId, stepIndex, answers, confirm)
  .then(() => {
      res.status(204).json({ message: `Applicant ${userId} step ${stepIndex} updated successfully`});
  }).catch((error) => {
    console.log('199', error);
    res.status(500).json({ error: { message: error.message }});
  });
}

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
    res.status(200).json({ 'pages': steps[stepIndex].pages, 'status': steps[stepIndex].status});
  });
};

exports.getAllApplicantsByProcessId = (req, res, next) => {
  const processId = req.params.processId;
  Applicant.find({
    "process._id": processId
  }).then((applicants) => {
    applicants.forEach((applicant) => {applicant.password = undefined});
    res.status(200).json(applicants);
  });
};
