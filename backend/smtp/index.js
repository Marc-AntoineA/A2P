const nodemailer = require('nodemailer');
const Email = require('email-templates');
const EMAIL_SETTINGS = require('../settings.json').EMAIL_SETTINGS;
const Mustache = require('mustache');
const fs = require('fs');

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

exports.sendTemplatedMail = function(to, data, htmlStringTemplate, subject) {
  const content = Mustache.render(htmlStringTemplate, data);
  const renderedSubject = Mustache.render(subject, data);
  return new Promise((resolve, reject) => {
    email.send({
      html: content,
      message: {
        to: to,
        html: content,
        subject: renderedSubject
      }
    }).then((response) => { resolve(response); })
    .catch((error) => { reject(error); });
  });
}

const loadText = function(name, file) {
  return new Promise((resolve, reject) => {
    fs.readFile(`emails/${name}/${file}`, 'utf8', (err, template) => {
      if (err) reject(err);
      resolve(template);
    });
  });
}

const loadTemplate = function(name, template) {
  if (template)
    return new Promise((resolve) => { resolve(template) });
  return loadText(name, 'html.html');
}

const loadSubject = function(name, subject) {
  if (subject)
    return new Promise((resolve) => { resolve(subject) });
  return loadText(name, 'subject.txt');
}

exports.loadAndSendEmail = function(emailName, to, data, template=undefined, subject=undefined) {
  return new Promise((resolve, reject) => {
    Promise.all([loadSubject(emailName, subject), loadTemplate(emailName, template)]).then(([subject, template]) => {
      exports.sendTemplatedMail(to, data, template, subject).then(() => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      });
    });
  });
}

exports.sendApplicationMail = function(to, data, template=undefined, subject=undefined) {
  return exports.loadAndSendEmail('application', to, data, template, subject);
};

exports.sendAcceptedMail = function(to, data, template=undefined, subject=undefined) {
  return exports.loadAndSendEmail('accepted', to, data, template, subject);
};

exports.sendRejectedMail = function(to, data, template=undefined, subject=undefined) {
  return exports.loadAndSendEmail('rejected', to, data, template, subject);
};

exports.sendResetPasswordMail = function(to, data, template=undefined, subject=undefined) {
  return exports.loadAndSendEmail('reset_password', to, data, template, subject);
};

exports.sendReceivedStepMail = function(to, data, template=undefined, subject=undefined) {
  return exports.loadAndSendEmail('step_received', to, data, template, subject);
};

exports.sendAcceptedStepMail = function(to, data, template=undefined, subject=undefined) {
  return exports.loadAndSendEmail('step_accepted', to, data, template, subject);
};

exports.sendRejectedStepMail = function(to, data, template=undefined, subject=undefined) {
  return exports.loadAndSendEmail('step_rejected', to, data, template, subject);
};
