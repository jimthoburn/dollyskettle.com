
function normalizeURL(url) {
  // Normalize the url
  // 
  //   /recipes/                             ==> recipes
  //   /recipes/cookies/                     ==> recipes/cookies
  //   /recipes/cookies/?test=true           ==> recipes/cookies
  //   https://example.com/recipes/cookies/  ==> recipes/cookies
  //
  return url.split("://").pop()       // protocol
            .replace(/^[^\/]*\//, "") // domain & leading slash
            .split("?").shift()       // query string
            .replace(/\/$/, "");      // trailing slash
}

export {
  normalizeURL
};
