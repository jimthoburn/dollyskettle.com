
import { createElement }  from "preact";
import   htm              from "htm";
const    html = htm.bind(createElement);

import { config }         from "../_config.js";

import { htmlDecode }     from "../helpers/html-decode.js";
import { normalizeURL }   from "../helpers/url.js";
import { getCategoryURLs,
         getCategory,
         getPageURLs,
         getPage }        from "../data/post.js";

import { Analytics }      from "../components/analytics.js";

export const DefaultLayout = ({ title, content, openGraphImage, redirect, askSearchEnginesNotToIndex, DOMParser }) => {
  return html`
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
        <title
          dangerouslySetInnerHTML=${
            { __html: `${title} – Dolly’s Kettle` }
          }>
        </title>

        ${ config.favicon
          ? html`<link rel="icon" href="${ config.favicon }" />`
          : ""}

        ${ openGraphImage 
          ? html`<meta property="og:image" content="${ openGraphImage }" />`
          : ""}

        ${ redirect 
          ? html`<meta http-equiv="refresh" content="0; url=${ redirect }" />`
          : ""}

        ${ redirect && config.host 
          ? html`<link rel="canonical" href="${ config.host }${ redirect }" />`
          : ""}

        ${ askSearchEnginesNotToIndex == 1
          ? html`<meta name="robots" content="noindex" />`
          : ""}

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Italianno&display=swap" /> 
        <link rel="stylesheet" href="/css/shared.css" />

        <${Analytics} id="${ config.analytics }" />

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
            <h1><img src="/wp-content/themes/kettle/images/kettle.gif" height="125" alt="" /> Dolly’s Kettle</h1>
            <p>Nutritious Cooking for a Healthy Life</p>
          </a>

          <section>
            <h2>Categories</h2>
            <ul>
              ${getCategoryURLs().map(url => {
                const category = getCategory(url);
                return html`
                <li><a href="${ category.url }">${ category.title }</a></li>
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
                <li><a href="/${ normalizeURL(page.link) }/">${ htmlDecode({ html: page.title.rendered, DOMParser }) }</a></li>
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

        <img src="/wp-content/themes/kettle/images/farmhouse.jpg" alt="" class="footer-image" width="700" />

        ${ askSearchEnginesNotToIndex == 1
          ? html`<p role="status"><mark><em>This page contains a noindex meta element and won’t be indexed by search engines.</em></mark></p>`
          : ""}

      </body>
    </html>
  `;
};
