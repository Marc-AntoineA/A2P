const Process = require('../models/process').model;


exports.getAllProcesses = (req, res, next) => {
  Process.find().then((processes) => {
    res.status(200).json(processes);
  });
};
