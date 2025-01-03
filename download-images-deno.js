import { mkdirp } from "mkdirp";
import { load } from "dotenv/mod.ts";
import { refreshData, getMediaURLs } from "./data/post.js";
import { downloadImages } from "./download-images.js";

// https://deno.land/std/dotenv/mod.ts
const env = await load();

refreshData({ env, mkdirp }).then(async () => {
  await downloadImages({ urls: getMediaURLs(), env, mkdirp });
  console.log("Finished downloading images")
});
