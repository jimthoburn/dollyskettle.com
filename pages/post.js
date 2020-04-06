
import { createElement }  from "../web_modules/preact.js";
import   htm              from "../web_modules/htm.js";
const    html = htm.bind(createElement);

import { normalizeURL } from "../helpers/url.js";
// import { PictureGallery } from "../components/picture-gallery.js";

function getBackgroundImage({ post }) {
  try {
    const image = post._embedded["wp:featuredmedia"][0];
    return {
      src: image.source_url,
      width: image.media_details.width,
      height: image.media_details.height
    }
  } catch(error) {
    console.error(new Error(`Couldn’t find a featured image for post`));
  }
}

function getCategory({ post }) {
  try {
    const category = post._embedded["wp:term"][0][0];
    return {
      label: category.name,
      url: `/${normalizeURL(category.link)}/`
    };
  } catch(error) {
    console.error(new Error(`Couldn’t find a category for post`));
  }
}

// https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
function getFormattedDate({ date }) {
  const d = new Date(date);
  const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' });
  const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(d);

  return `${mo} ${da}, ${ye}`;
}

function PostPage({ post }) {

  const backgroundImage = getBackgroundImage({ post });
  const category = getCategory({ post });

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
                <span>Next:</span>
                <a href="/${ normalizeURL(post.next.link) }/">
                  ${ post.next.title.rendered }
                </a>
              </li>
              <li class="previous">
                <span>Previous:</span>
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

