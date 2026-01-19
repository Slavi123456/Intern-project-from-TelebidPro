import * as cheerio from "cheerio";
import path from "path";
import { createUrls } from "../services/website_fetch.js";
import { scrapeInformation } from "../scrapers/generic.js";
import { bulkCreateDirectory } from "../services/filesystem_manager.js";
import { downloadZip } from "../services/download_services.js";
import { unzipFile } from "../services/zip_manager.js";
import { __websiteUrl } from "../paths.js";
import { readBookText } from "../services/filesystem_manager.js";

export {extractBookInfo, processBook, downloadAndUnzipBooks};
const SLICE_OF_OBJECTS = 1;


async function processBook(authorInfo) {
  const booksInfo = await scrapeInformation(authorInfo.authorFullUrl, extractBookInfo);

  if (booksInfo.length === 0) {
    return;
  }

  const bookNames = booksInfo
    .slice(0, SLICE_OF_OBJECTS)
    .map((item) => item.title);
  const booksUrlExtensions = booksInfo
    .slice(0, SLICE_OF_OBJECTS)
    .map((item) => item.txtZipLink);

  const booksUrls = createUrls(__websiteUrl, booksUrlExtensions);
  const bookDir = await bulkCreateDirectory(authorInfo.authorDir, bookNames);

  await downloadAndUnzipBooks(booksUrls, bookDir, bookNames, authorInfo);
}

async function downloadAndUnzipBooks(booksUrls, bookDir, bookNames, authorInfo) {
  authorInfo.booksList = [];
  for (let i = 0; i < booksUrls.length; ++i) {
    const zipName = "book" + ".zip";
    const fullOutput = path.join(bookDir[i], zipName);
    const zipDir = path.dirname(fullOutput);

    await downloadZip(booksUrls[i], fullOutput);
    await unzipFile(fullOutput, zipDir);
    
    const bookText = await readBookText(zipDir);
    const book = {
      name: bookNames[i],
      content: bookText.substring(0, 100),
      bookDir: bookDir[i],
      bookUrl: booksUrls[i],
    };

    authorInfo.booksList.push(book);
  }
}

function extractBookInfo(html) {
  const $ = cheerio.load(html);
  const results = [];

  $("#texts dl.text-entity").each((_, dl) => {
    const title = $(dl).find(".text-title a i").text().trim();

    const txtZipLink = $(dl).find('a[href$=".txt.zip"]').attr("href");

    if (title && txtZipLink) {
      results.push({
        title,
        txtZipLink,
      });
    }
  });

  return results;
}
