import { mkdirp } from "mkdirp";
import { load } from "dotenv/mod.ts";
import { DOMParser } from "deno_dom/deno-dom-wasm.ts";
import { refreshData, getPublicURLs, getMediaURLs } from "./data/post.js";
import { build } from "./build.js";

// https://deno.land/std/dotenv/mod.ts
const env = await load();

refreshData({ env, mkdirp }).then(() => {
  downloadImages({ urls: getMediaURLs(), env, mkdirp });
  build({ urls: getPublicURLs(), env, mkdirp, DOMParser });
});
