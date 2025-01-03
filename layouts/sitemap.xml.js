export const SiteMapXML = ({ host, urls }) => {

  // console.log(urls);

  const items = [];

  function addItem(url) {
    items.push(
`  <url>
    <loc>${host || ""}${url}</loc>
  </url>
`
    );
  }

  for (let url of urls) {
    addItem(url);
  }

  const xml = 
`<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="
    http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
  ">
${items.join("")}
</urlset>
`;

  return xml;
};
