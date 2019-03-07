'using strict';

module.exports.validateMail = function(value) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
};

module.exports.validatePhone = function(value) {
  return /^\+\d{11}$/.test(value);
};

module.exports.validateStatus = function(value) {
  return /^pending|rejected|accepted$/.test(value);
};
