
import { createElement }  from "preact";
import   htm              from "htm";
const    html = htm.bind(createElement);

import { getFormattedDate } from "../helpers/post.js";
import { htmlDecode } from "../helpers/html-decode.js";

function PageHeader({ page, DOMParser }) {
  return html`
    <header>
      <div class="container">
        <h1>${ htmlDecode({ html: page.title.rendered, DOMParser }) }</h1>
        <p class="meta">Published on ${ getFormattedDate({ date: page.date }) }</p>
      </div>
    </header>
  `;
}


export { PageHeader };

