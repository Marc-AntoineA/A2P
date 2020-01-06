'using strict'

const minWords = require('./minWords.js').validator;
const codepen = require('./codepen.js').validator;

const validators = {
  "MIN_WORDS": {
    "function": minWords,
    "label": "Minimum Words",
    "description": "Check if the answer contains more than a given number of words",
    "example": "{ \"minWords\": 200 }"
  },
  "CODE_PEN": {
    "function": codepen,
    "label": "Code pen",
    "description": "Check if the url is a valid codepen website and check if the website is complete accordingly to options (broken on codepenside)",
    "example": "[{\
      \"type\": \"cssSelector\",\
      \"value\": \"p\",\
      \"expected\": 3,\
      \"language\": \"html\",\
      \"description\": \"Some paragraphs (<p></p>)\"\
    },\
    {\
      \"type\": \"regex\",\
      \"value\": \"href ?= ?(\\\"|')http\",\
      \"expected\": 3,\
      \"language\": \"html\",\
      \"description\": \"Some links to other websites\"\
    }]"
  }
};

module.exports.validators = validators;
