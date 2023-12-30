
import fs                   from "fs-extra";
import chalk                from "chalk";

import { config }           from "./_config.js";

import { getSourceByURL,
         getError404HTML }  from "./get-source/by-url.js";


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

async function copy({source, destination, mkdirp}) {
  // console.log(`📂 Copying files from: ${source}`);

  try {
    const folder = await mkdirp(destination);
    // https://www.npmjs.com/package/fs-extra
    fs.copy(source, destination, function (err) {
      if (err){
        console.log('An error occured while copying the folder.')
        return console.error(err)
      }
    });
  } catch(err) {
    console.error(err);
  }
}

function buildStaticFiles({ mkdirp }) {
  console.log(`📂 Preparing static files`);
  for (let folder of config.staticFolders) {

    const folderWithoutLeadingUnderscore = folder.replace(/^_/, "");

    const source      = `./${folder}`;
    const destination = `${GENERATED_FILES_FOLDER}/${folderWithoutLeadingUnderscore}`;

    copy({ source, destination, mkdirp });
  }

  const extras = [];

  for (let source of extras) {
    const destination = `${GENERATED_FILES_FOLDER}/${source}`;
    copy({ source, destination, mkdirp });
  }

  // _public is a general folder for any static file to be served from “/”
  (function() {
    const source      = `./_public`;
    const destination = `${GENERATED_FILES_FOLDER}`;
    copy({ source, destination, mkdirp });
  })();
  
  // _pictures is a special case, to emulate WordPress URLs
  (function() {
    const source      = `./_pictures`;
    const destination = `${GENERATED_FILES_FOLDER}/wp-content/uploads/`;
    copy({ source, destination, mkdirp });
  })();
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

function buildRedirectsFile({ askSearchEnginesNotToIndex, mkdirp, DOMParser }) {
  console.log(`🗺  Preparing _redirects`);
  getSourceByURL({ url: "/_redirects", askSearchEnginesNotToIndex, DOMParser })
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

function build({ urls, env, mkdirp, DOMParser }) {
  console.log(urls);

  const askSearchEnginesNotToIndex = env.ASK_SEARCH_ENGINES_NOT_TO_INDEX;

  buildPages({ urls, askSearchEnginesNotToIndex, mkdirp, DOMParser });
  buildStaticFiles({ mkdirp });

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

  buildRedirectsFile({ askSearchEnginesNotToIndex, mkdirp, DOMParser });
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

