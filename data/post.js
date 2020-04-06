
import fetch            from "node-fetch";

import { fetchJSON }    from "../helpers/fetch.js";
import { normalizeURL } from "../helpers/url.js";

import { config }       from "../_config.js";


const urls = {};
let mostRecentPostURL;


async function* fetchPosts() {
  let pageNumber = 1;
  let posts;
  do {
    console.log(`Fetching page ${ pageNumber } of posts`);
    posts = await fetchJSON({ url: `${config.postsDataURL}&page=${ pageNumber }`, fetch});
    yield posts;
    pageNumber++;
  } while(pageNumber < 2 && posts != null && posts.length > 0)
}


async function getPostsByURL() {
  let allPosts = [];
  for await (let nextPage of fetchPosts()) {
    if (nextPage != null && nextPage.length > 0) {
      allPosts = allPosts.concat(nextPage)
    }
  }

  const published = allPosts.filter(post => post.status === "publish");
  console.log(`There are ${ published.length } published posts`);

  for (let index = 0; index < published.length; index++) {
    const post = published[index];
    const next = published[index + 1] || published[0];
    const previous = published[index - 1] || published[published.length - 1];
    const url = `/${normalizeURL(post.link)}/`;
    urls[url] = {
      ...post,
      next,
      previous 
    }

    if (mostRecentPostURL == null || urls[mostRecentPostURL].date_gmt < post.date_gmt) {
      mostRecentPostURL = url;
    }
    console.log({mostRecentPostURL});
  }

  return Object.keys(urls);
}

function getPost(url) {
  return urls[url];
}

function getMostRecentPostURL() {
  return mostRecentPostURL;
}

function getPublicURLs() {
  return Object.keys(urls);
}

function getPostsAlphabetically() {
  return Object.entries(urls).sort((a, b) => {
    const url = 0; // index of key in [key, value]
    if (a[url] < b[url]) {
      return -1;
    }
    if (a[url] > b[url]) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }).map(([key, value]) => value);
}


export {
  getPostsByURL,
  getPost,
  getMostRecentPostURL,
  getPostsAlphabetically,
  getPublicURLs
}

