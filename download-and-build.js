import { mkdirp } from "mkdirp";
import { load } from "dotenv/mod.ts";
import { DOMParser } from "deno_dom/deno-dom-wasm.ts";
import { refreshData, getPublicURLs, getMediaURLs } from "./data/post.js";
import { build } from "./build.js";
import { downloadImages } from "./download-images.js";

// https://deno.land/std/dotenv/mod.ts
const env = await load();

refreshData({ env, mkdirp }).then(async () => {
  await downloadImages({ urls: getMediaURLs(), env, mkdirp });
  await build({ urls: getPublicURLs(), env, mkdirp, DOMParser });
});
