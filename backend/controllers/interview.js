'using strict';

const InterviewSlot = require('../models/interviewSlot').model;
const Applicant = require('../models/applicant').model;

exports.getInterviewsByProcessId = (req, res, next) => {
 const processId = req.params.processId;
 InterviewSlot.find({
   "processId": processId
}).then((interviews) => {
   res.status(200).json(interviews);
 });
};

exports.createInterview = (req, res, next) => {
   const body = req.body;
   const itwSlot = new InterviewSlot({
      processId: body.processId,
      begin: body.begin,
      end: body.end,
      supervisorId: body.supervisorId,
      applicantId: undefined
   });
   itwSlot.save().then((itw) => {
      res.status(201).json(itw);
   }).catch((error) => {
      res.status(503).json({
         error: { message: "An unknown error occured while creating the itw slot. Please contact the administrator of this website."}
      });
   });
};

exports.deleteInterview = (req, res, next) => {
  const interviewId = req.params.interviewId;
  InterviewSlot.findOneAndDelete({_id: interviewId})
    .then((interview) => {
      if (!interview) res.status(404).json({error: { message: `Interview ${interviewId} doesn't exist.`}});
      res.status(200).json({
        message: `Interview ${interviewId} deleted successfully`
      });
    }).catch((error) => {
      res.status(500).json({
        error: error
      });
    });
};

exports.deleteInterviewsByProcessIdAndDate = (req, res, next) => {
  const processId = req.params.processId;
  const begin = new Date(req.params.begin);
  const end = new Date(req.params.end);

  console.log(begin);
  console.log(end);
  console.log(processId);
  InterviewSlot.find({
    processId: processId,
    begin: {$gt: begin },
    end: {$lt: end }
  }).then((itws) => {
    console.log(itws);
  });

  InterviewSlot.deleteMany({
    processId: processId,
    begin: {$gt: begin },
    end: {$lt: end }
  }).then(() => {
    res.status(200).json({
      message: `Interviews deleted successfully`
    });
  }).catch((error) => {
    res.status(500).json({
      error: error
    });
  });
};

exports.chooseItwSlot = (req, res, next) => {
  const applicantId = req.params.userId;
  const beginSlot = req.params.beginSlot;

  Applicant.findOne({ _id: applicantId }).then((applicant) => {
    if (!applicant) {
      res.status(404).json({ error: { message: `The applicant ${applicantId} does not exist`}});
      return;
    }

    InterviewSlot.find({
      processId: applicant.process._id,
      begin: new Date(beginSlot)
    }).then((slot) => {
      if (!slot) {
        res.status(404).json({ error: { message: `No itw slots starts on ${beginSlot}`}});
        return;
      }

      if (slot.applicantId) {
        res.status(500).json({ error: { message: `This itw is no more available`}});
      }

      slot.applicantId = applicantId;
      slot.save().then(() => {
        res.status(200).json({
          message: 'This itw slot was successfully selected'
        });
      })
    });
  });
};

exports.listAllAvailableSlots = (req, res, next) => {
  console.log('list all av slots');
  const applicantId = req.params.userId;

  Applicant.findOne({ _id: applicantId }).then((applicant) => {
    if (!applicant) {
      res.status(404).json({ error: { message: `The applicant ${applicantId} does not exist`}});
      return;
    }

    InterviewSlot.find({ processId: applicant.process._id }).then((slots) => {
      const filteredSlots = slots.filter((slot) => slot.applicant === undefined);
      res.status(200).json(slots);
      return;
    });
  });
};
