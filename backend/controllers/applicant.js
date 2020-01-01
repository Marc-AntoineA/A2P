 'using strict';

const bcrypt = require('bcryptjs');
const BCRYPT_SALTROUNDS = require('../settings.json').BCRYPT_SALTROUNDS;
const jwt = require('jsonwebtoken');
const TOKEN_RANDOM_SECRET = require('../settings.json').TOKEN_RANDOM_SECRET;
const fileSystem = require('fs');

const Applicant = require('../models/applicant').model;
const InterviewSlot = require('../models/interviewSlot').model;
const ApplicantStatusEnum = require('../models/applicantStatus');
const Process = require('../models/process').model;
const SheetExports = require('../utils/sheetExports');

const signinForm = require('./signin-form.json');

const {
  sendApplicationMail,
  sendRejectedMail,
  sendAcceptedMail,
  sendTemplatedMail,
  sendReceivedStepMail,
  sendResetPasswordMail,
  loadAndSendEmail
} = require('../smtp/');

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

// TODO WARNING - no verifications on email, phoneNumber, etc.
exports.createApplicant = (req, res, next) => {
  const body = req.body;
  const campaignIndex = body[1].questions[0].answer;
  const campaign = body[1].questions[0].choices[campaignIndex];
  const name = body[2].questions[0].answer;
  const phoneNumber = body[2].questions[1].answer;
  const mailAddress = body[3].questions[0].answer.toLowerCase();
  const password = body[3].questions[1].answer;
  Process.findOne({
    label: campaign
  }).then(process => {
    bcrypt.hash(password, BCRYPT_SALTROUNDS).then((hash) => {
      const applicant = new Applicant({
        name: name,
        password: hash,
        mailAddress: mailAddress,
        phoneNumber: phoneNumber,
        status: 'pending',
        process: process,
        archived: false
      });
      const token = jwt.sign({ userId: applicant._id, superviser: false }, TOKEN_RANDOM_SECRET, { expiresIn: '24h' });
      applicant.save().then(() => {
        sendApplicationMail(mailAddress, { applicant: applicant });
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
  const mailAddress = req.body.mail.toLowerCase();
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

function generatePassword() {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.random() * n);
    }
    return retVal;
}

exports.resetPassword = (req, res, next) => {
  const mailAddress = req.body.mail.toLowerCase();
  const outputMessage = "An email was sent to this mail address. If you don't see it soon, please double check your email address or contact us";
  Applicant.findOne({
    mailAddress: mailAddress
  }).then((applicant) => {
    if (!applicant) {
      return res.status(200).json({
        message: outputMessage
      });
    }

    const newPassword = generatePassword();
    bcrypt.hash(newPassword, BCRYPT_SALTROUNDS).then((hash) => {
      applicant.password = hash;
      applicant.save().then(() => {
        res.status(200).json({
          message: outputMessage
        });
      }).then(() => {
        sendResetPasswordMail(applicant.mailAddress, { applicant: applicant, password: newPassword });
      });
    });
  });
};

exports.getApplicant = (req, res, next) => {
  Applicant.findOne({
    _id: req.params.userId
  }).then((applicant) => {
    const appStr = JSON.stringify(applicant);
    const appCopy = JSON.parse(appStr);
    appCopy.password = undefined;
    InterviewSlot.findOne({ applicantId: req.params.userId }).then((slot) => {
      appCopy.interviewSlot = slot;
      console.log(appCopy);
      res.status(200).json(appCopy);
    });
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
        sendReceivedStepMail(applicant.mailAddress, { applicant: applicant, step: step });
      }

      Applicant.updateOne({ _id: userId}, { 'process.steps': applicant.process.steps }).then((x) => {
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
  editApplicantAnswers(userId, stepIndex, answers, confirm)
  .then(() => {
      res.status(200).json({ message: `Applicant ${userId} step ${stepIndex} updated successfully`});
  }).catch((error) => {
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
  const template = req.body;

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
    Applicant.findOneAndUpdate({ _id: applicantId }, {
      [`process.steps.${stepIndex}.status`]: status
    }).then((applicant) => {

      const data = {
        applicant: applicant,
        step: step
      };
      loadAndSendEmail(status === 'validated' ? 'step_accepted' : 'step_rejected', applicant.mailAddress, data, template.template, subject=undefined);

      res.status(200).json({ message: `Status for step ${stepIndex} for applicant ${applicantId} updated successfully`});
    }).catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
  }).catch((errorMessage) => {
    res.status(404).json({ error: { message: errorMessage } });
  });
};

exports.updateStatusByApplicantId = (req, res, next) => {
  const applicantId = req.params.applicantId;
  const status = req.params.status;
  if (status !== 'accepted' && status !== 'rejected') {
    res.status(500).json({ error: { message: `Status can be only "accepted" or "rejected". Not "${status}"`}});
    return;
  }

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
    Applicant.findOneAndUpdate({ _id: applicantId }, { status: status })
    .then((applicant) => {
      if (status === 'accepted')
        sendAcceptedMail(applicant.mailAddress, { applicant: applicant });
      if (status === 'rejected')
        sendRejectedMail(applicant.mailAddress, { applicant: applicant });

      res.status(200).json({ message: `Status for applicant ${applicantId} updated successfully`});
    }).catch((error) => {
      res.status(500).json({ error: error });
    });
  }).catch((error) => {
    res.status(404).json({ error: { message: error.toString() } });
  });
};

exports.deleteApplicantById = (req, res, next) => {
  const applicantId = req.params.applicantId;
  Applicant.findOneAndDelete({_id: applicantId})
    .then((applicant) => {
      if (!applicant) res.status(404).json({error: { message: `applicant ${applicantId} doesn't exist.`}});
      res.status(200).json({
        message: `Applicant ${applicantId} deleted successfully`
      });
    }).catch((error) => {
      res.status(500).json({
        error: error
      });
    });
};

exports.getAllApplicantsByProcessIdExcelFile = (req, res, next) => {
  const processId = req.params.processId;
  Process.findOne({
    "_id": processId
  }).then((process) => {
  if (!process) {
    res.status(404).json({
      error: { message: `No process with id ${process.id}`}
    });
  }
  Applicant.find({
    "process._id": processId
  }).then((applicants) => {
      const processId = req.params.processId;
      const today = new Date();
      SheetExports.buildApplicantsAnswers(process, applicants, 'tmp/out.xlsx').then(() => {
        const stat = fileSystem.statSync('tmp/out.xlsx');
        res.writeHead(200, {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Length': stat.size,
          'Content-Disposition': 'attachment; filename=' + `"applicants_${process.label}_${today.toISOString()}.xlsx"`
        });
        const readStream = fileSystem.createReadStream('tmp/out.xlsx');
        readStream.pipe(res);
      }).catch((error) => {
        console.log(error);
        res.status(404).json({
          error: { messsage: error.toString() }
        });
      });
    });
  });
};

exports.getLasts10Applicants = (req, res, next) => {
  Applicant.find({
  }).sort({ createdAt: 'desc' }).limit(10).then((applicants) => {
    res.status(200).json(applicants);
  }).catch((error) => {
    res.status(404).json({ message: error.toString() });
  })
};

exports.getAllPendingApplicants = (req, res, next) => {
  Applicant.find({
    "status": "pending",
    "archived": "false"
  }).then((applicants) => {
    const pendingApplicants = applicants.filter((applicant) => {
      const steps = applicant.process.steps;
      let waitingValidation = true;
      for (let stepIndex=0; stepIndex<steps.length; stepIndex++) {
        const step = steps[stepIndex];
        if (step.status === 'todo' || step.status === 'rejected')
          waitingValidation = false;
        if (step.status === 'pending')
          return true;
      }
      return waitingValidation;
    });
    res.status(200).json(applicants);
  }).catch((error) => {
    res.status(404).json({ message: error.toString() });
  });
};

exports.updateArchivedByApplicantId = (req, res, next) => {
  const applicantId = req.params.applicantId;
  const value = req.params.value;
  if (value !== 'archive' && value !== 'unarchive') {
    res.status(500).json({ error: { message: `Interest can be only "archive" or "unarchive". Not "${status}"`}});
    return;
  }

  Applicant.findOne({ _id: applicantId })
  .then((applicant) => {
    if (!applicant) res.status(404).json({ error: { message: `Applicant ${applicantId} doesn't exist`}});

    Applicant.findByIdAndUpdate(applicantId, { archived: value === 'archive' })
    .then((updatedApplicant) => {
      updatedApplicant.archived = (value === 'archive');
      res.status(200).json({ message: `Archived for applicant ${applicantId} updated successfully`, applicant: updatedApplicant });
    }).catch((error) => {
      res.status(500).json({ error: error });
    });
  }).catch((error) => {
    res.status(404).json({ error: { message: error.toString() } });
  });
}
