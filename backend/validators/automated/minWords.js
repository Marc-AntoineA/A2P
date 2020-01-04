'using strict';

const validator = function(value, { minWords }) {
  return new Promise((resolve, reject) => {
    const nbWords = value.split(' ').length;
    if (minWords && nbWords < minWords) {
      reject(`The answer contains only ${nbWords} word(s) and at least ${minWords} word(s) are expected.`);
    }
    resolve();   
  });
};

module.exports.validator = validator;
