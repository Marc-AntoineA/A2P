'using strict'

const { validators } = require('../validators/automated');

exports.listAllValidators = (req, res, next) => {
  res.status(200).json(validators);
};
