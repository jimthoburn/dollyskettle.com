import mkdirp from "mkdirp";
import { refreshData } from "./data/post.js";

const env = globalThis.process.env;

refreshData({ env, mkdirp });
