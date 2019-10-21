const assert = require('assert');

const smtp = require('../smtp');
const TO = require('../settings.json').TESTS.EMAIL;

const applicant = {
  name: 'Gerard Eulexi',
  updatedAt: '2019-06-27T17:32:58.338+00:00',
  process: {
    label: 'Athens - Class Delta',
    location: 'Athens',
    deadline: '2019-06-27T17:32:58.338+00:00'
  }
};

const password = 'AIEtd89-IUEv--+uie9897'
const step = {
  label: 'Step 1 - Motivation Letter'
}

describe('Emails', function() {
  describe('#sendApplicationMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendApplicationMail(TO, { applicant }).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#sendAcceptedMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendAcceptedMail(TO, { applicant }).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#sendRejectedMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendRejectedMail(TO, { applicant }).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#sendResetPasswordMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendResetPasswordMail(TO, { applicant, password }).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#sendRejectedStepMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendRejectedStepMail(TO, { applicant, step }).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#sendReceivedStepMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendReceivedStepMail(TO, { applicant, step }).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#sendAcceptedStepMail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.sendAcceptedStepMail(TO, { applicant, step }).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#sendReminderEmail()', function() {
    it('Should return true and send the email', function(done) {
      smtp.loadAndSendEmail('reminder', TO, { applicant }).then(()=> {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});
