
import { createElement }  from "../web_modules/preact.js";
import   htm              from "../web_modules/htm.js";
const    html = htm.bind(createElement);

import { normalizeURL } from "../helpers/url.js";
import { getBackgroundImage,
         getFormattedDate,
         getNormalizedCategory }  from "../helpers/post.js";


function PostPage({ post }) {

  const backgroundImage = getBackgroundImage({ post });
  const category = getNormalizedCategory({ post });

  return html`
    ${ backgroundImage && backgroundImage.width > 1000 && backgroundImage.height > 1000
      ? html`<div class="background-image"><img src="${ backgroundImage.src }" alt="" width="700" /></div>`
      : ""}

    <article>
      <header>
        <div class="container">
          <h1 dangerouslySetInnerHTML=${ { __html: post.title.rendered } }></h1>
          <p class="meta">Published on ${ getFormattedDate({ date: post.date_gmt }) }</p>
        </div>
      </header>

      <div class="body" dangerouslySetInnerHTML=${ { __html: post.content.rendered } }></div>

      <footer>
        ${ category
          ? html`<p class="meta">Filed under: <a href="${ category.url }">${ category.label }</a></p>`
          : ""}
          
        ${ post.next && post.previous
          ? html`
            <ul>
              <li class="next">
                <span>Next: </span>
                <a href="/${ normalizeURL(post.next.link) }/">
                  ${ post.next.title.rendered }
                </a>
              </li>
              <li class="previous">
                <span>Previous: </span>
                <a href="/${ normalizeURL(post.previous.link) }/">
                  ${ post.previous.title.rendered }
                </a>
              </li>
            </ul>`
          : ""}
        
      </footer>
    </article>
  `;

  // return html`
  //   <${PictureGallery}
  //     album="${album}"
  //     pictures="${pictures}"
  //     story="${story}"
  //     getPageURL="${getPageURL}" />
  // `;
}


export { PostPage };

