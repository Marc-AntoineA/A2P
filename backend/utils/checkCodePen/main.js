
const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const codepenWebsite = process.argv[2];
console.log("My codepen website: ", codepenWebsite);

request(codepenWebsite, function(error, response, body) {
  if (error) { console.log("Error"); return; }
  const dom = new JSDOM(body);
  //console.log(dom);
  const textContent = dom.window.document.querySelector('pre#html').querySelector('code').textContent;
  const htmlContent = new JSDOM(textContent);
  console.log(htmlContent);
});
