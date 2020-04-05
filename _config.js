
export const config = {

  // The place where this site will be published (this is used for open graph images and the site map).
  "host": "https://staging.dollyskettle.com",
  "postsDataURL": "https://write.dollyskettle.com/wp-json/wp/v2/posts?page=1&per_page=20",

  // https://dev.to/pickleat/add-an-emoji-favicon-to-your-site-co2
  // https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/233/frame-with-picture_1f5bc.png
  // "favicon": "/favicon/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com-thumbs-120-twitter-233-frame-with-picture_1f5bc.png",

  "buildFolder"   : "_site",
  "serverPort"    : "4000",
  "staticFolders" : [
    "css"
  ]

};
