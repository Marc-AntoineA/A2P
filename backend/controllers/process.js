'use strict';

const Process = require('../models/process').model;

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
    deadline: '2080-01-01T00:00:00.000Z',
    status: 'draft',
    createdAt: today.format(),
    updatedAt: today.format(),
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

exports.updateProcessById = (req, res, next) => {
  const processId = req.params.processId;
  const process = req.body;
  if (processId !== process._id)
    res.status(500).json({ error: { message: `${processId} and ${process._id} are not corresponding` }});

  if (process.status !== 'draft')
    res.status(500).json({ error: { message: `Process ${processId} cannot be modified in status ${process.status}`}});

  const now = moment();
  process.updatedAt = now.format();
  Process.findOneAndUpdate({ _id: processId}, process)
    .then(() => {
      res.status(200).json(process);
    }).catch((error) => {
      res.status(500).json({
        error: error
      });
    });
};

exports.copyProcessById = (req, res, next) => {
  // TODO
};
