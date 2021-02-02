
import jsBeautify            from "js-beautify";

import { renderToString }    from "../web_modules/preact-render-to-string.js";
import { config, MOST_RECENT_POST }            from "../_config.js";
import { getPublicURLs,
         getMostRecentPostURL,
         getPostsAlphabetically,
         getPost,
         getPage,
         getCategory }       from "../data/post.js";
import { getBackgroundImage } from "../helpers/post.js";
import { DefaultLayout }     from "../layouts/default.js";
import { RedirectLayout }    from "../layouts/redirect.js";
import { RobotsText }        from "../layouts/robots.txt.js";
import { SiteMapXML }        from "../layouts/sitemap.xml.js";
import { RedirectsText }     from "../layouts/_redirects.js";
import { Error404Page,
         error404PageTitle } from "../pages/404.js";
import { DefaultPage }       from "../pages/default.js";
import { PostPage }          from "../pages/post.js";
import { CategoryPage }      from "../pages/category.js";
import { RecipesPage }       from "../pages/recipes.js";


function render(...theParameters) {
  return jsBeautify.html_beautify(`<!DOCTYPE html>
${renderToString(theParameters)}
`);
}


function getRecipesHTML() {
  return new Promise((resolve, reject) => {
    const html = render(DefaultLayout({
      title: "Recipe List",
      content: RecipesPage({
        posts: getPostsAlphabetically()
      }),
      openGraphImage: `${config.host}${config.data.openGraphImage}`
    }));
    resolve(html);
  });
}

function getPostHTML(url) {
  return new Promise((resolve, reject) => {
    const post = getPost(url);

    let openGraphImage;
    try {
      openGraphImage = getBackgroundImage({ post }).src;
    } catch (error) {
      openGraphImage = config.data.openGraphImage;
      console.error(`Warning: Unable to get open graph image for: ${url}`)
      console.error(error);
    }

    const html = render(DefaultLayout({
      title: post.title.rendered,
      content: PostPage({ post }),
      openGraphImage: `${config.host}${openGraphImage}`,
    }));

    resolve(html);
  });
}

function getPageHTML(url) {
  return new Promise((resolve, reject) => {
    const page = getPage(url);

    const html = render(DefaultLayout({
      title: page.title.rendered,
      content: DefaultPage({ page }),
      openGraphImage: `${config.host}${config.data.openGraphImage}`,
    }));

    resolve(html);
  });
}

function getCategoryHTML(url) {
  return new Promise((resolve, reject) => {
    const category = getCategory(url);

    let openGraphImage;
    try {
      openGraphImage = getBackgroundImage({ post: category.posts[0] }).src;
    } catch (error) {
      openGraphImage = config.data.openGraphImage;
      console.error(`Warning: Unable to get open graph image for: ${url}`)
      console.error(error);
    }

    const html = render(DefaultLayout({
      title: category.title,
      content: CategoryPage(category),
      openGraphImage: `${config.host}${openGraphImage}`,
    }));
    resolve(html);
  });
}

function getRobotsText() {
  return new Promise((resolve, reject) => {
    const text = RobotsText({
      host: config.host
    });
    resolve(text);
  });
}

function getSiteMapXML() {
  return new Promise((resolve, reject) => {
    const publicURLs = getPublicURLs();
    const xml = SiteMapXML({
      host: config.host,
      urls: ["/", ...publicURLs]
    });
    resolve(xml);
  });
}

function getRedirectsText() {
  return new Promise((resolve, reject) => {
    const text = RedirectsText({
      redirects: Object.entries(config.redirects).map( ([key, value]) => {
        if (value === MOST_RECENT_POST) value = getMostRecentPostURL();
        return {
          from: key,
          to: value
        };
      })
    });
    resolve(text);
  });
}

function getRedirectHTML(redirectTo) {
  // console.log("getRedirectHTML");
  return new Promise((resolve, reject) => {
    if (getPost(redirectTo)) {
      const post = getPost(redirectTo);

      const html = render(DefaultLayout({
        title: post.title.rendered,
        content: PostPage({ post }),
        openGraphImage: getBackgroundImage({ post }).src,
        redirect: redirectTo
      }));

      resolve(html);
    } else {
      const html = render(RedirectLayout({ url: redirectTo }));
      // console.log("getRedirectHTML html: ");
      // console.log(html);
      resolve(html);
    }
  });
}

function getError404HTML() {
  const html = render(DefaultLayout({
    title: error404PageTitle,
    content: Error404Page(),
    includeClientJS: false
  }));

  return html;
}


function _getSourceByURL(url) {
  // if (url.indexOf("portrait") >= 0) console.log(`getSourceByURL: ${url}`);
  return new Promise(async (resolve, reject) => {

    let redirect = config.redirects[url];
    if (redirect === MOST_RECENT_POST) {
      redirect = getMostRecentPostURL();
    }

    // if (url === "/") {
    //   console.log("redirect");
    //   console.log(redirect);
    // }

    if (url === "/sitemap.xml") {
      getSiteMapXML()
        .then(resolve);
    } else if (url === "/robots.txt") {
      getRobotsText()
        .then(resolve);
    } else if (url === "/_redirects") {
      getRedirectsText()
        .then(resolve);
    } else if (redirect) {
      getRedirectHTML(redirect)
        .then(resolve);
    } else if (url === "/recipes/") {
      getRecipesHTML()
        .then(resolve);
    } else if (getCategory(url)) {
      getCategoryHTML(url)
        .then(resolve);
    } else if (getPost(url)) {
      getPostHTML(url)
        .then(resolve);
    } else if (getPage(url)) {
      getPageHTML(url)
        .then(resolve);
    } else {
      throw new Error(`An unexpected URL was passed to getSourceByURL: ${url}`);
    }
  });
}


function getSourceByURL(url) {
  return new Promise(async (resolve, reject) => {
    const html = await _getSourceByURL(url);
    if (config.useLocalContent) {
      resolve(html.replace(new RegExp(`${config.data.host}/`, "g"), "/"));
    } else {
      resolve(html);
    }
  });
}


export {
  getSourceByURL,
  getError404HTML
}

