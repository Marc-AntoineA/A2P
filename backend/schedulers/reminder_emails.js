const Applicant = require('../models/applicant').model;
const { loadAndSendEmail } = require('../smtp');

const moment = require('moment');


exports.sendEmailToInactiveApplicants = function(nbDays) {
  const today = moment();
  const lastUpdateDeadline = today.add(-nbDays, 'days');
  console.log('lastUpdateDeadline');
  console.log(lastUpdateDeadline.toString());
  Applicant.find({
    updatedAt: {$gt : lastUpdateDeadline.toDate()},
    status: 'pending'
  }).then((applicants) => {
    console.log('applicants');
    console.log(applicants);
    applicants.map((applicant) => {
      if (applicant.process.status !== 'open' || applicant.process.deadline <= today) return;
      const steps = applicant.process.steps;

      let oneStepIsTodo = false;
      for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
        const step = steps[stepIndex];
        if (step.status !== 'todo' && step.status !== 'rejected') continue;
        oneStepIsTodo = true;
      }
      if (!oneStepIsTodo) return;
      const mailAddress = applicant.mailAddress;
      console.log(applicant.name);
      loadAndSendEmail('reminder', mailAddress, { applicant });
    });
  });
}

exports.sendEmailToInactiveApplicants(10);
