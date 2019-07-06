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
  transport: transporter
});

exports.sendMail = function(mail) {
  return new Promise((resolve, reject) => {
    mail.from = EMAIL_SETTINGS.EMAIL;
    transporter.sendMail(mail, (error, info) => {
      if (error)
        reject(error);
      else
        resolve(info);
    })
  });
}

exports.sendApplicationEmail = function(to, name, deadline, location) {
  return new Promise((resolve, reject) => {
    email.send({
      template: 'application',
      message: {
        to: to,
        from: EMAIL_SETTINGS.EMAIL
      },
      locals: {
        name: name,
        deadline: deadline
      }
    }).then((response) => { resolve(response); })
    .catch((error) => { reject(error); });
  });
}
