
import { extractAuthors } from "../extractors/authors.js";
import { fetchPage } from "../services/website_fetch.js";

export {bulkScrapingAuthors, scrapeAuthor};

async function bulkScrapingAuthors(urls) {
  let authorsInfo = [];
  for (const url of urls) {
    authorsInfo.push(await scrapeAuthor(url));
  }
  return authorsInfo;
}


// const baseUlr = "https://chitanka.info/authors/country/-";
async function scrapeAuthor(baseUrl) {
  try {
    const html = await fetchPage(baseUrl);
    // console.log(html);
    return extractAuthors(html);

  } catch (error) {
    console.error("Error fetching page:", error.message);
  }
}
