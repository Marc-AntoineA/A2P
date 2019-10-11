'use strict';

const Process = require('../models/process').model;
const Applicant = require('../models/applicant').model;

const moment = require('moment');

exports.getAllProcesses = (req, res, next) => {
  Process.find().then((processes) => {
    res.status(200).json(processes);
  }).catch((error) => {
    res.status(500).json({ error: error });
  })
};

exports.getProcessById = (req, res, next) => {
  const processId = req.params.processId;
  Process.findOne({ _id: processId }).then((process) => {
    if (!process) res.status(404).json({ error: { message: `Process ${processId} doesn't exist`}});
    res.status(200).json(process);
  }).catch((error) => {
    res.status(404).json({ error: error });
  });
};

exports.createEmptyProcess = (req, res, next) => {
  const today = moment();
  const process = new Process({
    label: 'New process',
    location: 'Choose location',
    deadline: '2025-01-01T00:00:00.000Z',
    status: 'draft',
    steps: []
  });

  process.save().then(() => {
    res.status(201).json(process);
  }).catch((error) => {
    res.status(500).json({
      error: error
    });
  });
};

exports.copyProcessById = (req, res, next) => {
  const processId = req.params.processId;

  Process.findOne({ _id: processId })
  .then((process) => {
    if (!process) res.status(404).json({ error: { message: `Process ${processId} doesn't exist`}});
    const processSchema = process.toObject();
    delete processSchema._id;
    processSchema.status = 'draft';
    processSchema.deadline = '2020-01-01T00:00:00.000Z';
    processSchema.label = 'Copy of ' + processSchema.label;
    const copy = new Process (processSchema);
    copy.save().then(() => {
      res.status(201).json(copy);
    }).catch((error) => {
      res.status(500).json({
        error: error
      });
    });
  }).catch((error) => {
    res.status(500).json({
      error: error
    });
  });
  const today = moment();
};


// TODO remove associated applicants?
// Add check on status process: only draft or closed can be deleted
exports.deleteProcessById = (req, res, next) => {
  const processId = req.params.processId;
  Process.findOneAndDelete({_id: processId})
    .then((process) => {
      if (!process) res.status(404).json({error: { message: `process ${processId} doesn't exist.`}});
      console.log(process);
      res.status(200).json({
        message: `Process ${processId} deleted successfully`
      });
    }).catch((error) => {
      res.status(500).json({
        error: error
      });
    });
};

const updateOpenedProcessById = (req, res, next) => {
  const processId = req.params.processId;
  const process = req.body;
  Process.findOne({ _id: processId }).then((oldProcess) => {
    if (oldProcess.status !== process.status) {
      res.status(500).json({ error: { message: `Status of process ${processId} cannot be modified in status ${process.status}`}});
      return;
    }
    if (JSON.stringify(oldProcess.steps) != JSON.stringify(process.steps)) {
      res.status(500).json({ error: { message: `Steps of process ${processId} cannot be edited in status open`}});
      return;
    }

    Process.findOneAndUpdate({ _id: processId}, process).then(() => {
      Applicant.find({
        "process._id": processId
      }).then((applicants) => {
        applicants.forEach((applicant) => {
          applicant.process.deadline = process.deadline;
          applicant.process.label = process.label;
          applicant.process.location = process.location;
        });
        const poolPromises = applicants.map((applicant) => {
          return applicant.save();
        });
        Promise.all(poolPromises).then(() => {
          res.status(200).json(process);
        }).catch((error) => {
          res.status(500).json({
            error: error
          });
        });
      });
    }).catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error
      });
    });
  });
}

exports.updateProcessById = (req, res, next) => {
  const processId = req.params.processId;
  const process = req.body;
  if (processId !== process._id) {
    res.status(500).json({ error: { message: `${processId} and ${process._id} are not corresponding` }});
    return;
  }

  if (process.status === 'open') {
    updateOpenedProcessById(req, res, next);
    return;
  }

  if (process.status !== 'draft') {
    res.status(500).json({ error: { message: `Process ${processId} cannot be modified in status ${process.status}`}});
    return;
  }

  Process.findOne({ _id: processId}).then((oldProcess) => {
    if (oldProcess.status !== process.status) {
      res.status(500).json({ error: { message: `Status of process ${processId} cannot be edited by this function `}});
      return;
    }
    Process.findOneAndUpdate({ _id: processId}, process)
    .then(() => {
      res.status(200).json(process);
    }).catch((error) => {
      res.status(500).json({
        error: error
      });
    });
  })
};

exports.openProcessById = (req, res, next) => {
  const processId = req.params.processId;
  Process.findOne({ _id: processId }).then((process) => {
    if (!process) res.status(404).json({error: { message: `process ${processId} doesn't exist.`}});
    if (process.status !== 'draft')
      res.status(500).json(
        { error: { message: `Process ${processId} is in status ${process.status} and cannot be opened`}});

    Process.updateOne({ _id: processId }, { status: 'open'})
    .then(() => {
      res.status(200).json(process);
    }).catch((error) => {
      res.status(500).json({error: error});
    })
  }).catch((error) => {
    res.status(500).json({
      error: error
    });
  });
}

exports.getAllOpenedProcesses = (req, res, next) => {
  const today = new Date();
  Process.find({
    deadline: {$gt : today },
    status: 'open'
  }).then((processes) => {
    const campaigns = processes.map(p => ({
      label: p.label,
      deadline: p.deadline,
      location: p.location
    }));
    res.status(201).json(processes);
  }).catch((error) => {
    res.status(500).json({ error: error });
  });
};
