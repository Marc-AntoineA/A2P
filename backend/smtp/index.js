const nodemailer = require('nodemailer');
const Email = require('email-templates');
const EMAIL_SETTINGS = require('../settings.json').EMAIL_SETTINGS;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: EMAIL_SETTINGS.EMAIL,
        clientId: EMAIL_SETTINGS.CLIENT_ID,
        clientSecret: EMAIL_SETTINGS.CLIENT_SECRET,
        refreshToken: EMAIL_SETTINGS.REFRESH_TOKEN,
        accessToken: EMAIL_SETTINGS.ACCESS_TOKEN,
        expires: 1484314697598
    }
});

const email = new Email({
  message: {
    from: EMAIL_SETTINGS.EMAIL
  },
  transport: transporter,
  send: true
});

function sendMail(to, template, locals) {
  return new Promise((resolve, reject) => {
    email.send({
      template: template,
      message: {
        to: to
      },
      locals: locals
    }).then((response) => { resolve(response); })
    .catch((error) => { reject(error); });
  });
}

exports.sendApplicationMail = function(to, name, deadline, location) {
  return sendMail(to, 'application', { name, deadline, location });
};

exports.sendAcceptedMail = function(to, name, campaignName) {
  return sendMail(to, 'accepted', { name, campaignName});
};

exports.sendRejectedMail = function(to, name, campaignName) {
  return sendMail(to, 'rejected', { name, campaignName });
};

exports.sendResetPasswordMail = function(to, name, password, campaignName) {
  return sendMail(to, 'reset_password', { name, password, campaignName})
};

exports.sendReceivedStepMail = function(to, name, stepName, campaignName, location) {
  return sendMail(to, 'step_received', { name, stepName, campaignName, location });
};

exports.sendAcceptedStepMail = function(to, name, stepName, campaignName, location) {
  return sendMail(to, 'step_accepted', { name, stepName, campaignName, location });
}

exports.sendRejectedStepMail = function(to, name, stepName, campaignName, location) {
  return sendMail(to, 'step_rejected', { name, stepName, campaignName, location });
};
