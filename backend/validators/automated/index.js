'using strict'

const minWords = require('./minWords.js').validator;

const validators = {
  "MIN_WORDS": {
    "function": minWords,
    "label": "Minimum Words",
    "description": "Check if the answer contains more than a given number of words",
    "option": "e.g. { minWords: 200 }"
  }
};

module.exports.validators = validators;
