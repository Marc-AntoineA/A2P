const reminderEmails = require('./reminder_emails.js');

const cron = require('node-cron');

// at midnight on Monday and Thursday
cron.schedule("0 0 * * 1,4",() => {
    const nbDays = 7;
    reminderEmails.sendEmailToInactiveApplicants(nbDays);
})
