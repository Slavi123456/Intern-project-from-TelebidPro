import { __scrappedFileDir,__websiteUrl } from "../paths.js";
import { extractBookInfo } from "../extractors/books.js";
import { bulkCreateDirectory } from "../services/filesystem_manager.js";
import { bulkBookDownloadZips } from "../services/download_services.js";
import { fetchPage } from "../services/website_fetch.js";
import { bulkUnzipFile } from "../services/zip_manager.js";
import { bulkReadBookText, printTexts } from "../extractors/books.js";

export {bulkScrapingBooks, scrapeAuthorWorks};

async function bulkScrapingBooks(urls) {
  let booksInfo  = [];
  for (const url of urls) {
    booksInfo.push(await scrapeAuthorWorks(url));
  }
  return booksInfo;
}

// const baseUlr = "https://chitanka.info/person/Anna-Blaman";
async function scrapeAuthorWorks(baseUrl) {
  try {
    const html = await fetchPage(baseUrl);
    const bookInfo = extractBookInfo(html);

    return bookInfo;
  } catch (error) {
    console.error("Error fetching page:", error.message);
  }
}

async function fetchBookInfo(cheerio) {
  const infoDiv = cheerio("div.book-extra-info");
  const info = {};

  infoDiv.find("p").each((i, el) => {
    let text = cheerio(el).text().trim();

    const [key, value] = text.split(":").map((x) => x.trim());

    if (key && value) {
      info[key] = value;
    }
  });

  //   console.log(info);
  return info;
}