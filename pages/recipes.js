
import { createElement }  from "../web_modules/preact.js";
import   htm              from "../web_modules/htm.js";
const    html = htm.bind(createElement);

import { htmlDecode }   from "../helpers/html-decode.js";
import { normalizeURL } from "../helpers/url.js";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
function compareTwoPostsByTitle(a, b) {
  // a is less than b by some ordering criterion
  if (a.title.rendered < b.title.rendered) {
    return -1;
  }

  // a is greater than b by the ordering criterion
  if (a.title.rendered > b.title.rendered) {
    return 1;
  }

  // a must be equal to b
  return 0;
}

function RecipesPage({ posts }) {

  // Alphabetize the posts by title
  const sortedPosts = posts.sort(compareTwoPostsByTitle);

  return html`
  <header>
    <div class="container">
      <h1>Recipe List</h1>
    </div>
  </header>

  <div class="alphabetical-recipe-list">
    <ul>
      ${sortedPosts.map(post => {
          return html`
          <li><a href="/${ normalizeURL(post.link) }/">${ htmlDecode(post.title.rendered) }</a></li>
          `;
      })}
    </ul>
  </div>
  `;

}


export { RecipesPage };

