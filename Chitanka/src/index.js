import path from "path";
import { __scrappedFileDir, __websiteUrl } from "./paths.js";

import { createUrls } from "./services/website_fetch.js";
import { bulkCreateDirectory } from "./services/filesystem_manager.js";
import { scrapeAuthorCountries } from "./scrapers/countries.js";
import { scrapeAuthor } from "./scrapers/authors.js";
import { scrapeAuthorWorks } from "./scrapers/book.js";
import { downloadZip } from "./services/download_services.js";
import { unzipFile } from "./services/zip_manager.js";
import { readBookText } from "./extractors/books.js";

import client from "./config/db.js";

("use-strict");

main();

async function main() {
  const dataInfo = await extractingCycle();
  if(dataInfo == null) { return; }
  
  //do more operations to the text
  //saving the data
  //retrieving statistics
}



async function extractingCycle() {
  const baseUlr = "https://chitanka.info/authors";
  try {
    const scrapedCountries = await scrapeAuthorCountries(baseUlr);

    const countriesNames = scrapedCountries
      .slice(0, 2)
      .map((item) => item.country);
    const newCountryDir = await bulkCreateDirectory(
      __scrappedFileDir,
      countriesNames
    );

    const countriesUrlExtensions = scrapedCountries
      .slice(0, 2)
      .map((item) => item.href);
    const countriesUrls = createUrls(__websiteUrl, countriesUrlExtensions);

    let dataInfo = [];
    for (let i = 0; i < scrapedCountries.slice(0, 2).length; ++i) {
      const countryInfo = {
        name: scrapedCountries[i].country,
        countryDir: newCountryDir[i],
        countryFullUrl: countriesUrls[i],
      };
      dataInfo.push(countryInfo);
    }

    const SLICE_OF_OBJECTS = 1;
    for (const obj of dataInfo) {
      const countryFullUrl = obj.countryFullUrl;
      const authorsInfo = await scrapeAuthor(countryFullUrl);

      const authorsUrlExtensions = authorsInfo
        .slice(0, SLICE_OF_OBJECTS)
        .map((item) => item.href);
      const authorsUrls = createUrls(__websiteUrl, authorsUrlExtensions);
      const authorDir = await bulkCreateDirectory(
        obj.countryDir,
        authorsInfo.slice(0, SLICE_OF_OBJECTS).map((item) => item.author)
      );

      obj.authorsList = [];
      for (let i = 0; i < authorsInfo.slice(0, SLICE_OF_OBJECTS).length; ++i) {
        let authorInfo = {
          authorName: authorsInfo[i].author,
          authorDir: authorDir[i],
          authorFullUrl: authorsUrls[i],
        };
        obj.authorsList.push(authorInfo);
      }

      for (const author of obj.authorsList) {
        const authorFullUrl = author.authorFullUrl;
        const booksInfo = await scrapeAuthorWorks(authorFullUrl);

        const bookNames = booksInfo
          .slice(0, SLICE_OF_OBJECTS)
          .map((item) => item.title);
        const booksUrlExtensions = booksInfo
          .slice(0, SLICE_OF_OBJECTS)
          .map((item) => item.txtZipLink);

        const booksUrls = createUrls(__websiteUrl, booksUrlExtensions);

        const bookDir = await bulkCreateDirectory(author.authorDir, bookNames);

        author.booksList = [];
        for (let i = 0; i < booksUrls.length; ++i) {
          const zipName = bookNames[i] + ".zip";
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

          author.booksList.push(book);
        }
      }
    }

    console.log(dataInfo);
    return dataInfo;
  } catch (error) {
    console.error("Error fetching page:", error.message);
    console.error("Error fetching page:", err);
  }
}
