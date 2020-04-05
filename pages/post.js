
import { createElement }  from "../web_modules/preact.js";
import   htm              from "../web_modules/htm.js";
const    html = htm.bind(createElement);
// import { PictureGallery } from "../components/picture-gallery.js";


function PostPage({ post }) {
  
  return html`
    <header>
      <div class="container">
        <h1>${ post.title.rendered }</h1>
        <p class="meta">Published on ${ post.date_gmt }</p>
      </div>
    </header>

    <div class="body" dangerouslySetInnerHTML=${ { __html: post.content.rendered } }></div>
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

