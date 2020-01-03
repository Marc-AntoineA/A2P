'using strict';

const validator = function(value, { minWords }) {
  const nbWords = value.split(' ').length;
  console.log('options', minWords);
  console.log('inside validator for value', value);
  console.log(nbWords, minWords);
  console.log(nbWords < minWords);
  if (minWords && nbWords < minWords) {
    console.log('throw');
    throw `The answer contains only ${nbWords} word(s) and at least ${minWords} word(s) are expected.`;
  }
};

module.exports.validator = validator;
