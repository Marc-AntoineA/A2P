const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/*
    SMALL tool to scrap and evaluate code pen website.
    The rules are defined in 'rules.json', and count if
    any css selector appears enough times in the code.

    It will be integrated into the final platform

    Usage.
      node <code pen website>
*/

const rules = require('./rules.json');

let codepenWebsite = process.argv[2];
const regex = new RegExp('https:\/\/codepen\.io\/(.*)\/((details)|(full)|(pen))\/(.*)');

console.log("Check for codepen: ", codepenWebsite);

if (!regex.test(codepenWebsite)) {
  console.log("Your address is not a valid codepen website");
  process.exit();
}

const penView = codepenWebsite.match(regex)[2];
if (penView !== 'pen') {
  const matches = codepenWebsite.match(regex);
  codepenWebsite = 'https://codepen.io/' + matches[1] + '/pen/' + matches[6];
  console.log("WARNING: the address given was changed to ", codepenWebsite);
}

request(codepenWebsite, function(error, response, body) {
  if (error) { console.log("Error"); return; }
  const dom = new JSDOM(body);
  //console.log(dom);
  const textContent = dom.window.document.querySelector('pre#html').querySelector('code').textContent;
  const htmlContent = new JSDOM(textContent);

  const document = htmlContent.window.document;

  let nbCheckedRules = 0;
  for (let ruleIndex in rules){
    const rule = rules[ruleIndex];
    const nbInCodePen = document.querySelectorAll(rule.cssSelector).length;
    console.log("CSS Selector ", rule.cssSelector, " ", nbInCodePen, " / ", rule.minValue, (nbInCodePen >= rule.minValue ? 'checked' : 'failed'));
    if (nbInCodePen >= rule.minValue) nbCheckedRules += 1;
  }

  console.log("");
  console.log("Nb rules checked ", nbCheckedRules, " / ", rules.length);
});
