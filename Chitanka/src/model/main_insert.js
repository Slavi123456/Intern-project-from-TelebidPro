import { insertIntoTable } from "../model/countries.js";
import { insertIntoTableAuthors } from "./authors.js";
import { insertIntoTableBooks } from "./books.js";

export { populateTables };

async function populateTables(dataInfo) {
  if (dataInfo.length === 0) return;
  const countriesNames = dataInfo.map((item) => item.name);
  const countriesDBInfo = await insertIntoTable("Countries", countriesNames);
  //   console.log(countriesDBInfo);
  for (let z = 0; z < countriesDBInfo.length; ++z) {
    const countryId = countriesDBInfo[z].id;
    const countryAuthorList = dataInfo[z].authorsList;
    // console.log(countryAuthorList);

    const authorsDB = countryAuthorList.map((author) => {
      return {
        name: author.authorName,
        countryId: countryId,
      };
    });

    const authorResDB = await insertIntoTableAuthors("Authors", authorsDB);
    // console.log(authorResDB);

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
      //   console.log(booksRes);
    }
  }
}
