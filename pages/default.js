
import { createElement }  from "../web_modules/preact.js";
import   htm              from "../web_modules/htm.js";
const    html = htm.bind(createElement);

import { normalizeURL }   from "../helpers/url.js";

import { PageHeader }     from "../components/page-header.js";


function DefaultPage({ page, DOMParser }) {
  return html`
    <article>

      <${PageHeader} page="${page}" DOMParser="${DOMParser}" />

      <div class="body"
        dangerouslySetInnerHTML=${
          { __html: page.content.rendered }
        }>
      </div>

    </article>
  `;
}


export { DefaultPage };

