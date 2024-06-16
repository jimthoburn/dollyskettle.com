
import { createElement }  from "preact";
import   htm              from "htm";
const    html = htm.bind(createElement);

import { htmlDecode }   from "../helpers/html-decode.js";
import { normalizeURL } from "../helpers/url.js";
import { getPostImage } from "../helpers/post.js";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
function orderByDateDescending(a, b) {
  // b is less than a by some ordering criterion
  if (b.date < a.date) {
    return -1;
  }

  // b is greater than a by the ordering criterion
  if (b.date > a.date) {
    return 1;
  }

  // a must be equal to b
  return 0;
}

function CategoryPage({ title, posts, DOMParser }) {

  // Start with most recent posts
  const sortedPosts = posts.sort(orderByDateDescending);

  return html`
  <header>
    <div class="container">
      <h1>${ title }</h1>
    </div>
  </header>

  <div class="recipe-list">
    <ul>
      ${sortedPosts.map(post => {
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

