
import { normalizeURL }      from "../helpers/url.js";

// SHIM: Use a fallback image, just in case the post image isn’t available in the API
//       https://core.trac.wordpress.org/ticket/41445
const fallbackImage = {
  src: "https://dollyskettle.com/wp-content/themes/kettle/images/farmhouse.jpg",
  width: 3600,
  height: 2520
};

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
    return fallbackImage;
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
    return fallbackImage;
  }
}

// https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
function getFormattedDate({ date }) {
  const d = new Date(date);
  const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' });
  const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(d);

  return `${mo} ${da}, ${ye}`;
}

function __getNormalizedCategories(category) {
  if (Array.isArray(category)) {
    return category.map(__getNormalizedCategories).flat();
  } else if (category.name && category.link) {
    return [{
      title: category.name,
      url: `/${normalizeURL(category.link)}/`
    }];
  } else {
    console.log(`Unexpected category data:`);
    console.log(category);
  }
}

function getNormalizedCategories({ post }) {
  try {
    return __getNormalizedCategories(post._embedded["wp:term"]);
  } catch(error) {
    console.log(`Couldn’t find a category for post: ${ post.link }`);
    console.log(error);
  }
}


export {
  getBackgroundImage,
  getPostImage,
  getFormattedDate,
  getNormalizedCategories
}

