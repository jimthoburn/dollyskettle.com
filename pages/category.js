
import { createElement }  from "../web_modules/preact.js";
import   htm              from "../web_modules/htm.js";
const    html = htm.bind(createElement);

import { htmlDecode }   from "../helpers/html-decode.js";
import { normalizeURL } from "../helpers/url.js";
import { getPostImage } from "../helpers/post.js";


function CategoryPage({ title, posts }) {

  return html`
  <header>
    <div class="container">
      <h1>${ title }</h1>
    </div>
  </header>

  <div class="recipe-list">
    <ul>
      ${posts.map(post => {
        // console.log("CategoryPage");
        // console.log(post.title.rendered);
        const image = getPostImage({ post });
        if (image) {
          return html`
            <li class="has-image">
              <a href="/${ normalizeURL(post.link) }/">
                <img src="${ getPostImage({ post }).src }" alt="" />
                ${ htmlDecode(post.title.rendered) }
              </a>
            </li>
          `;
        } else {
          return html`
            <li>
              <a href="/${ normalizeURL(post.link) }/">
                ${ htmlDecode(post.title.rendered) }
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

