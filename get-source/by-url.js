
import jsBeautify            from "js-beautify";

import { render }            from "../web_modules/preact-render-to-string.js";
import { config }            from "../_config.js";
import { getPublicURLs,
         getMostRecentPostURL,
         getPostsAlphabetically,
         getPost,
         getCategory }       from "../data/post.js";
import { getNormalizedCategory } from "../helpers/post.js";
import { DefaultLayout }     from "../layouts/default.js";
import { RedirectLayout }    from "../layouts/redirect.js";
import { RobotsText }        from "../layouts/robots.txt.js";
import { SiteMapXML }        from "../layouts/sitemap.xml.js";
import { PostPage }          from "../pages/post.js";
import { CategoryPage }      from "../pages/category.js";
import { IndexPage }         from "../pages/index.js";


const FIRST_POST = "FIRST_POST";


function getIndexHTML() {
  return new Promise((resolve, reject) => {
    const html = DefaultLayout({
      title: "Recipe List",
      content: render(IndexPage({
        posts: getPostsAlphabetically()
      }))
      // openGraphImage:
      //   openGraphImage && (openGraphImage.indexOf("http") === 0 || config.host) ?
      //     openGraphImage.indexOf("http") != 0 && config.host
      //       ? `${config.host}${openGraphImage}`
      //       : openGraphImage
      //     : null
    });
    resolve(html);
  });
}

function getPostHTML(url) {
  return new Promise((resolve, reject) => {
    const post = getPost(url);

    // const openGraphImage = getOpenGraphImage({
    //   getPageURL,
    //   album
    // });

    const html = DefaultLayout({
      title: post.title.rendered,
      content: render(PostPage({ post }))
      // openGraphImage:
      //   openGraphImage && (openGraphImage.indexOf("http") === 0 || config.host) ?
      //     openGraphImage.indexOf("http") != 0 && config.host
      //       ? `${config.host}${openGraphImage}`
      //       : openGraphImage
      //     : null
    });

    resolve(jsBeautify.html_beautify(html));
  });
}

function getCategoryHTML(url) {
  return new Promise((resolve, reject) => {
    const category = getCategory(url);

    const html = DefaultLayout({
      title: category.name,
      content: render(CategoryPage({
        posts: getPostsAlphabetically().filter(post => 
          getNormalizedCategory({ post }).url === category.url
        )
      }))
      // openGraphImage:
      //   openGraphImage && (openGraphImage.indexOf("http") === 0 || config.host) ?
      //     openGraphImage.indexOf("http") != 0 && config.host
      //       ? `${config.host}${openGraphImage}`
      //       : openGraphImage
      //     : null
    });
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
      urls: publicURLs
    });
    resolve(xml);
  });
}

function getRedirectHTML(redirectTo) {
  // console.log("getRedirectHTML");
  return new Promise((resolve, reject) => {
    const html = RedirectLayout({ url: redirectTo });
    // console.log("getRedirectHTML html: ");
    // console.log(html);
    resolve(html);
  });
}


function getSourceByURL(url) {
  // if (url.indexOf("portrait") >= 0) console.log(`getSourceByURL: ${url}`);
  return new Promise(async (resolve, reject) => {

    let redirect = config.redirects[url];
    if (redirect === FIRST_POST) {
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
    } else if (redirect) {
      getRedirectHTML(redirect)
        .then(resolve);
    } else if (url === "/index/") {
      getIndexHTML()
        .then(resolve);
    } else if (getCategory(url)) {
      getCategoryHTML(url)
        .then(resolve);
    } else if (getPost(url)) {
      getPostHTML(url)
        .then(resolve);
    } else {
      throw new Error(`An unexpected URL was passed to getSourceByURL: ${url}`);
    }
  });
}


export {
  getSourceByURL
}

