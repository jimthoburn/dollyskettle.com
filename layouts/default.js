
import { config } from "../_config.js";
import { taggedLiteral as html } from "../helpers/tagged-literal.js";
import { getCategoryURLs, getCategory } from "../data/post.js";

function getCategoriesHTML() {
  let items = [];
  getCategoryURLs().map(url => {
    const category = getCategory(url);
    // console.log("Addding category");
    // console.log(category);
    items.push(html`
      <li><a href="${ category.url }">${ category.label }</a></li>
    `);
  })
  return items.join("");
}

export const DefaultLayout = ({ title, content, openGraphImage, headlineColor, linkColor }) => {
  return html`
    <!DOCTYPE html>
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
        <style>
          @font-face {
            font-family: "Italianno";
            src: url("/fonts/italianno.woff2") format("woff2"),
                 url("/fonts/italianno.woff") format("woff");
            font-weight: normal;
            font-style: normal;
          }
        
          nav h1,
          nav h2 {
            font-family: "Italianno", "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace;
            font-size: 2em;
            margin: 0;
          }
          nav h1 {
            font-size: 2.25em;
          }
          nav a > p {
            font-family: "Italianno", "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace;
            font-size: 1.75em;
          }
        </style>

        ${ headlineColor
          ? html`
            <style>
              .background-image + article header h1,
              .background-image + article header .meta {
                background-color: ${ headlineColor };
              }
              article h3,
              article .body ul li:before {
                color: ${ headlineColor };
              }
            </style>`
          : ""}

        ${ linkColor
          ? html`
            <style>
              nav.jump a {
                background-color: ${ linkColor };
              }
              a {
                color: ${ linkColor };
              }
            </style>`
          : ""}

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
              ${ getCategoriesHTML() }
            </ul>
          </section>

          <section>
            <h2>Pages</h2>
            <ul>
              <!-- <li class="page_item page-item-49"><a href="/about/">About</a></li> -->
              <li class="page_item page-item-471"><a href="/index/">Recipe List</a></li>
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
              <button type="submit">Search</button>
            </p>
          </form>

        </nav>

        <img src="https://dollyskettle.com/wp-content/themes/kettle/images/farmhouse.jpg" alt="" class="footer-image" width="700">

      </body>
    </html>
  `;
};
