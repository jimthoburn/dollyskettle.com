
import { normalizeURL }      from "../helpers/url.js";

function getBackgroundImage({ post }) {
  try {
    const image = post._embedded["wp:featuredmedia"][0];
    return {
      src: image.source_url,
      width: image.media_details.width,
      height: image.media_details.height
    }
  } catch(error) {
    console.log(`Couldn’t find a featured image for post: ${ post.link }`);
    console.error(error);
  }
}

function getPostImage({ post }) {
  try {
    const image = post._embedded["wp:featuredmedia"][0]["media_details"]["sizes"]["large"];
    return {
      src: image.source_url,
      width: image.width,
      height: image.height
    }
  } catch(error) {
    console.log(`Couldn’t find an image for post: ${ post.link }`);
    console.error(error);
  }
}

// https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
function getFormattedDate({ date }) {
  const d = new Date(date);
  const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' });
  const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(d);

  return `${mo} ${da}, ${ye}`;
}

function getNormalizedCategory({ post }) {
  try {
    const category = post._embedded["wp:term"][0][0];
    // console.log(`Did find a category for post: ${ post.link }`);
    // console.log(category);
    return {
      label: category.name,
      url: `/${normalizeURL(category.link)}/`
    };
  } catch(error) {
    console.log(`Couldn’t find a category for post: ${ post.link }`);
    console.log(error);
  }
}


export {
  getBackgroundImage,
  getPostImage,
  getFormattedDate,
  getNormalizedCategory
}

