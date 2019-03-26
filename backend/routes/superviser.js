'using strict';
const express = require('express');
const router = express.Router();

const processCtrl = require('../controllers/process');
const applicantCtrl = require('../controllers/applicant');

router.get('/processes', processCtrl.getAllProcesses);

module.exports = router;
