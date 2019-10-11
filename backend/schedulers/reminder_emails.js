const Applicant = require('../models/applicant').model;

const moment = require('moment');

// const getInactiveApplicants = function(nbDays=5) {
//   const today = moment.now();
//   const lastUpdateDeadline = today - moment.days()
//   Process.find({
//     updated_at: {$lt : today},
//     status: 'open'
//   }).then((processes) => {
//     const campaigns = processes.map(p => ({
//
// }
