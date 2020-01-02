'using strict';
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.js')(false);

const applicantCtrl = require('../controllers/applicant');
const processCtrl = require('../controllers/process');
const itwCtrl = require('../controllers/interview');

router.get('/', applicantCtrl.getSigninForm);
router.post('/', applicantCtrl.createApplicant);
router.get('/processes', processCtrl.getAllOpenedProcesses);
router.put('/archive/:applicantId/:value', auth, applicantCtrl.updateArchivedByApplicantId);
router.get('/slot/:userId', auth, itwCtrl.getSelectedSlot);
router.get('/slot/:userId/available', auth, itwCtrl.listAllAvailableSlots);
router.put('/slot/:userId/:beginSlot', auth, itwCtrl.chooseItwSlot);
router.get('/:userId', auth, applicantCtrl.getApplicant);
router.get('/:userId/:step', auth, applicantCtrl.getApplicantStep);
router.put('/:userId/:step/save', auth, applicantCtrl.saveApplicantAnswers);
router.put('/:userId/:step/confirm', auth, applicantCtrl.confirmAndSaveApplicantAnswers);

router.post('/login', applicantCtrl.login);
router.post('/reset', applicantCtrl.resetPassword);

module.exports = router;
