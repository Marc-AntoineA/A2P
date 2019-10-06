const assert = require('assert');

// exports.sendAcceptedMail = function(to, name, campaignName) {
//   return sendMail(to, 'accepted', { name, campaignName});
// };
//
// exports.sendRejectedMail = function(to, name, campaignName) {
//   return sendMail(to, 'rejected', { name, campaignName });
// };
//
// exports.sendResetPasswordMail = function(to, name, password, campaignName) {
//   return sendMail(to, 'reset_password', { name, password, campaignName})
// };
//
// exports.sendReceivedStepMail = function(to, name, stepName, campaignName, location) {
//   return sendMail(to, 'step_received', { name, stepName, campaignName, location });
// };
//
// exports.sendTemplatedMail = function(data, template, subject) {
//   const content = Mustache.render(template.template, data);
//   const renderedSubject = Mustache.render(subject, data);
//   return new Promise((resolve, reject) => {
//     email.send({
//       html: content,
//       message: {
//         to: data.to,
//         html: content,
//         subject: renderedSubject
//       }
//     }).then((response) => { resolve(response); })
//     .catch((error) => { reject(error); });
//   });
// }
//
// exports.sendAcceptedStepMail = function(to, name, stepName, campaignName, location) {
//   return sendMail(to, 'step_accepted', { name, stepName, campaignName, location });
// }
//
// exports.sendRejectedStepMail = function(to, name, stepName, campaignName, location) {
//   return sendMail(to, 'step_rejected', { name, stepName, campaignName, location });
// };
const smtp = require('../smtp');
const TO = require('../settings.json').TESTS.EMAIL;

const data = {
  name: 'Gerard Eulexi',
  campaignName: 'Athens - Class Delta',
  deadline: '2019-06-27T17:32:58.338+00:00',
  location: 'Athens',
  stepName: 'Step 1 - Motivation Letter',
  password: 'aiUIE-VUIE'
};

describe('Emails', function() {
  describe('#sendApplicationMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendApplicationMail(TO, data).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#sendAcceptedMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendAcceptedMail(TO, data).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#sendRejectedMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendRejectedMail(TO, data).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#sendResetPasswordMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendResetPasswordMail(TO, data).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#sendRejectedStepMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendRejectedStepMail(TO, data).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#sendReceivedStepMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendReceivedStepMail(TO, data).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#sendAcceptedStepMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendAcceptedStepMail(TO, data).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});
