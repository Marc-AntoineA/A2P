'using strict';
const express = require('express');
const router = express.Router();

const applicantCtrl = require('../controllers/applicant');

router.get('/', applicantCtrl.getSigninForm);
router.post('/', applicantCtrl.createApplicant);
router.get('/:id', applicantCtrl.getApplicant);
router.get('/:id/:step', applicantCtrl.getApplicantStep);
router.put('/:id/:step', applicantCtrl.editApplicantStep);
router.post('/login', applicantCtrl.login);

module.exports = router;
