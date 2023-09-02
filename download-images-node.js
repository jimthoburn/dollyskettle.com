import { mkdirp } from "mkdirp";
import { refreshData, getMediaURLs } from "./data/post.js";
import { downloadImages } from "./download-images.js";

const env = globalThis.process.env;

refreshData({ env, mkdirp }).then(() => {
  downloadImages({ urls: getMediaURLs(), env, mkdirp });
});
