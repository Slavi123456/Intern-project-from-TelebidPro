import path from "path";
import { createUrls } from "./services/website_fetch.js";
import { __scrappedFileDir, __websiteUrl } from "./paths.js";
import { bulkCreateDirectory } from "./services/filesystem_manager.js";
import { scrapeAuthorCountries } from "./scrapers/countries.js";
import { bulkScrapingAuthors, scrapeAuthor } from "./scrapers/authors.js";
import { bulkScrapingBooks, scrapeAuthorWorks } from "./scrapers/book.js";
import {
  bulkBookDownloadZips,
  downloadZip,
} from "./services/download_services.js";
import { bulkUnzipFile, unzipFile } from "./services/zip_manager.js";
import { readBookText } from "./extractors/books.js";
("use-strict");

main();

async function main() {
  const baseUlr = "https://chitanka.info/authors";
  // const dataMap = new Map();
  // const dataMap = [];
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

    // for (let i = 0; i < scrapedCountries.length; ++i) {
    //   let newObj = {
    //     countryInfo: scrapedCountries[i],
    //     countryDirectory: newCountryDir[i],
    //     countryUrl: countriesUrls[i],
    //   };
    //   // dataMap.set(scrapedCountries[i].country, newObj);
    //   dataMap.push(newObj);
    // }
    // console.log(dataMap);
    let countriesInfo = [];
    for (let i = 0; i < scrapedCountries.slice(0, 2).length; ++i) {
      const countryInfo = {
        name: scrapedCountries[i].country,
        countryDir: newCountryDir[i],
        countryFullUrl: countriesUrls[i],
      };
      countriesInfo.push(countryInfo);
    }

    const SLICE_OF_OBJECTS = 1;
    for (const obj of countriesInfo) {
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
  } catch (error) {
    console.error("Error fetching page:", error.message);
    console.error("Error fetching page:", err);
  }
}
