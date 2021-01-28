
function fetchText({url, fetch}) {
  return new Promise((resolve, reject) => {
    let response;
    fetch(url)
      .then(r => {
        response = r;
        response.text().then(function (text) {
          if (response.ok || JSON.parse(text).code === "rest_post_invalid_page_number") {
            resolve(text);
          } else {
            throw new Error('Network response was not ok');
          }
        }).catch(err => { throw err; });
      })
      .catch(err => { throw err; });
  });
}

function fetchJSON({url, fetch}) {
  return new Promise(async (resolve, reject) => {
    const text = await fetchText({url, fetch}).catch(err => { throw err; });
    try {
      const json = JSON.parse(text);
      resolve(json);
    } catch(error) {
      console.error(error);
      resolve(null);
    }
  });
}


export {
  fetchJSON,
  fetchText
}
