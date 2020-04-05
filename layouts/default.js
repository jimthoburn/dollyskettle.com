
import { config } from "../_config.js";

export const DefaultLayout = ({ title, content, openGraphImage }) => {
  return `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
        <title>${ title }</title>

        <link rel="stylesheet" href="/css/shared.css" />

        ${ config.favicon
          ? `<link rel="icon" href="${ config.favicon }" />`
          : ""}

        ${ openGraphImage 
          ? `<meta property="og:image" content="${ openGraphImage }" />`
          : ""}
      </head>
      <body>
        ${ content }
      </body>
    </html>
  `;
};
