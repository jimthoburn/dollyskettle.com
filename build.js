
import fs                   from "node:fs";
import chalk                from "chalk";

import { config }           from "./_config.js";

import { getPost }          from "./data/post.js";
import { getSourceByURL,
         getError404HTML }  from "./get-source/by-url.js";

import { copyFolder }       from "./helpers/copy.js";

const GENERATED_FILES_FOLDER = `./${config.buildFolder}`;

async function createFile({ pageURL, filename, output, mkdirp }) {
  const writePath = GENERATED_FILES_FOLDER + pageURL;

  try {
    const folder = await mkdirp(writePath);
    fs.writeFileSync(`${writePath}/${filename ? filename : "index.html"}`, output, 'utf8', (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch(err) {
    console.error(err);
  }
}

function removeFile({ pageURL, filename }) {
  const writePath = GENERATED_FILES_FOLDER + pageURL;

  const path = `${writePath}/${filename ? filename : "index.html"}`;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

async function buildStaticFiles({ mkdirp }) {
  console.log(`📂 Preparing static files`);
  for (let folder of config.staticFolders) {

    const folderWithoutLeadingUnderscore = folder.replace(/^_/, "");

    const source      = `./${folder}`;
    const destination = `${GENERATED_FILES_FOLDER}/${folderWithoutLeadingUnderscore}`;

    await copyFolder({ source, destination, mkdirp }).catch(err => { throw err; });
  }

  // _public is a general folder for any static file to be served from “/”
  await copyFolder({
    source: `./_public`,
    destination: GENERATED_FILES_FOLDER,
    mkdirp
  }).catch(err => { throw err; });

  // _pictures is a special case, to emulate WordPress URLs
  await copyFolder({
    source: `./_pictures`,
    destination: `${GENERATED_FILES_FOLDER}/wp-content/uploads/`,
    mkdirp
  }).catch(err => { throw err; });
}

function buildPages({ urls, askSearchEnginesNotToIndex, mkdirp, DOMParser }) {
  console.log(`📗 Preparing pages`);
  for (let url of urls) {
    getSourceByURL({ url, askSearchEnginesNotToIndex, DOMParser })
      .then(html => createFile({
        pageURL: url,
        output: html,
        mkdirp
      }))
      .catch(err => console.error(err));
  }
}

async function buildRobotsText({ askSearchEnginesNotToIndex, mkdirp, DOMParser }) {
  console.log(`🤖 Preparing robots.txt`);
  getSourceByURL({ url: "/robots.txt", askSearchEnginesNotToIndex, DOMParser })
    .then(text => createFile({
      pageURL: "/",
      filename: "robots.txt",
      output: text,
      mkdirp
    }))
    .catch(err => console.error(err));
}

function buildSiteMap({ askSearchEnginesNotToIndex, mkdirp, DOMParser }) {
  console.log(`🗺  Preparing sitemap.xml`);
  getSourceByURL({ url: "/sitemap.xml", askSearchEnginesNotToIndex, DOMParser })
    .then(xml => createFile({
      pageURL: "/",
      filename: "sitemap.xml",
      output: xml,
      mkdirp
    }))
    .catch(err => console.error(err));
}

function buildRedirectsFile({ askSearchEnginesNotToIndex, mkdirp, DOMParser, urls }) {
  console.log(`🗺  Preparing _redirects`);
  const postURLs = urls.filter(url => getPost(url) != null);
  getSourceByURL({ url: "/_redirects", askSearchEnginesNotToIndex, DOMParser, postURLs })
    .then(text => createFile({
      pageURL: "/",
      filename: "_redirects",
      output: text,
      mkdirp
    }))
    .catch(err => console.error(err));
}

function buildError404Page({ askSearchEnginesNotToIndex, mkdirp, DOMParser }) {
  console.log(`🚥 Preparing 404 "not found" page`);
  createFile({
    pageURL: "/",
    filename: "404.html",
    output: getError404HTML({ askSearchEnginesNotToIndex, DOMParser }),
    mkdirp
  });
}

async function build({ urls, env, mkdirp, DOMParser }) {
  console.log(urls);

  const askSearchEnginesNotToIndex = env.ASK_SEARCH_ENGINES_NOT_TO_INDEX;

  buildPages({ urls, askSearchEnginesNotToIndex, mkdirp, DOMParser });
  await buildStaticFiles({ mkdirp });

  if (askSearchEnginesNotToIndex != 1 && config.host) {
    buildRobotsText({ askSearchEnginesNotToIndex, mkdirp, DOMParser });
    buildSiteMap({ askSearchEnginesNotToIndex, mkdirp, DOMParser });
  } else {
    if (askSearchEnginesNotToIndex == 1) console.log("⚠️ ", chalk.italic("askSearchEnginesNotToIndex"), "is set to", chalk.italic(true), "in environment");
    if (!config.host) console.log("⚠️ ", chalk.italic("host"), "is not set in", chalk.italic("_config.js"));
    console.log("⚠️  Skipping sitemap.xml");
    removeFile({ pageURL: "/", filename: "sitemap.xml" });
  
    console.log("⚠️  Skipping robots.txt");
    removeFile({ pageURL: "/", filename: "robots.txt" });
  }

  buildRedirectsFile({ askSearchEnginesNotToIndex, mkdirp, DOMParser, urls });
  buildError404Page({ askSearchEnginesNotToIndex, mkdirp, DOMParser });

  console.log("");
  console.log(chalk.cyan("- - - - - - - - - - - - - - - - - - - - - - -"));
  console.log("🏁", chalk.cyan(`Build files saved to`), chalk.italic(config.buildFolder));
  console.log(chalk.cyan("- - - - - - - - - - - - - - - - - - - - - - -"));
  console.log("");
}

console.log("");
console.log(chalk.cyan("- - - - - - - - - - - - - - - - - - - - - - -"));
console.log("⏱️ ", chalk.cyan("Starting build"));
console.log(chalk.cyan("- - - - - - - - - - - - - - - - - - - - - - -"));
console.log("");

export {
  build,
}

