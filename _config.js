
export const MOST_RECENT_POST = "MOST_RECENT_POST";

export const config = {

  // The place where this site will be published (this is used for open graph images and the site map).
  "host": "https://staging.dollyskettle.com",

  // Location of the WordPress API
  "data": {
    "host"       : "https://content.dollyskettle.com",
    "posts"      : "/wp-json/wp/v2/posts?per_page=100&page=${ pageNumber }&_embed=1",
    "pages"      : "/wp-json/wp/v2/pages?per_page=100&page=${ pageNumber }&_embed=1",
    "media"      : "/wp-json/wp/v2/media?per_page=100&page=${ pageNumber }&_embed=1"
    // "categories" : "/wp-json/wp/v2/categories?per_page=100&page=${ pageNumber }&_embed=1"
  },

  // If true, use a local copy of files from the WordPress API
  // "useLocalData": true,

  // Path to favicon in public folder
  // "favicon": "/favicon.png",

  "buildFolder"   : "_site",

  "staticFolders" : [
    "_api",
    "css"
  ],

  "redirects": {
    "/": MOST_RECENT_POST
  }

};
