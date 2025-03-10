
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
    // https://developer.wordpress.org/rest-api/using-the-rest-api/pagination/
    // https://wordpress.stackexchange.com/questions/281881/increase-per-page-limit-in-rest-api
    "posts"      : "/wp-json/wp/v2/posts?per_page=1000&page=${ pageNumber }&order=asc&orderby=date&_embed=1",
    "pages"      : "/wp-json/wp/v2/pages?per_page=1000&page=${ pageNumber }&order=asc&orderby=date&_embed=1",
    "media"      : "/wp-json/wp/v2/media?per_page=1000&page=${ pageNumber }&order=asc&orderby=date&_embed=1",
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
  // https://dev.to/pickleat/add-an-emoji-favicon-to-your-site-co2
  // https://emojipedia.org/twitter/twemoji-12.0/carrot
  // https://em-content.zobj.net/source/twitter/185/carrot_1f955.png
  "favicon": "/favicon/emojipedia-carrot.png",

  "buildFolder"   : "_site",

  "staticFolders" : [
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

    /* SHIM: Redirect old categories to new ones,
       if the old category would return a 404 otherwise,
       in case the old category is re-published.

       A trailing `/*` => gives priority to an existing page.
    */
    {
      from: "/category/paleo/*",
      to: "/category/gluten-free-keto-paleo-low-carb/",
    },
    {
      from: "/category/keto-paleo-low-carb/*",
      to: "/category/gluten-free-keto-paleo-low-carb/",
    },
    {
      from: "/category/low-carb/*",
      to: "/category/gluten-free-keto-paleo-low-carb/",
    },
    {
      from: "/category/salads-with-protein/*",
      to: "/category/salads/",
    },

    {
      from: "https://www.dollyskettle.com/*",
      to: "https://dollyskettle.com/:splat",
    },
    {
      from: "https://dollyskettle-com.netlify.app/*",
      to: "https://dollyskettle.com/:splat",
    },
    {
      from: "https://dollyskettle-com.onrender.com/*",
      to: "https://dollyskettle.com/:splat",
    },
  ],

};
