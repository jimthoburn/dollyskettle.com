
import { createElement }  from "../web_modules/preact.js";
import   htm              from "../web_modules/htm.js";
const    html = htm.bind(createElement);

import { getFormattedDate } from "../helpers/post.js";


function PageHeader({ page }) {

  return html`
    <header>
      <div class="container">
        <h1 dangerouslySetInnerHTML=${ { __html: page.title.rendered } }></h1>
        <p class="meta">Published on ${ getFormattedDate({ date: page.date_gmt }) }</p>
      </div>
    </header>
  `;
}


export { PageHeader };

