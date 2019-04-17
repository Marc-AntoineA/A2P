const nodemailer = require('nodemailer');
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

export function sendMail(mail) {
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
