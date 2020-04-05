
import fs                   from "fs-extra";
import mkdirp               from "mkdirp";
import chalk                from "chalk";

import { config }           from "./_config.js";

import { getPostsByURL }    from "./data/post.js";
import { getSourceByURL }   from "./get-source/by-url.js";
import { getError404HTML }  from "./get-source/error.js";


const GENERATED_FILES_FOLDER = `./${config.buildFolder}`;


function createFile({ pageURL, filename, output }) {

  const writePath = GENERATED_FILES_FOLDER + pageURL;
  
  console.log({ pageURL, filename });
  console.log ({writePath});

  mkdirp(writePath, function (err) {
    if (err) {
      console.error(err);
    } else {
      fs.writeFileSync(`${writePath}/${filename ? filename : "index.html"}`, output, 'utf8', (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

function removeFile({ pageURL, filename }) {
  const writePath = GENERATED_FILES_FOLDER + pageURL;

  const path = `${writePath}/${filename ? filename : "index.html"}`;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

function copy({source, destination}) {
  // console.log(`📂 Copying files from: ${source}`);

  // https://www.npmjs.com/package/fs-extra
  fs.copy(source, destination, function (err) {
    if (err){
      console.log('An error occured while copying the folder.')
      return console.error(err)
    }
  });
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
  const source      = `./_public`;
  const destination = `${GENERATED_FILES_FOLDER}`;

  copy({source, destination});
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
getPostsByURL().then(build);

