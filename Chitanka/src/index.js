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

import {
  insertIntoTable,
  insertIntoTableAuthors,
  insertIntoTableBooks,
} from "./model/countries.js";

("use-strict");

main();

async function main() {
  const dataInfo = await extractingCycle();
  if (dataInfo == null) {
    return;
  }

  // console.log(countriesNames);
  // const authorsDB = dataInfo[0].authorsList.map((author) => { return {
  //     name: author.authorName,
  //     id: 11
  //   };});
  // console.log(authorsDB);
  // const books = dataInfo[0].authorsList[0].booksList.map(book => {
  //   return {
  //     title: book.name,
  //     content: book.content.substring(0, 100),
  //     author_id: 1
  //   }
  // })
  // console.log(books)
  
  const countriesNames = dataInfo.map((item) => item.name);
  const countriesDBInfo = await insertIntoTable("Countries", countriesNames);
  console.log(countriesDBInfo);
  for (let z = 0; z < countriesDBInfo.length; ++z) {
    const countryId = countriesDBInfo[z].id;
    const countryAuthorList = dataInfo[z].authorsList;
    console.log(countryAuthorList);
    
    const authorsDB = countryAuthorList.map((author) => {
        return {
          name: author.authorName,
          countryId: countryId,
        };
      });

      const authorResDB = await insertIntoTableAuthors("Authors", authorsDB);
      console.log(authorResDB);

    for (let i = 0; i < authorResDB.length; ++i) {
      const authorId = authorResDB[i].id;

      const booksDB = countryAuthorList[i].booksList.map((book) => {
        return {
          title: book.name,
          content: book.content.substring(0, 100),
          authorId: authorId,
        };
      });
      const booksRes = await insertIntoTableBooks("Books", booksDB);
      console.log(booksRes);
    }
  }

  //do more operations to the text
  console.log(dataInfo[0].authorsList[0].booksList);
  
  //retrieving statistics
}
//should make a throw handling
async function extractingCycle() {
  const baseUlr = "https://chitanka.info/authors";
  try {
    const SLICE_OF_OBJECTS = 1;
    const scrapedCountries = await scrapeAuthorCountries(baseUlr);

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
    for (let i = 0; i < scrapedCountries.slice(0, SLICE_OF_OBJECTS).length; ++i) {
      const countryInfo = {
        name: scrapedCountries[i].country,
        countryDir: newCountryDir[i],
        countryFullUrl: countriesUrls[i],
      };
      dataInfo.push(countryInfo);
    }

    
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
