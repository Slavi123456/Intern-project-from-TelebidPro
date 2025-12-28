import path from "path";
import { __scrappedFileDir, __websiteUrl} from "../paths.js";

import { createUrls } from "../services/website_fetch.js";
import { bulkCreateDirectory } from "../services/filesystem_manager.js";
import { downloadZip } from "../services/download_services.js";
import { unzipFile } from "../services/zip_manager.js";
import { readBookText } from "../extractors/books.js";
import { scrapeInformation } from "../scrapers/generic.js";
import { extractCountries } from "./countries.js";
import { extractAuthors } from "./authors.js";
import { extractBookInfo } from "../extractors/books.js";
export {extractingCycle};

//should make a throw handling
async function extractingCycle() {
  const baseUlr = "https://chitanka.info/authors";
  try {
    const SLICE_OF_OBJECTS = 1;
    const scrapedCountries = await scrapeInformation(baseUlr, extractCountries);

    const countriesNames = scrapedCountries
      .slice(0, SLICE_OF_OBJECTS)
      .map((item) => item.country);
    const newCountryDir = await bulkCreateDirectory(
      __scrappedFileDir,
      countriesNames
    );

    const countriesUrlExtensions = scrapedCountries
      .slice(0, SLICE_OF_OBJECTS)
      .map((item) => item.href);
    const countriesUrls = createUrls(__websiteUrl, countriesUrlExtensions);

    let dataInfo = [];
    for (
      let i = 0;
      i < scrapedCountries.slice(0, SLICE_OF_OBJECTS).length;
      ++i
    ) {
      const countryInfo = {
        name: scrapedCountries[i].country,
        countryDir: newCountryDir[i],
        countryFullUrl: countriesUrls[i],
      };
      dataInfo.push(countryInfo);
    }

    for (const obj of dataInfo) {
      const countryFullUrl = obj.countryFullUrl;
      const authorsInfo = await scrapeInformation(countryFullUrl, extractAuthors);

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
        const booksInfo = await scrapeInformation(authorFullUrl, extractBookInfo);

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

          author.booksList.push(book);
        }
      }
    }

    console.log(dataInfo);
    return dataInfo;
  } catch (error) {
    console.error("Error fetching page:", error.message);
  }
}