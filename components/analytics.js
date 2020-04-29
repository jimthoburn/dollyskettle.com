
import { createElement }  from "../web_modules/preact.js";
import   htm              from "../web_modules/htm.js";
const    html = htm.bind(createElement);


function Analytics({ id }) {
  return html`
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${ id }"></script>
    <script dangerouslySetInnerHTML=${
      { __html: `
        if (window.location.href.indexOf("https://dollyskettle.com") === 0) {
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag("js", new Date());

          gtag("config", "${ id }");
          gtag("anonymizeIp", true); // https://support.google.com/analytics/answer/2763052
        }
      `}
    }>
    </script>
  `;
}


export { Analytics };

