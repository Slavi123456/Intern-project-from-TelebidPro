import * as cheerio from "cheerio";
import { processBook } from "./books.js";
import { createUrls } from "../services/website_fetch.js";
import { scrapeInformation } from "../scrapers/generic.js";
import { bulkCreateDirectory } from "../services/filesystem_manager.js";
import { __websiteUrl } from "../paths.js";

export {extractAuthors, processAuthors, processBooksForAuthor};

const SLICE_OF_OBJECTS = 1;

async function processAuthors(countryInfo) {
  const countryFullUrl = countryInfo.countryFullUrl;
  const authorsInfo = await scrapeInformation(countryFullUrl, extractAuthors);

  const authorsUrlExtensions = authorsInfo
    .slice(0, SLICE_OF_OBJECTS)
    .map((item) => item.href);
  const authorsUrls = createUrls(__websiteUrl, authorsUrlExtensions);
  const authorDir = await bulkCreateDirectory(
    countryInfo.countryDir,
    authorsInfo.slice(0, SLICE_OF_OBJECTS).map((item) => item.author),
  );

  await processBooksForAuthor(
    authorsInfo.slice(0, SLICE_OF_OBJECTS),
    authorsUrls,
    authorDir,
    countryInfo,
  );
}

async function processBooksForAuthor(
  authorsInfo,
  authorsUrls,
  authorDir,
  countryInfo,
) {
  countryInfo.authorsList = [];
  for (let i = 0; i < authorsInfo.length; ++i) {
    let authorInfo = {
      authorName: authorsInfo[i].author,
      authorDir: authorDir[i],
      authorFullUrl: authorsUrls[i],
    };

    await processBook(authorInfo);
    countryInfo.authorsList.push(authorInfo);
  }
}

function extractAuthors(html) {
  const $ = cheerio.load(html);
  const result = [];

  $('a[href*="/person"]').each((_, a) => {
    const author = $(a).text().trim();
    const href = $(a).attr("href");

    // console.log(author, href);

    result.push({
      author,
      href,
    });
  });

  return result;
}