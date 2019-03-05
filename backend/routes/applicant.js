'using strict';
const express = require('express');
const router = express.Router();

const applicantCtrl = require('../controllers/applicant');

router.post('/', applicantCtrl.createApplicant);
router.get('/signin-form', applicantCtrl.getSigninForm);
router.get('/:id', applicantCtrl.getApplicantProcess);
router.put('/:id', applicantCtrl.modifyApplicantProcess);

module.exports = router;
