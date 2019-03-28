'using strict';
const express = require('express');
const router = express.Router();

const processCtrl = require('../controllers/process');
const applicantCtrl = require('../controllers/applicant');
const superviserCtrl = require('../controllers/superviser');

router.get('/processes', processCtrl.getAllProcesses);
router.post('/signin', superviserCtrl.createSuperviser);
router.post('/login', superviserCtrl.loginSuperviser);

module.exports = router;
