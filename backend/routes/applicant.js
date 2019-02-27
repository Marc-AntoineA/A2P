'using strict';
const express = require('express');
const router = express.Router();

const applicantCtrl = require('../controllers/applicant');

router.post('/:campaign', applicantCtrl.createApplicant);
router.get('/:id/process', applicantCtrl.getApplicantProcess);
router.put('/:id/process', applicantCtrl.modifyApplicantProcess);

module.exports = router;
