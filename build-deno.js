import { mkdirp } from "mkdirp";
import { load } from "@std/dotenv";
import { DOMParser } from "@b-fuze/deno-dom";
import { refreshData, getPublicURLs } from "./data/post.js";
import { build } from "./build.js";

// https://jsr.io/@std/dotenv
const env = await load();

refreshData({ env, mkdirp }).then(async () => {
  await build({ urls: getPublicURLs(), env, mkdirp, DOMParser });
});
