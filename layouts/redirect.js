
import { config } from "../_config.js";

// 📚 SHIM: Behaves just like the default template string. This is just so we can use html`` for color coding
const html = (...theArgs) => theArgs.shift().map(string => string + (theArgs.shift() || "")).join("");

export const RedirectLayout = ({ url }) => {
  return html`
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
        <title>This page has moved</title>
        
        <meta http-equiv="refresh" content="0; url=${ url }" />

        ${ config.host 
          ? html`<link rel="canonical" href="${ config.host }${ url }" />`
          : ""}

      </head>
      <body>
        <h1>This page has moved</h1>
        <p>This page has moved to a new location:<br /><a href="${ url }">${ url }</a>.</p>
      </body>
    </html>
  `;
};
