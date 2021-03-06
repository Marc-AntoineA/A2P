'using strict';
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')(true);

const processCtrl = require('../controllers/process');
const applicantCtrl = require('../controllers/applicant');
const superviserCtrl = require('../controllers/superviser');
const emailsCtrl = require('../controllers/email');
const interviewCtrl = require('../controllers/interview');
const validatorCtrl = require('../controllers/validator');

router.get('/processes', auth, processCtrl.getAllProcesses);
router.get('/process/:processId', auth, processCtrl.getProcessById);
router.put('/process/:processId', auth, processCtrl.updateProcessById);
router.put('/open/process/:processId', auth, processCtrl.openProcessById);
router.post('/create/process/', auth, processCtrl.createEmptyProcess);
router.delete('/delete/process/:processId', auth, processCtrl.deleteProcessById);
router.delete('/delete/applicant/:applicantId', auth, applicantCtrl.deleteApplicantById);
router.post('/copy/process/:processId', auth, processCtrl.copyProcessById);

router.get('/list/applicants/lasts', auth, applicantCtrl.getLasts10Applicants);
router.get('/list/applicants/pending', auth, applicantCtrl.getAllPendingApplicants);
router.get('/applicants/:processId', auth, applicantCtrl.getAllApplicantsByProcessId);
router.get('/applicants/:processId/download', auth, applicantCtrl.getAllApplicantsByProcessIdExcelFile);

router.put('/applicants/:applicantId/archived/:value', auth, applicantCtrl.updateArchivedByApplicantId);
router.put('/applicants/:applicantId/status/:status', auth, applicantCtrl.updateStatusByApplicantId);
router.put('/applicants/:applicantId/:stepIndex/mark', auth, applicantCtrl.updateStepMarkByApplicantId);
router.put('/applicants/:applicantId/:stepIndex/status/:status', auth, applicantCtrl.updateStepStatusByApplicantId);

router.get('/emails/:templateId', auth, emailsCtrl.getEmailTemplate);
router.put('/emails/:templateId', auth, emailsCtrl.saveEmailTemplate);

router.post('/interviews/create', auth, interviewCtrl.createInterview);
router.put('/interviews/update', auth, interviewCtrl.updateInterview);
router.delete('/interviews/delete/:interviewId', auth, interviewCtrl.deleteInterview);
router.delete('/interviews/delete/:processId/:begin/:end', auth, interviewCtrl.deleteInterviewsByProcessIdAndDate);
router.get('/interviews/:processId', auth, interviewCtrl.getInterviewsByProcessId);

router.get('/validators/', auth, validatorCtrl.listAllValidators);

router.post('/signin', auth, superviserCtrl.createSuperviser);
router.post('/login', superviserCtrl.loginSuperviser);

module.exports = router;
