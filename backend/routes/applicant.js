'using strict';
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.js');

const applicantCtrl = require('../controllers/applicant');

router.get('/', applicantCtrl.getSigninForm);
router.post('/', applicantCtrl.createApplicant);
router.get('/:userId', auth, applicantCtrl.getApplicant);
router.get('/:userId/:step', auth, applicantCtrl.getApplicantStep);
router.put('/:userId/:step', auth, applicantCtrl.editApplicantStep);
router.post('/login', applicantCtrl.login);

module.exports = router;
