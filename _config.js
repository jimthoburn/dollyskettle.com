
export const config = {

  // The place where this site will be published (this is used for open graph images and the site map).
  "host": "https://staging.dollyskettle.com",
  "data": {
    "post": "https://write.dollyskettle.com/wp-json/wp/v2/posts?per_page=10&_embed=1"
  },

  // https://dev.to/pickleat/add-an-emoji-favicon-to-your-site-co2
  // https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/233/frame-with-picture_1f5bc.png
  // "favicon": "/favicon/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com-thumbs-120-twitter-233-frame-with-picture_1f5bc.png",

  "buildFolder"   : "_site",
  "serverPort"    : "4000",
  "staticFolders" : [
    "css"
  ],

  "redirects": {
    "/": "FIRST_POST"
  }

};
