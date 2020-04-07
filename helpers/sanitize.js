
import createDOMPurify from "dompurify";
import jsdom           from "jsdom";
const { JSDOM } = jsdom;
 
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

function sanitize(string) {
  return DOMPurify.sanitize(string);
}

export {
  sanitize
};
