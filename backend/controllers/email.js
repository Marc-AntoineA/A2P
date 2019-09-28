'use strict'

const EMAILS_PATH = 'emails/';

const fs = require('fs');
const path = require('path');

exports.getEmailTemplate = (req, res, next) => {
  const templateId = req.params.templateId;

  const filePath = path.join(__dirname, `../emails/${templateId}/html.html`);

  fs.readFile(filePath, 'utf8', (error, data) => {
    if (error) {
      res.status(500).json({ error: error });
      return;
    }
    res.status(200).json({ template: data, language: 'html', help: '#{name}, #{stepName}, etc.' });
  });
};
