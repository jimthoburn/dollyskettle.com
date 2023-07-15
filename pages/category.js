
import { createElement }  from "preact";
import   htm              from "htm";
const    html = htm.bind(createElement);

import { htmlDecode }   from "../helpers/html-decode.js";
import { normalizeURL } from "../helpers/url.js";
import { getPostImage } from "../helpers/post.js";

function CategoryPage({ title, posts, DOMParser }) {

  return html`
  <header>
    <div class="container">
      <h1>${ title }</h1>
    </div>
  </header>

  <div class="recipe-list">
    <ul>
      ${posts.map(post => {
        const image = getPostImage({ post });
        if (image) {
          return html`
            <li class="has-image">
              <a href="/${ normalizeURL(post.link) }/">
                <img
                  src="${ image.src }"
                  width="${ image.width }"
                  height="${ image.height }"
                  alt=""
                  loading="lazy"
                />
                ${ htmlDecode({ html: post.title.rendered, DOMParser }) }
              </a>
            </li>
          `;
        } else {
          return html`
            <li>
              <a href="/${ normalizeURL(post.link) }/">
                ${ htmlDecode({ html: post.title.rendered, DOMParser }) }
              </a>
            </li>
          `;
        }
      })}
    </ul>
  </div>
  `;

}


export { CategoryPage };

