export const RedirectsText = ({ redirects }) => {
  console.log({"RedirectsText": 1, redirects});

  /*
    https://docs.netlify.com/routing/redirects/#syntax-for-the-redirects-file
    Example:
    from      to
    ----      -----
    /         /2011/05/28/organic-chocolate-chunk-cookies/      302

  */

  // https://docs.netlify.com/routing/redirects/redirect-options/#http-status-codes
  const status = 302 // Temporary redirect

  // https://docs.netlify.com/routing/redirects/rewrites-proxies/#shadowing
  const force = "!";

  const redirectLines = redirects.map(
    ({from, to}) => `${from} ${to} ${status}${force}`
  );

  const text = redirectLines.join("\n");

  console.log({ redirectLines });

  return text;
};
