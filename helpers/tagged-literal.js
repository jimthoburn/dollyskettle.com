
// 📚 SHIM: Behaves just like a template literal–it simply concatenates the parameters.
//          This is just so we can use html`` for color coding, outside of Preact + htm.
export const taggedLiteral = (...theParameters) => theParameters.shift().map(string => string + (theParameters.shift() || "")).join("");
