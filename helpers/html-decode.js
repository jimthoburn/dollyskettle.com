
// https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript/34064434#34064434
function htmlDecode({ html, DOMParser }) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.documentElement.textContent;
}

export {
  htmlDecode
};
