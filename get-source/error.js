
import jsBeautify from "js-beautify";

import { render }            from "../web_modules/preact-render-to-string.js";
import { config }            from "../_config.js";
import { Error404Page,
         error404PageTitle } from "../pages/404.js";
import { DefaultLayout }     from "../layouts/default.js";


function getError404HTML() {
  const title   = error404PageTitle;
  const content = render(Error404Page());

  const beautifiedHTML = jsBeautify.html_beautify(DefaultLayout({
    title,
    content,
    includeClientJS: false
  }));

  return beautifiedHTML;
}


export {
  getError404HTML
}

