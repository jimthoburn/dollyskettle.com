
import { createElement }  from "preact";
import   htm              from "htm";
const    html = htm.bind(createElement);

import { normalizeURL }   from "../helpers/url.js";

import { prepareImagesForLoading } from "../helpers/html-images.js";

import { PageHeader }     from "../components/page-header.js";


function DefaultPage({ page, DOMParser }) {
  return html`
    <article>

      <${PageHeader} page="${page}" DOMParser="${DOMParser}" />

      <div class="body"
        dangerouslySetInnerHTML=${
          { __html: prepareImagesForLoading({ html: page.content.rendered, DOMParser }) }
        }>
      </div>

    </article>
  `;
}


export { DefaultPage };

