import { mkdirp } from "mkdirp";
// https://stackoverflow.com/questions/11398419/trying-to-use-the-domparser-with-node-js#answer-54096238
import jsdom from "jsdom";
const { JSDOM } = jsdom;
const DOMParser = new JSDOM().window.DOMParser;
import { refreshData, getPublicURLs } from "./data/post.js";
import { build } from "./build.js";

const env = globalThis.process.env;

refreshData({ env, mkdirp }).then(() => {
  build({ urls: getPublicURLs(), env, mkdirp, DOMParser });
});
