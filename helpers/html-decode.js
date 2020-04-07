
// https://stackoverflow.com/questions/11398419/trying-to-use-the-domparser-with-node-js#answer-54096238
import jsdom from "jsdom";
const { JSDOM } = jsdom;
// global.DOMParser = new JSDOM().window.DOMParser;
const DOMParser = new JSDOM().window.DOMParser;

// https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript/34064434#34064434
function htmlDecode(input) {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

export {
  htmlDecode
};
