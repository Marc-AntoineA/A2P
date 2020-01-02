'using strict';

const validator = function(value, { minWords }) {
  const nbWords = value.split(' ');

  if (minWords && nbWords < minWords)
    throw `The answer contains only ${nbWords} and at least ${minWords} are expected.`;
};

module.exports.validator = validator;
