import fs from "fs-extra";
import mkdirp from "mkdirp";
import fetch from "node-fetch";

import { config }       from "./_config.js";

import { normalizeURL } from "./helpers/url.js";

import { refreshData,
         getMediaURLs } from "./data/post.js";

function downloadImage(url) {
  const urlBits = normalizeURL(url).split("/");

  // IMG_8473-770x1024.jpg
  const imageName = urlBits.pop();

  // wp_content/uploads/2020/04
  const imagePath = urlBits.join("/");

  // ./_pictures/2020/04/
  const writePath = `./_pictures/${imagePath}/`.replace("/wp-content/uploads/", "/");

  // if (fs.existsSync(`${writePath}${imageName}`)) {
  //   console.log("Skipping because the file already exists: ")
  //   console.log(`${writePath}${imageName}`)
  //   processNext();
  //   return;
  // }

  fetch(`${config.data.host}${url}`)
    .then(res => {
      return new Promise((resolve, reject) => {
        mkdirp(writePath, function(err) {
          if (err) {
            console.error(err);
          } else {
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
          }
        });
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

function download(urls) {
  console.log(urls);

  let cursor = -1;

  processNext = function() {
    cursor++;
    if (cursor >= urls.length) return;

    downloadImage(urls[cursor]);
  }

  processNext();
}

refreshData().then(() => {
  download(getMediaURLs());
});


