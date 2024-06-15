
import jsBeautify            from "js-beautify";

import { renderToString }    from "preact-render-to-string";
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


function getRecipesHTML({ url, askSearchEnginesNotToIndex, DOMParser }) {
  return new Promise((resolve, reject) => {
    const html = render(DefaultLayout({
      title: "Recipe List",
      content: RecipesPage({
        posts: getPostsAlphabetically(),
        DOMParser,
      }),
      openGraphImage: `${config.host}${config.data.openGraphImage}`,
      url,
      askSearchEnginesNotToIndex,
      DOMParser,
    }));
    resolve(html);
  });
}

function getPostHTML({ url, askSearchEnginesNotToIndex, DOMParser }) {
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
      content: PostPage({ post, DOMParser }),
      openGraphImage: `${config.host}${openGraphImage}`,
      url,
      askSearchEnginesNotToIndex,
      DOMParser,
    }));

    resolve(html);
  });
}

function getPageHTML({ url, askSearchEnginesNotToIndex, DOMParser }) {
  return new Promise((resolve, reject) => {
    const page = getPage(url);

    const html = render(DefaultLayout({
      title: page.title.rendered,
      content: DefaultPage({ page, DOMParser }),
      openGraphImage: `${config.host}${config.data.openGraphImage}`,
      url,
      askSearchEnginesNotToIndex,
      DOMParser,
    }));

    resolve(html);
  });
}

function getCategoryHTML({ url, askSearchEnginesNotToIndex, DOMParser }) {
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
      content: CategoryPage({...category, DOMParser}),
      openGraphImage: `${config.host}${openGraphImage}`,
      url,
      askSearchEnginesNotToIndex,
      DOMParser,
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

function getRedirectsText({ postURLs }) {
  console.log({"getRedirectsText": 1, redirects: config.redirects});
  return new Promise((resolve, reject) => {
    const redirects = config.redirects.map((redirect) => {
      const to = redirect.to === MOST_RECENT_POST ? getMostRecentPostURL() : redirect.to;
      return {
        ...redirect,
        to,
      }
    });

    const postDates = {};
    for (const url of postURLs) {
      const [, year, month, day] = url.split("/");
      const date = [year, month, day].join("/");
      if (!postDates[date]) {
        postDates[date] = [];
      }
      postDates[date].push(url);
    }

    console.log({ postDates });

    // Avoid creating a redirect if there’s more than one published post for a date
    const uniqueDatePostURLs = postURLs.filter(url => {
      const [, year, month, day] = url.split("/");
      const date = [year, month, day].join("/");
      return postDates[date].length === 1;
    })

    console.log({ uniqueDatePostURLs });

    // Redirect old post URLs to the latest URL (assuming that each post has a unique publish date)
    for (const url of uniqueDatePostURLs) {
      const [, year, month, day] = url.split("/");
      redirects.push({
        from: `/${year}/${month}/${day}/*`,
        to: url,
      })
    }

    const text = RedirectsText({ redirects });
    resolve(text);
  });
}

function getRedirectHTML({ redirectTo, askSearchEnginesNotToIndex, DOMParser }) {
  return new Promise((resolve, reject) => {
    if (getPost(redirectTo)) {
      const post = getPost(redirectTo);

      const html = render(DefaultLayout({
        title: post.title.rendered,
        content: PostPage({ post, DOMParser }),
        openGraphImage: getBackgroundImage({ post }).src,
        redirect: redirectTo,
        askSearchEnginesNotToIndex,
        DOMParser,
      }));

      resolve(html);
    } else {
      const html = render(RedirectLayout({ url: redirectTo }));
      resolve(html);
    }
  });
}

function getError404HTML({ askSearchEnginesNotToIndex, DOMParser }) {
  const html = render(DefaultLayout({
    title: error404PageTitle,
    content: Error404Page(),
    includeClientJS: false,
    askSearchEnginesNotToIndex,
    DOMParser,
  }));

  return html;
}

function useLocalContentIfNeeded(html) {
  if (config.useLocalContent) {
    return html.replace(new RegExp(`${config.data.host}/`, "g"), "/");
  } else {
    return html;
  }
}

function _getSourceByURL({ url, askSearchEnginesNotToIndex, DOMParser, postURLs }) {
  return new Promise(async (resolve, reject) => {

    let redirect = config.redirects[url];
    if (redirect === MOST_RECENT_POST) {
      redirect = getMostRecentPostURL();
    }

    const resolveHTML = (html) => resolve(useLocalContentIfNeeded(html));

    if (url === "/sitemap.xml") {
      getSiteMapXML()
        .then(resolve);
    } else if (url === "/robots.txt") {
      getRobotsText()
        .then(resolve);
    } else if (url === "/_redirects") {
      getRedirectsText({ postURLs })
        .then(resolve);
    } else if (redirect) {
      getRedirectHTML({ redirect, askSearchEnginesNotToIndex, DOMParser })
        .then(resolveHTML);
    } else if (url === "/recipes/") {
      getRecipesHTML({ url, askSearchEnginesNotToIndex, DOMParser })
        .then(resolveHTML);
    } else if (getCategory(url)) {
      getCategoryHTML({ url, askSearchEnginesNotToIndex, DOMParser })
        .then(resolveHTML);
    } else if (getPost(url)) {
      getPostHTML({ url, askSearchEnginesNotToIndex, DOMParser })
        .then(resolveHTML);
    } else if (getPage(url)) {
      getPageHTML({ url, askSearchEnginesNotToIndex, DOMParser })
        .then(resolveHTML);
    } else {
      throw new Error(`An unexpected URL was passed to getSourceByURL: ${url}`);
    }
  });
}


function getSourceByURL({ url, askSearchEnginesNotToIndex, DOMParser, postURLs }) {
  return new Promise(async (resolve, reject) => {
    const text = await _getSourceByURL({ url, askSearchEnginesNotToIndex, DOMParser, postURLs });
    resolve(text);
  });
}


export {
  getSourceByURL,
  getError404HTML
}

