
import fetch            from "node-fetch";

import { fetchJSON }    from "../helpers/fetch.js";
import { normalizeURL } from "../helpers/url.js";

import { config }       from "../_config.js";


const urls = {};


async function getPostsByURL() {
  const posts = await fetchJSON({url: config.postsDataURL, fetch});
  // console.log(posts);

  for (let post of posts) {
    urls[`/${normalizeURL(post.link)}/`] = post;
  }

  return Object.keys(urls);
}

function getPost(url) {
  return urls[url];
}

function getPublicURLs() {
  return Object.keys(urls);
}


export {
  getPostsByURL,
  getPost,
  getPublicURLs
}

