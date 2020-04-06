
import { createElement }  from "../web_modules/preact.js";
import   htm              from "../web_modules/htm.js";
const    html = htm.bind(createElement);

import { config }         from "../_config.js";

import { normalizeURL }   from "../helpers/url.js";
import { getCategoryURLs,
         getCategory,
         getPageURLs,
         getPage }        from "../data/post.js";


export const DefaultLayout = ({ title, content, openGraphImage }) => {
  return html`
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
        <title>${ title } – Dolly’s Kettle</title>

        ${ config.favicon
          ? html`<link rel="icon" href="${ config.favicon }" />`
          : ""}

        ${ openGraphImage 
          ? html`<meta property="og:image" content="${ openGraphImage }" />`
          : ""}

        <link rel="stylesheet" href="/css/shared.css" />

      </head>
      <body>
        <nav class="jump">
          <a href="/">
            <h2>Dolly’s Kettle</h2>
          </a>
          <p><a href="#navigation">Menu</a></p>
        </nav>

        ${ content }

        <nav id="navigation">

          <a href="/">
            <h1>
              <img src="https://dollyskettle.com/wp-content/themes/kettle/images/kettle.gif" height="125" alt="" /> Dolly’s Kettle </h1>
            <p>Nutritious Cooking for a Healthy Life</p>
          </a>

          <section>
            <h2>Categories</h2>
            <ul>
              ${getCategoryURLs().map(url => {
                const category = getCategory(url);
                return html`
                <li><a href="${ category.url }">${ category.label }</a></li>
                `;
              })}
            </ul>
          </section>

          <section>
            <h2>Pages</h2>
            <ul>
              ${getPageURLs().map(url => {
                const page = getPage(url);
                return html`
                <li><a href="/${ normalizeURL(page.link) }/" dangerouslySetInnerHTML=${ { __html: page.title.rendered } }></a></li>
                `;
              })}
            </ul>
          </section>

          <form role="search" action="https://duckduckgo.com/" method="get">
            <h2>Search</h2>
            <input type="hidden" name="sites" value="dollyskettle.com" />
            <p>
              <label>
                <span>Keywords</span>
                <input type="search" name="q" />
              </label>
              <span> </span>
              <button type="submit">Search</button>
            </p>
          </form>

        </nav>

        <img src="https://dollyskettle.com/wp-content/themes/kettle/images/farmhouse.jpg" alt="" class="footer-image" width="700" />

      </body>
    </html>
  `;
};
