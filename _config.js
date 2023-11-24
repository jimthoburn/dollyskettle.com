
export const MOST_RECENT_POST = "MOST_RECENT_POST";

export const config = {

  // The place where this site will be published (this is used for open graph images and the site map).
  "host": "https://dollyskettle.com",

  // For the file server
  "serverPort"    : "4000",
  "serverHostname" : "0.0.0.0",

  // Location of the WordPress API
  "data": {
    "host"       : "https://content.dollyskettle.com",
    // https://wordpress.stackexchange.com/questions/281881/increase-per-page-limit-in-rest-api
    "posts"      : "/wp-json/wp/v2/posts?per_page=1000&page=${ pageNumber }&_embed=1",
    "pages"      : "/wp-json/wp/v2/pages?per_page=1000&page=${ pageNumber }&_embed=1",
    "media"      : "/wp-json/wp/v2/media?per_page=1000&page=${ pageNumber }&_embed=1",
    // "categories" : "/wp-json/wp/v2/categories?per_page=100&page=${ pageNumber }&_embed=1"
    "openGraphImage": "/wp-content/themes/kettle/images/farmhouse.jpg",
    "postFeaturedImageFallback": {
      src: "/wp-content/themes/kettle/images/farmhouse.jpg",
      width: 3600,
      height: 2520
    }
  },

  // If true, load content from a relative URL. For example:
  // This URL `https://content.dollyskettle.com/wp-content/` is translated to `/wp-content/`
  "useLocalContent": true,

  // Path to favicon in public folder
  // "favicon": "/favicon.png",

  "buildFolder"   : "_site",

  "staticFolders" : [
    "_api",
    "css"
  ],

  "redirects": [
    {
      from: "/",
      to: MOST_RECENT_POST,
    },
    {
      from: "/index/",
      to: "/recipes/",
    },
  ],

};
