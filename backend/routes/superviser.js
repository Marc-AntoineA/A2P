'using strict';
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')(true);

const processCtrl = require('../controllers/process');
const applicantCtrl = require('../controllers/applicant');
const superviserCtrl = require('../controllers/superviser');
const emailsCtrl = require('../controllers/email');

router.get('/processes', auth, processCtrl.getAllProcesses);
router.get('/process/:processId', auth, processCtrl.getProcessById);
router.put('/process/:processId', auth, processCtrl.updateProcessById);
router.put('/open/process/:processId', auth, processCtrl.openProcessById);
router.post('/create/process/', auth, processCtrl.createEmptyProcess);
router.delete('/delete/process/:processId', auth, processCtrl.deleteProcessById);
router.delete('/delete/applicant/:applicantId', auth, applicantCtrl.deleteApplicantById);
router.post('/copy/process/:processId', auth, processCtrl.copyProcessById);

router.get('/applicants/:processId', auth, applicantCtrl.getAllApplicantsByProcessId);
router.get('/applicants/:processId/download', auth, applicantCtrl.getAllApplicantsByProcessIdExcelFile);

router.put('/applicants/:applicantId/status/:status', auth, applicantCtrl.updateStatusByApplicantId);
router.put('/applicants/:applicantId/:stepIndex/mark', auth, applicantCtrl.updateStepMarkByApplicantId);
router.put('/applicants/:applicantId/:stepIndex/status/:status', auth, applicantCtrl.updateStepStatusByApplicantId);

router.get('/emails/:templateId', emailsCtrl.getEmailTemplate); // warning auth

router.post('/signin', auth, superviserCtrl.createSuperviser);
router.post('/login', superviserCtrl.loginSuperviser);

module.exports = router;
