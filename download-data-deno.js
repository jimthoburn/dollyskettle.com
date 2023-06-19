import { mkdirp } from "mkdirp";
import { load } from "dotenv/mod.ts";
import { refreshData } from "./data/post.js";

// https://deno.land/std/dotenv/mod.ts
const env = await load();

refreshData({ env, mkdirp });
