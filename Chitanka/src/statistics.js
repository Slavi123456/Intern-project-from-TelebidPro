import {
  getAvrWordCountInSetence,
  nonRepeatingWords,
} from "./utils.js";

export {processStatistics}

function processStatistics(dataInfo) {
  let countCountries = dataInfo.length;
  let countAuthors = 0;
  let countBooks = 0;
  let booksStats = [];
  let authorsStats = [];

  dataInfo.forEach((country) => {
    const authors = country.authorsList;
    countAuthors += authors.length;

    authors.forEach((author) => {
      const books = author.booksList;
      countBooks += books.length;

      let authorBooksStats = [];
      books.forEach((book) => {
        const bookStats = calculateBookStats(book); 
        authorBooksStats.push(bookStats);
      });

      let authorStats = calculateAuthorStats(authorBooksStats);
      if (authorStats) {
        authorsStats.push({
          name: author.authorName,
          ...authorStats,
        });
      }
      booksStats.push(...authorBooksStats);
    });
  });

  
  return {
    countriesCount: countCountries,
    countAuthors: countAuthors,
    countBooks: countBooks,
    authorsStatistics: authorsStats,
    booksStatistics: booksStats,
  }
}


function calculateAuthorStats(booksStats) {
  if (booksStats.length === 0) return null;

  const authorAvrWordCount = booksStats.reduce((accumulator, book) => accumulator + book.countUniqueWords, 0) / booksStats.length;
  const authorAvrUniqueWordCount = booksStats.reduce((accumulator, book) => accumulator + book.avrWordCountInSentence, 0) / booksStats.length;

  return {
    avrWordInSentence: authorAvrWordCount,
    avrUniqueWordCount: authorAvrUniqueWordCount,
  };
}

function calculateBookStats(book) {
  const uniqueWords = nonRepeatingWords(book.content);
  const avrWordCountInSentence = getAvrWordCountInSetence(book.content);
  return {
    title: book.name,
    countUniqueWords: uniqueWords.length,
    avrWordCountInSentence: avrWordCountInSentence,
  };
}