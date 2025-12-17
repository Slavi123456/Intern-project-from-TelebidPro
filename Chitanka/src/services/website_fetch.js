import axios from "axios";

export {fetchPage, createUrls};

async function fetchPage(baseUlr) {
  const response = await axios.get(baseUlr);
  const html = response.data;

  console.log("Page downloaded! from url:", baseUlr);
  return html;
}

function createUrls(baseUlr, extensions) {
  let urls = [];
  for (const ext of extensions) {
    const newUrl = baseUlr + ext;
    urls.push(newUrl);
  }
  return urls;
}
