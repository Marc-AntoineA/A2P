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

    InterviewSlot.findOne({ applicantId: applicantId }).then((itwSlot) => {
      if (itwSlot) {
        res.status(500).json({ error: { message: `The applicant ${applicantId} has already selected a slot`}});
        return;
      }

      InterviewSlot.findOne({
        processId: applicant.process._id,
        begin: new Date(beginSlot)
      }).then((slot) => {
        if (!slot) {
          res.status(404).json({ error: { message: `No itw slots starts on ${beginSlot}`}});
          return;
        }

        if (slot.applicantId) {
          res.status(500).json({ error: { message: `This itw is no more available`}});
          return;
        }

        InterviewSlot.updateOne({ _id: slot._id}, { 'applicantId': applicantId }).then((x) => {
          res.status(200).json({
            message: 'This itw slot was successfully selected'
          });
        }).catch((error) => {
          res.status(500).json({ error: { message: `Error while selected slot`}});
        });
      });

    });
  });
};

exports.listAllAvailableSlots = (req, res, next) => {
  const applicantId = req.params.userId;

  Applicant.findOne({ _id: applicantId }).then((applicant) => {
    if (!applicant) {
      res.status(404).json({ error: { message: `The applicant ${applicantId} does not exist`}});
      return;
    }

    InterviewSlot.find({ processId: applicant.process._id, begin: {$gt: new Date() }}).then((slots) => {
      const filteredSlots = slots.filter((slot) => {
        return !slot.applicantId;
      });
      res.status(200).json(filteredSlots);
      return;
    });
  });
};

exports.getSelectedSlot = (req, res, next) => {
  InterviewSlot.findOne({ applicantId: req.params.userId }).then((slot) => {
    res.status(200).json(slot);
  });
};

exports.updateInterview = (req, res, next) => {
  const sentSlot = req.body;

  InterviewSlot.findOne({ _id: sentSlot._id }).then((slot) => {
    if (!slot) {
      res.status(404).json({ error: { message: `The slot ${sentSlot._id} does not exist`}});
      return;
    }

    InterviewSlot.find({ _id: { $ne: sentSlot._id }, applicantId: sentSlot.applicantId }).then((slots) => {
      if (sentSlot.applicantId && slots.length > 0) {
        res.status(500).json({ error: { message: `The applicant ${sentSlot.applicantId} has already selected a slot (on ${slots[0].begin})` }});
        return;
      }
      if (!sentSlot.applicantId) {
        sentSlot.$unset = { applicantId: '' }
      }

      InterviewSlot.updateOne({ _id: sentSlot._id}, sentSlot).then((x) => {
        sentSlot.$unset = undefined;
        res.status(200).json(sentSlot);
      }).catch((error) => {
        res.status(500).json({ error: { message: error.toString() }});
      });
    });
  }).catch((error) => {
    res.status(500).json({ error: { message: error.toString() }});
  });
};
