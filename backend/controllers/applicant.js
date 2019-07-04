'using strict';

const bcrypt = require('bcryptjs');
const BCRYPT_SALTROUNDS = require('../settings.json').BCRYPT_SALTROUNDS;
const jwt = require('jsonwebtoken');
const TOKEN_RANDOM_SECRET = require('../settings.json').TOKEN_RANDOM_SECRET;

const Applicant = require('../models/applicant').model;
const ApplicantStatusEnum = require('../models/applicantStatus');
const Process = require('../models/process').model;
const { sendMail } = require('../smtp/');

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
      const token = jwt.sign({ userId: applicant._id, superviser: false }, TOKEN_RANDOM_SECRET, { expiresIn: '24h' });
      applicant.save().then(() => {
        res.status(201).json({
          message: 'Applicant created successfully',
          id: applicant._id,
          token: token
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
      const token = jwt.sign({ userId: applicant._id, superviser: false }, TOKEN_RANDOM_SECRET, { expiresIn: '24h' });
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

exports.resetPassword = (req, res, next) => {
  const mailAddress = req.body.mail;
  const outputMessage = "An email was sent to this mail address. If you don't see it soon, please double check your email address or contact us";
  Applicant.findOne({
    mailAddress: mailAddress
  }).then((applicant) => {
    if (!applicant) {
      return res.status(401).json({
        error: {message: outputMessage}
      });
    }
    // todo 1. password generator
    // Todo 2. use emails templates
    const newPassword = "1234567890";
    bcrypt.hash(newPassword, BCRYPT_SALTROUNDS).then((hash) => {
      applicant.password = hash;
      applicant.save().then(() => {
        res.status(202).json({
          message: outputMessage
        });
      }).then(() => {
        sendMail({
          to: applicant.mailAddress,
          subject: 'reset Password',
          text: `Your new password is ${newPassword}`
        });
      });
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
     res.status(200).json({ message: `Applicant ${userId} step ${stepIndex} updated successfully`})
   })
  .catch((error) => {
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
      res.status(200).json({ message: `Applicant ${userId} step ${stepIndex} updated successfully`});
  }).catch((error) => {
    console.log('199', error);
    res.status(500).json({ error: { message: error.message }});
  });
}

function promiseGetApplicantStep(userId, stepIndex) {
  return new Promise((resolve, reject) => {
    Applicant.findOne({ _id: userId })
    .then((applicant) => {
      const steps = applicant.process.steps;
      if (isNaN(stepIndex) || stepIndex < 0 || stepIndex > steps.length) {
        reject("The step " + stepIndex + " doesn't exist.");
      } else {
        resolve(steps[stepIndex]);
      }
    }).catch((error) => {
      reject(error.toString());
    });
  });
}

exports.getApplicantStep = (req, res, next) => {
  const userId = req.params.userId;
  const stepIndex = req.params.step;
  promiseGetApplicantStep(userId, stepIndex)
  .then((step) => {
    res.status(200).json({ 'pages': step.pages, 'status': step.status})
  }).catch((errorMessage) => {
    res.status(404).json({error: { message: errorMessage}});
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

exports.updateStepMarkByApplicantId = (req, res, next) => {
  const applicantId = req.params.applicantId;
  const stepIndex = req.params.stepIndex;

  const mark = req.body.mark;
  promiseGetApplicantStep(applicantId, stepIndex)
  .then((step) => {
    if (step.status !== 'validated') {
      res.status(500).json({ error: { message: 'A not-validated step cannot be noted'}});
      return;
    }
    Applicant.updateOne({_id: applicantId}, {
      [`process.steps.${stepIndex}.mark`]: mark
    }).then(() => {
      res.status(200).json({ message: `Mark for step ${stepIndex} for applicant ${applicantId} updated successfully`});
    }).catch((error) => {
      res.status(500).json({ error: error });
    });
  }).catch((errorMessage) => {
    res.status(404).json({error: { message: errorMessage}});
  });
};

exports.updateStepStatusByApplicantId = (req, res, next) => {
  const applicantId = req.params.applicantId;
  const stepIndex = req.params.stepIndex;
  const status = req.params.status;
  if (status !== 'validated' && status !== 'rejected') {
    res.status(404).json({ error: { message: `Status ${status} is undefined`}});
    return;
  }

  promiseGetApplicantStep(applicantId, stepIndex)
  .then((step) => {
    if (step.status !== 'pending') {
      res.status(500).json({ error: { message: 'Only steps in status pending can be validated.'}});
      return;
    }

    Applicant.updateOne({ _id: applicantId }, {
      [`process.steps.${stepIndex}.status`]: status
    }).then(() => {
      res.status(200).json({ message: `Status for step ${stepIndex} for applicant ${applicantId} updated successfully`});
    }).catch((error) => {
      res.status(500).json({ error: error });
    });
  }).catch((errorMessage) => {
    res.status(404).json({ error: { message: errorMessage } });
  });
};

exports.updateStatusByApplicantId = (req, res, next) => {
  const applicantId = req.params.applicantId;
  const status = req.params.status;
  console.log(applicantId);
  Applicant.findOne({ _id: applicantId })
  .then((applicant) => {
    if (!applicant) res.status(404).json({ error: { message: `Applicant ${applicantId} doesn't exist`}});
    const steps = applicant.process.steps;
    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
      const step = steps[stepIndex];
      if (step.status !== 'validated') {
        res.status(500).json({ error: { message: 'All the steps must be validated to change the status'}});
        return;
      }
    }
    Applicant.updateOne({ _id: applicantId }, { status: status })
    .then(() => {
      res.status(200).json({ message: `Status for applicant ${applicantId} updated successfully`});
    }).catch((error) => {
      res.status(500).json({ error: error });
    });
  }).catch((error) => {
    res.status(404).json({ error: { message: error.toString() } });
  });
};
