'use strict';

const Process = require('../models/process').model;

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
    res.status(500).json({ error: error });
  })
  console.log('getProcessById', processId);
}
