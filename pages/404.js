
import { createElement }  from "preact";
import   htm              from "htm";
const    html = htm.bind(createElement);


const error404PageTitle = "This page couldn’t be found.";


function Error404Page() {

  return html`
  <section class="dialog">
    <header><h1 style="max-width: none">Oops, this page couldn’t be found.</h1></header>
    <p>You might find what you’re looking for in the <a href="/recipes">recipe list</a>.</p>
  </section>
  `;
}


export { Error404Page, error404PageTitle };

