import fs from "node:fs";
import fetch from "node-fetch";

import { config }       from "./_config.js";

import { normalizeURL } from "./helpers/url.js";

import { getMedia, getPreviouslyDownloadedMedia } from "./data/post.js";

const authorizedFetch = function({ url, authorization }) {
  return fetch(url, {
    headers: {
      'Authorization': authorization,
    },
  });
}

function downloadImage({ url, authorization, mkdirp }) {
  const urlBits = normalizeURL(url).split("/");

  // IMG_8473-770x1024.jpg
  const imageName = urlBits.pop();

  // wp-content/uploads/2020/04
  const imagePath = urlBits.join("/");

  // ./_pictures/2020/04/
  const writePath = `./_pictures/${imagePath}/`.replace("/wp-content/uploads/", "/");

  const image = getMedia(url);
  const previouslyDownloadedImage = getPreviouslyDownloadedMedia(url);

  if (fs.existsSync(`${writePath}${imageName}`) && previouslyDownloadedImage && previouslyDownloadedImage.modified_gmt === image.modified_gmt) {
    // console.log("Skipping because the file has already been downloaded: ")
    // console.log(`${writePath}${imageName}`);

    // https://stackoverflow.com/questions/20936486/node-js-maximum-call-stack-size-exceeded
    setTimeout( function() {
      processNext();
    }, 0 );

    return;
  }

  authorizedFetch({ url: `${config.data.host}${url}`, authorization })
    .then(res => {
      return new Promise(async (resolve, reject) => {
        try {
          const folder = await mkdirp(writePath);
          const dest = fs.createWriteStream(`${writePath}${imageName}`);
          res.body.pipe(dest);
          res.body.on("error", err => {
            reject(err);
          });
          dest.on("finish", () => {
            resolve();
          });
          dest.on("error", err => {
            reject(err);
          });
        } catch(err) {
          console.error(err);
        }
      });
    })
    .then(() => {
      console.log("successfully downloaded: ");
      console.log(url);
    })
    .catch(err => {
      console.log("error while downloading: ");
      console.log(url);
      console.log(err);
    })
    .finally(processNext);

  // saveMarkdown(filename, data)
}

let processNext;

function downloadImages({ urls, env, mkdirp }) {
  return new Promise(async (resolve, reject) => {
    console.log(urls);

    let cursor = -1;

    processNext = function() {
      cursor++;
      if (cursor >= urls.length) {
        resolve();
        return;
      }

      downloadImage({ url: urls[cursor], authorization: env.AUTHORIZATION_HEADER_VALUE, mkdirp });
    }

    processNext();
  });
}

export {
  downloadImages
}
