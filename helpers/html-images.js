import { config } from "../_config.js";
import { getMedia } from "../data/post.js";

function prepareImagesForLoading({ html, DOMParser }) {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");

    const images = doc.querySelectorAll("img");

    for (const image of images) {

      // Add height attribute for image if it’s missing and we have the data
      const imageData = getMedia(image.getAttribute("src").replace(config.data.host, ""));
      if (
        imageData?.height &&
        imageData?.width &&
        image.hasAttribute("width") &&
        image.hasAttribute("height") === false
      ) {
        const imageRenderedWidth = Number(image.getAttribute("width"));
        const imageRenderedHeight = (imageData.height / imageData.width) * imageRenderedWidth;
        image.setAttribute("height", imageRenderedHeight);
      }

      // Load image lazily if it has width and height attributes
      if (image.hasAttribute("width") && image.hasAttribute("height")) {
        image.setAttribute("loading", "lazy");
      }

    }

    return doc.documentElement.outerHTML;

  } catch(e) {
    console.log(e);
    console.log({html});
    return html;
  }
}

export {
  prepareImagesForLoading
};
