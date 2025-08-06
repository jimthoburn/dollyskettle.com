import { mkdirp } from "mkdirp";
import { load } from "@std/dotenv";
import { refreshData, getMediaURLs } from "./data/post.js";
import { downloadImages } from "./download-images.js";

// https://jsr.io/@std/dotenv
const env = await load();

refreshData({ env, mkdirp }).then(async () => {
  await downloadImages({ urls: getMediaURLs(), env, mkdirp });
  console.log("Finished downloading images")
});
