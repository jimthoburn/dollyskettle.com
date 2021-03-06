
import { createElement }  from "../web_modules/preact.js";
import   htm              from "../web_modules/htm.js";
const    html = htm.bind(createElement);

import { sanitize }                from "../helpers/sanitize.js";
import { htmlDecode }              from "../helpers/html-decode.js";
import { normalizeURL }            from "../helpers/url.js";
import { getBackgroundImage,
         getNormalizedCategories } from "../helpers/post.js";

import { PageHeader }              from "../components/page-header.js";


function PostPage({ post }) {

  const backgroundImage = getBackgroundImage({ post });
  const categories = getNormalizedCategories({ post });

  return html`
    ${ backgroundImage && backgroundImage.width > 1000 && backgroundImage.height > 1000
      ? html`<div class="background-image"><img src="${ backgroundImage.src }" alt="" width="700" /></div>`
      : ""}

    <article style="--headline-color: ${ post["Headline Color"] || "unset" };">

      <${PageHeader} page="${post}" />

      <div class="body"
        dangerouslySetInnerHTML=${
          { __html: sanitize(post.content.rendered) }
        }>
      </div>

      <footer>
        ${ categories && categories.length
          ? html`
            <p class="meta">
              Filed under: ${
                categories.map((category, index) =>
                  html`
                    <a href="${ category.url }">${ category.title }</a>
                    ${ index != categories.length - 1 ? ", " : "" }
                  `
                )
              }
            </p>`
          : ""}

        ${ post.next || post.previous
          ? html`
            <ul>
              ${ post.next
                ? html`
                    <li class="next">
                      <span>Next: </span>
                      <a href="/${ normalizeURL(post.next.link) }/">
                        ${ htmlDecode(post.next.title.rendered) }
                      </a>
                    </li>`
                : ""}
              ${ post.previous
                ? html`
                    <li class="previous">
                      <span>Previous: </span>
                      <a href="/${ normalizeURL(post.previous.link) }/">
                        ${ htmlDecode(post.previous.title.rendered) }
                      </a>
                    </li>`
                : ""}
            </ul>`
          : ""}
        
      </footer>
    </article>
  `;
}


export { PostPage };

