
import { config } from "../_config.js";

// 📚 SHIM: Behaves just like the default template string. This is just so we can use html`` for color coding
const html = (...theArgs) => theArgs.shift().map(string => string + (theArgs.shift() || "")).join("");

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
              <li class="cat-item cat-item-5"><a href="https://dollyskettle.com/category/appetizers/">Appetizers</a>
              </li>
              <li class="cat-item cat-item-23"><a href="https://dollyskettle.com/category/blogs-on-health/">Blogs on Health</a>
              </li>
              <li class="cat-item cat-item-7"><a href="https://dollyskettle.com/category/breads/">Breads</a>
              </li>
              <li class="cat-item cat-item-16"><a href="https://dollyskettle.com/category/breakfast/">Breakfast</a>
              </li>
              <li class="cat-item cat-item-29"><a href="https://dollyskettle.com/category/christmas/">Christmas</a>
              </li>
              <li class="cat-item cat-item-8"><a href="https://dollyskettle.com/category/cookies/">Cookies</a>
              </li>
              <li class="cat-item cat-item-3"><a href="https://dollyskettle.com/category/desserts/">Desserts</a>
              </li>
              <li class="cat-item cat-item-22"><a href="https://dollyskettle.com/category/farmers-markets/">Farmers Markets</a>
              </li>
              <li class="cat-item cat-item-17"><a href="https://dollyskettle.com/category/gluten-free/">Gluten Free</a>
              </li>
              <li class="cat-item cat-item-27"><a href="https://dollyskettle.com/category/keto-paleo-low-carb/">Keto/Paleo/Low Carb</a>
              </li>
              <li class="cat-item cat-item-19"><a href="https://dollyskettle.com/category/low-carb/">Low Carb</a>
              </li>
              <li class="cat-item cat-item-20"><a href="https://dollyskettle.com/category/lunch/">Lunch</a>
              </li>
              <li class="cat-item cat-item-14"><a href="https://dollyskettle.com/category/main-dishes/">Main Dishes</a>
              </li>
              <li class="cat-item cat-item-1"><a href="https://dollyskettle.com/category/miscellaneous/">Miscellaneous</a>
              </li>
              <li class="cat-item cat-item-25"><a href="https://dollyskettle.com/category/paleo/">Paleo</a>
              </li>
              <li class="cat-item cat-item-6"><a href="https://dollyskettle.com/category/pasta/">Pasta</a>
              </li>
              <li class="cat-item cat-item-9"><a href="https://dollyskettle.com/category/pastries/">Pastries</a>
              </li>
              <li class="cat-item cat-item-13"><a href="https://dollyskettle.com/category/pizza/">Pizza</a>
              </li>
              <li class="cat-item cat-item-12"><a href="https://dollyskettle.com/category/salads/">Salads</a>
              </li>
              <li class="cat-item cat-item-15"><a href="https://dollyskettle.com/category/sides/">Sides</a>
              </li>
              <li class="cat-item cat-item-4"><a href="https://dollyskettle.com/category/soups/">Soups</a>
              </li>
              <li class="cat-item cat-item-28"><a href="https://dollyskettle.com/category/stews/">Stews</a>
              </li>
              <li class="cat-item cat-item-26"><a href="https://dollyskettle.com/category/thanksgiving/">Thanksgiving</a>
              </li>
              <li class="cat-item cat-item-24"><a href="https://dollyskettle.com/category/vegetarianvegan/">Vegetarian/Vegan</a>
              </li>
              <li class="cat-item cat-item-10"><a href="https://dollyskettle.com/category/wraps/">Wraps</a>
              </li>
            </ul>
          </section>

          <section>
            <h2>Pages</h2>
            <ul>
              <li class="page_item page-item-49"><a href="https://dollyskettle.com/about/">About</a></li>
              <li class="page_item page-item-471"><a href="https://dollyskettle.com/index/">Recipe List</a></li>
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
