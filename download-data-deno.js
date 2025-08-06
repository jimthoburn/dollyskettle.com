import { mkdirp } from "mkdirp";
import { load } from "@std/dotenv";
import { refreshData } from "./data/post.js";

// https://jsr.io/@std/dotenv
const env = await load();

refreshData({ env, mkdirp });
