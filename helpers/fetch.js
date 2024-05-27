
async function fetchText({url, fetch}) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    if (response.ok || JSON.parse(text).code === "rest_post_invalid_page_number") {
      return text;
    } else {
      throw new Error('Network response was not ok');
    }
  } catch(err) {
    throw err;
  }
}

async function fetchJSON({url, fetch}) {
  const text = await fetchText({url, fetch}).catch(err => { throw err });
  try {
    const json = JSON.parse(text);
    return json;
  } catch(error) {
    console.error(error);
    return null;
  }
}


export {
  fetchJSON,
  fetchText
}
