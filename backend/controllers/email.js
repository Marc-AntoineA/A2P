'use strict'

const EMAILS_PATH = 'emails/';

const fs = require('fs');
const path = require('path');

exports.getEmailTemplate = (req, res, next) => {
  const templateId = req.params.templateId;

  const filePath = path.join(__dirname, `../emails/${templateId}/`);

  fs.readFile(filePath + 'subject.txt', 'utf8', (error, subject) => {
    fs.readFile(filePath + 'html.html', 'utf8', (error, template) => {
      if (error) {
        res.status(500).json({ error: error });
        return;
      }
      res.status(200).json({ template: template, language: 'html', subject: subject });
    });
  });
};

exports.saveEmailTemplate = (req, res, next) => {
  const templateId = req.params.templateId;
  const filePath = path.join(__dirname, `../emails/${templateId}/`);

  const template = req.body.template;

  try {
    fs.writeFileSync(filePath + 'subject.txt', template.subject, 'utf8');
    fs.writeFileSync(filePath + 'html.html', template.template, 'utf8');
    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ error: error });
  }

}
