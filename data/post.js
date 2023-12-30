
import fs               from "fs-extra";
import fetch            from "node-fetch";

import { fetchFromFileSystem }
                        from "../helpers/fetch-from-file-system.js";
import { fetchJSON }    from "../helpers/fetch.js";
import { normalizeURL } from "../helpers/url.js";
import { getNormalizedCategories } from "../helpers/post.js";

import { config }       from "../_config.js";

function getAuthorizedFetch({ authorization }) {
  return function(url) {
    return fetch(url, {
      headers: {
        'Authorization': authorization,
      },
    });
  }
}

const posts      = {};
const categories = {};
const pages      = {};
const media      = {};
const previouslyDownloadedMedia = {};

let mostRecentPostURL;

async function saveJSON({ url, json, filename, mkdirp }) {
  const writePath = "./_api/" + encodeURIComponent(url);
  const fullPath = `${writePath}/${filename ? filename : "recipes.json"}`;
  console.log(`Saving JSON file to: ${ fullPath }`);

  try {
    const folder = await mkdirp(writePath);
    fs.writeFileSync(fullPath, JSON.stringify(json, null, '  '), 'utf8', (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch(err) {
    console.error(err);
  }
}

async function* fetchData({ url, useLocalData, authorization, mkdirp }) {
  let pageNumber = 1;
  let items;
  do {
    const urlWithPageNumber = url.replace(/\$\{[\s]*pageNumber[\s]*\}/g, pageNumber);
    if (useLocalData) {
      const localURL = `/api/${encodeURIComponent(urlWithPageNumber)}/recipes.json`;
      console.log(`Fetching page ${ pageNumber } from local data: ${ localURL }`);
      items = await fetchJSON({
        url: localURL,
        fetch: fetchFromFileSystem
      });
    } else {
      console.log(`Fetching page ${ pageNumber } from remote data: ${ urlWithPageNumber }`);
      items = await fetchJSON({
        url: urlWithPageNumber,
        fetch: getAuthorizedFetch({ authorization })
      });
      saveJSON({
        url: urlWithPageNumber,
        json: items,
        mkdirp,
      });
    }
    yield items;
    pageNumber++;
  } while(items != null && items.length > 0)
}

async function fetchAllItems({ url, useLocalData, authorization, mkdirp }) {
  let allItems = [];
  for await (let nextItems of fetchData({ url, useLocalData, authorization, mkdirp })) {
    if (nextItems != null && nextItems.length > 0) {
      allItems = allItems.concat(nextItems);
    }
  }
  return allItems;
}

async function refreshPosts({ url, useLocalData, authorization, mkdirp }) {
  const items = await fetchAllItems({ url, useLocalData, authorization, mkdirp });
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

async function refreshPages({ url, useLocalData, authorization, mkdirp }) {
  const items = await fetchAllItems({ url, useLocalData, authorization, mkdirp });
  const published = items.filter(item => item.status === "publish");
  console.log(`There are ${ published.length } published pages`);

  for (let item of published) {
    const url = `/${normalizeURL(item.link)}/`;
    pages[url] = item;
  }
}

async function refreshPreviouslyDownloadedMedia({ url, authorization, mkdirp }) {
  const items = await fetchAllItems({ url, useLocalData: 1, authorization, mkdirp });

  // console.log(items[0].media_details);

  for (let item of items) {
    const url = `/${normalizeURL(item.source_url)}`;
    previouslyDownloadedMedia[url] = item;

    if (item["media_details"] && item["media_details"]["sizes"]) {
      for (let [name, size] of Object.entries(item["media_details"]["sizes"])) {
        const url = `/${normalizeURL(size.source_url)}`;
        previouslyDownloadedMedia[url] = size;
      }
    }
  }
}

async function refreshMedia({ url, useLocalData, authorization, mkdirp }) {
  const items = await fetchAllItems({ url, useLocalData, authorization, mkdirp });

  // console.log(items[0].media_details);

  for (let item of items) {
    const url = `/${normalizeURL(item.source_url)}`;
    media[url] = item;

    if (item["media_details"] && item["media_details"]["sizes"]) {
      for (let [name, size] of Object.entries(item["media_details"]["sizes"])) {
        const url = `/${normalizeURL(size.source_url)}`;
        media[url] = size;
      }
    }
  }
}

async function refreshData({ env, mkdirp }) {
  await refreshPosts({
    url: `${config.data.host}${config.data.posts}`,
    useLocalData: env.USE_LOCAL_DATA == 1,
    authorization: env.AUTHORIZATION_HEADER_VALUE,
    mkdirp
  });
  await refreshPages({
    url: `${config.data.host}${config.data.pages}`,
    useLocalData: env.USE_LOCAL_DATA == 1,
    authorization: env.AUTHORIZATION_HEADER_VALUE,
    mkdirp
  });
  await refreshPreviouslyDownloadedMedia({
    url: `${config.data.host}${config.data.media}`,
    authorization: env.AUTHORIZATION_HEADER_VALUE,
    mkdirp
  });
  await refreshMedia({
    url: `${config.data.host}${config.data.media}`,
    useLocalData: env.USE_LOCAL_DATA == 1,
    authorization: env.AUTHORIZATION_HEADER_VALUE,
    mkdirp
  });
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

function getMediaURLs() {
  return Object.keys(media).sort();
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

function getMedia(url) {
  return media[url];
}

function getPreviouslyDownloadedMedia(url) {
  return previouslyDownloadedMedia[url];
}

function getMostRecentPostURL() {
  return mostRecentPostURL;
}

function getPublicURLs() {
  return [
    ...getPostURLs(),
    ...getPageURLs(),
    ...getCategoryURLs()
  ].sort();
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
  getMediaURLs,
  getMedia,
  getPreviouslyDownloadedMedia,
  getMostRecentPostURL,
  getPostsAlphabetically,
  getPublicURLs
}

