const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/*
    SMALL tool to scrap and evaluate code pen website.
    The rules are defined in 'rules.json', and count if
    any css selector appears enough times in the code.

    It will be integrated into the final platform

    Usage.
      node main.js <code pen website>

    Test
      node main.js https://codepen.io/marc-antoinea/pen/qggWPP
*/

const rules = require('./rules.json');

function checkRuleValidity(rule) {
  const language = rule.language;
  const type = rule.type;
  if (language != 'css' && language != 'html') throw `language ${language} is not defined`;
  if (type != 'regex' && type != 'cssSelector') throw `css ${type} is not defined`;
}


let codepenWebsite = process.argv[2];
const regex = new RegExp('https:\/\/codepen\.io\/(.*)\/((details)|(full)|(pen)|(live))\/(.*)');

console.log("Check for codepen: ", codepenWebsite);

if (!regex.test(codepenWebsite)) {
  console.log("Your address is not a valid codepen website");
  process.exit();
}

const penView = codepenWebsite.match(regex)[2];
if (penView !== 'pen') {
  const matches = codepenWebsite.match(regex);
  codepenWebsite = 'https://codepen.io/' + matches[1] + '/pen/' + matches[7];
  console.log("WARNING: the address given was changed to ", codepenWebsite);
}

request(codepenWebsite, function(error, response, body) {
  if (error) { console.log("Error"); return; }
  const dom = new JSDOM(body);

  const htmlTextContent = dom.window.document.querySelector('pre#html').querySelector('code').textContent;
  const cssTextContent = dom.window.document.querySelector('pre#css').querySelector('code').textContent;
  const htmlContent = new JSDOM(htmlTextContent);
  const htmlDocument = htmlContent.window.document;

  let nbCheckedRules = 0;
  for (let ruleIndex in rules){
    const rule = rules[ruleIndex];
    checkRuleValidity(rule);
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
    console.log(`${language} ${type} ${value} ${nbInCodepen} / ${rule.expected} ${nbInCodepen >= rule.expected ? 'checked' : 'failed'}`);
    if (nbInCodepen >= rule.expected) nbCheckedRules += 1;
  }

  console.log("");
  console.log("Nb rules checked ", nbCheckedRules, " / ", rules.length);
});
