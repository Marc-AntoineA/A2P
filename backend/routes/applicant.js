'using strict';
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.js')(false);

const applicantCtrl = require('../controllers/applicant');
const processCtrl = require('../controllers/process');

router.get('/', applicantCtrl.getSigninForm);
router.post('/', applicantCtrl.createApplicant);
router.get('/processes', processCtrl.getAllOpenedProcesses);
router.get('/:userId', auth, applicantCtrl.getApplicant);
router.get('/:userId/:step', auth, applicantCtrl.getApplicantStep);
router.put('/:userId/:step/save', auth, applicantCtrl.saveApplicantAnswers);
router.put('/:userId/:step/confirm', auth, applicantCtrl.confirmAndSaveApplicantAnswers)
router.post('/login', applicantCtrl.login);

module.exports = router;
