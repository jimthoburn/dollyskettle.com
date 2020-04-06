
export const config = {

  // The place where this site will be published (this is used for open graph images and the site map).
  "host": "https://staging.dollyskettle.com",
  "data": {
    "posts": "https://write.dollyskettle.com/wp-json/wp/v2/posts?per_page=100&page=${ pageNumber }&_embed=1",
    "pages": "https://write.dollyskettle.com/wp-json/wp/v2/pages?per_page=100&page=${ pageNumber }&_embed=1"
  },

  // Path to favicon in public folder
  // "favicon": "/favicon.png",

  "buildFolder"   : "_site",

  "staticFolders" : [
    "css"
  ],

  "redirects": {
    "/": "FIRST_POST"
  }

};
