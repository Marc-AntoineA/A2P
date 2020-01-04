const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/*
    Small validator to check if a codepen website has the good url.
    The rules are of two different types:

    {
      "type": "cssSelector",
      "value": "p",
      "expected": 3,
      "language": "html",
      "description": "Some paragraphs (<p></p>)"
    },
    {
      "type": "regex",
      "value": "href ?= ?(\"|')http",
      "expected": 3,
      "language": "html",
      "description": "Some links to other websites"
    }
    They can check if css selectors/portion of code are appearing enough times in the code.

*/

function checkRuleValidity(rule) {
  const language = rule.language;
  const type = rule.type;
  if (language != 'css' && language != 'html') throw `language ${language} is not defined`;
  if (type != 'regex' && type != 'cssSelector') throw `css ${type} is not defined`;
}

const validator = function(codepenWebsite, rules) {
  return new Promise((resolve, reject) => {
    const regex = new RegExp('https:\/\/codepen\.io\/(.*)\/((details)|(full)|(pen)|(live))\/(.*)');

    if (!regex.test(codepenWebsite)) {
      reject(`The address ${codepenWebsite} is not a valid code pen website. It should be something like "https://codepen.io/yourpseudo/pen/xxx"`);
    }

    const penView = codepenWebsite.match(regex)[2];
    if (penView !== 'pen') {
      const matches = codepenWebsite.match(regex);
      codepenWebsite = 'https://codepen.io/' + matches[1] + '/pen/' + matches[7];
    }

    resolve();
    return;
    // It's impossible, for now, to request with a robot a codepen website...
    request(codepenWebsite, function(error, response, body) {
      if (error) throw 'Error while requesting the codepen website. Please inform an admnistrator.';
      const dom = new JSDOM(body);
      let htmlTextContent; let cssTextContent; let htmlDocument; let htmlContent;
      try {
        htmlTextContent = dom.window.document.querySelector('pre#html').querySelector('code').textContent;
        cssTextContent = dom.window.document.querySelector('pre#css').querySelector('code').textContent;
        htmlContent = new JSDOM(htmlTextContent);
        htmlDocument = htmlContent.window.document;
      } catch (error) {
        reject('Error while analyzing the codepen website. Please inform an administrator and send him the following error ' + error.toString());
      }

      let nbCheckedRules = 0;
      const rulesLog = [];
      for (let ruleIndex in rules){
        const rule = rules[ruleIndex];
        try {
          checkRuleValidity(rule);
        } catch (error) {
          reject('Error with option. Please inform an administrator: ' + error.toString());
        }

        const type = rule.type;
        const language = rule.language;
        const value = rule.value;

        let nbInCodepen = 0;
        if (type == "regex") {
          const content = language == 'html' ? htmlTextContent : cssTextContent;
          const regex = new RegExp(value, 'g');
          content.replace(regex, function(m) {
            nbInCodepen++;
          });
        } else {
          const content = htmlDocument;
          nbInCodepen = content.querySelectorAll(value).length;
        }

        const nbInCodePen = htmlDocument.querySelectorAll(rule.cssSelector).length;
        ruleslog.push({
          "description": rule.description,
          "expected": rule.expected,
          "done": nbInCodePen
        });
        if (nbInCodepen >= rule.expected) nbCheckedRules += 1;
      }

      if (nbCheckedRules < rules.length) {
        let errorMessage = `Your website respects ${nbCheckedRules} out of ${rules.length}. You have to fix the followings errors:<ul>`;
        for (let k=0; k<rulesLog.length; k++) {
          errorMessage += `<li>"${rulesLog[k].description}", only <strong>${rulesLog[k].done}</strong> out of <strong>${rulesLog[k].expected}</strong>`;
        }
        errorMessage += "</ul>"
        reject(errorMessage);
      }
      resolve();
    });
  });
}

module.exports.validator = validator;
