
import fs               from "fs-extra";
import mkdirp           from "mkdirp";
import fetch            from "node-fetch";

import { fetchFromFileSystem }
                        from "../helpers/fetch-from-file-system.js";
import { fetchJSON }    from "../helpers/fetch.js";
import { normalizeURL } from "../helpers/url.js";
import { getNormalizedCategories } from "../helpers/post.js";

import { config }       from "../_config.js";


const posts      = {};
const categories = {};
const pages      = {};

let mostRecentPostURL;

function saveJSON({ url, json, filename }) {
  const writePath = "./_api/" + encodeURIComponent(url);
  const fullPath = `${writePath}/${filename ? filename : "index.json"}`;
  console.log(`Saving JSON file to: ${ fullPath }`);

  mkdirp(writePath, function (err) {
    if (err) {
      console.error(err);
    } else {
      fs.writeFileSync(fullPath, JSON.stringify(json, null, '  '), 'utf8', (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

async function* fetchData(url) {
  let pageNumber = 1;
  let items;
  do {
    const urlWithPageNumber = url.replace(/\$\{[\s]*pageNumber[\s]*\}/g, pageNumber);
    if (config.useLocalData === true) {
      const localURL = `/api/${encodeURIComponent(urlWithPageNumber)}/index.json`;
      console.log(`Fetching page ${ pageNumber } from local data: ${ localURL }`);
      items = await fetchJSON({
        url: localURL,
        fetch: fetchFromFileSystem
      });
    } else {
      console.log(`Fetching page ${ pageNumber } from remote data: ${ urlWithPageNumber }`);
      items = await fetchJSON({
        url: urlWithPageNumber,
        fetch
      });
      saveJSON({
        url: urlWithPageNumber,
        json: items
      });
    }
    yield items;
    pageNumber++;
  } while(items != null && items.length > 0)
}

async function fetchAllItems(url) {
  let allItems = [];
  for await (let nextItems of fetchData(url)) {
    if (nextItems != null && nextItems.length > 0) {
      allItems = allItems.concat(nextItems);
    }
  }
  return allItems;
}

async function refreshPosts(url) {
  const items = await fetchAllItems(url)
  const published = items.filter(item => item.status === "publish");
  console.log(`There are ${ published.length } published posts`);

  for (let index = 0; index < published.length; index++) {
    const post = published[index];

    // The published array is ordered by date, with the most recent post first
    const next     = published[index - 1];
    const previous = published[index + 1];

    const url = `/${normalizeURL(post.link)}/`;
    posts[url] = {
      ...post,
      next,
      previous 
    }
    // console.log("category");
    // console.log(category);

    const postCategories = getNormalizedCategories({ post });
    if (postCategories && postCategories.length) {
      for (let category of postCategories) {
        if (!categories[category.url]) {
          categories[category.url] = category;
          categories[category.url].posts = [];
        }
        categories[category.url].posts.push(post);
      }
    }

    if (mostRecentPostURL == null || posts[mostRecentPostURL].date_gmt < post.date_gmt) {
      mostRecentPostURL = url;
    }
    // console.log({mostRecentPostURL});
  }
}

async function refreshPages(url) {
  const items = await fetchAllItems(url)
  const published = items.filter(item => item.status === "publish");
  console.log(`There are ${ published.length } published pages`);

  for (let item of published) {
    const url = `/${normalizeURL(item.link)}/`;
    pages[url] = item;
  }
}

async function refreshData() {
  await refreshPosts(config.data.posts);
  await refreshPages(config.data.pages);
}

function getPostURLs() {
  return Object.keys(posts).sort();
}

function getCategoryURLs() {
  return Object.keys(categories).sort();
}

function getPageURLs() {
  return Object.keys(pages).sort();
}

function getPost(url) {
  return posts[url];
}

function getCategory(url) {
  return categories[url];
}

function getPage(url) {
  return pages[url];
}

function getMostRecentPostURL() {
  return mostRecentPostURL;
}

function getPublicURLs() {
  return Object.keys(posts);
}

function getPostsAlphabetically() {
  return Object.entries(posts).sort((a, b) => {
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
  refreshData,
  getPostURLs,
  getPost,
  getCategoryURLs,
  getCategory,
  getPageURLs,
  getPage,
  getMostRecentPostURL,
  getPostsAlphabetically,
  getPublicURLs
}

