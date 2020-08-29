
import fs                   from "fs-extra";
import mkdirp               from "mkdirp";
import chalk                from "chalk";

import { config }           from "./_config.js";

import { refreshData,
         getPublicURLs }    from "./data/post.js";
import { getSourceByURL,
         getError404HTML }  from "./get-source/by-url.js";


const GENERATED_FILES_FOLDER = `./${config.buildFolder}`;

async function createFile({ pageURL, filename, output }) {
  // if (pageURL == "/" && !filename) {
  // console.log("createFile");
  // console.log({ pageURL, filename, output });
  // }

  const writePath = GENERATED_FILES_FOLDER + pageURL;

  try {
    const folder = await mkdirp(writePath);
    fs.writeFileSync(`${writePath}/${filename ? filename : "index.html"}`, output, 'utf8', (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch(e) {
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

async function copy({source, destination}) {
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
  } catch(e) {
    console.error(err);
  }
}

function buildStaticFiles() {
  console.log(`📂 Preparing static files`);
  for (let folder of config.staticFolders) {

    const folderWithoutLeadingUnderscore = folder.replace(/^_/, "");

    const source      = `./${folder}`;
    const destination = `${GENERATED_FILES_FOLDER}/${folderWithoutLeadingUnderscore}`;

    copy({source, destination});
  }

  const extras = [];

  for (let source of extras) {
    const destination = `${GENERATED_FILES_FOLDER}/${source}`;
    copy({ source, destination });
  }

  // _public is a general folder for any static file to be served from “/”
  (function() {
    const source      = `./_public`;
    const destination = `${GENERATED_FILES_FOLDER}`;
    copy({source, destination});
  })();
  
  // _pictures is a special case, to emulate WordPress URLs
  (function() {
    const source      = `./_pictures`;
    const destination = `${GENERATED_FILES_FOLDER}/wp-content/uploads/`;
    copy({source, destination});
  })();
}

function buildPages(urls) {
  console.log(`📗 Preparing pages`);
  for (let url of urls) {
    getSourceByURL(url)
      .then(html => createFile({ pageURL: url, output: html }))
      .catch(err => console.error(err));
  }
}

async function buildRobotsText() {
  console.log(`🤖 Preparing robots.txt`);
  getSourceByURL("/robots.txt")
    .then(text => createFile({ pageURL: "/", filename: "robots.txt", output: text }))
    .catch(err => console.error(err));
}

function buildSiteMap() {
  console.log(`🗺  Preparing sitemap.xml`);
  getSourceByURL("/sitemap.xml")
    .then(xml => createFile({ pageURL: "/", filename: "sitemap.xml", output: xml }))
    .catch(err => console.error(err));
}

function buildRedirectsFile() {
  console.log(`🗺  Preparing _redirects`);
  getSourceByURL("/_redirects")
    .then(text => createFile({ pageURL: "/", filename: "_redirects", output: text }))
    .catch(err => console.error(err));
}

function buildError404Page() {
  console.log(`🚥 Preparing 404 "not found" page`);
  createFile({ pageURL: "/", filename: "404.html", output: getError404HTML() });
}

function build(urls) {
  console.log(urls);

  buildPages(urls);
  buildStaticFiles();

  buildRobotsText();
  buildSiteMap();

  buildRedirectsFile();
  buildError404Page();

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

refreshData().then(() => {
  build(getPublicURLs());
});

