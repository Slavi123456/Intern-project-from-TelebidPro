import { fetchPage } from "../services/website_fetch.js";

export {scrapeInformation};

// async function bulkScrapingAuthors(urls, ExtractDataFunction) {
//   let authorsInfo = [];
//   for (const url of urls) {
//     authorsInfo.push(await scrapeInformation(url, ExtractDataFunction));
//   }
//   return authorsInfo;
// }

async function scrapeInformation(baseUrl, ExtractDataFunction) {
  try {
    const html = await fetchPage(baseUrl);
    return ExtractDataFunction(html);
  } catch (error) {
    console.error("Error fetching page:", error.message);
  }
}
