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

exports.copyProcessById = (req, res, next) => {
  // TODO
};
