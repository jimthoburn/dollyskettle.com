import { mkdirp } from "mkdirp";
import { load } from "dotenv/mod.ts";
import { DOMParser } from "deno_dom/deno-dom-wasm.ts";
import { refreshData, getPublicURLs, getMediaURLs } from "./data/post.js";
import { build } from "./build.js";
import { downloadImages } from "./download-images.js";

// https://deno.land/std/dotenv/mod.ts
const env = await load();

async function buildSite() {
  await build({ urls: getPublicURLs(), env, mkdirp, DOMParser });
}

async function downloadAndBuild() {
  await downloadImages({ urls: getMediaURLs(), env, mkdirp });
  await buildSite();
}

refreshData({ env, mkdirp }).then(downloadAndBuild).catch(err => {
  console.log(err);
  console.log("An error ocurred while downloading data from the API. Retrying build with local data...")

  // If an error happens, try with with local data (in case the API is offline)
  refreshData({ env, mkdirp, useLocalData: true }).then(buildSite)
});
