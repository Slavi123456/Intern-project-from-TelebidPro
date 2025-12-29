import { describe, it, expect, vi } from "vitest";
import { processStatistics } from "../src/statistics.js";

vi.mock("../src/utils", () => ({
    getAvrWordCountInSetence: vi.fn(),
    nonRepeatingWords: vi.fn(),
}));
import { getAvrWordCountInSetence, nonRepeatingWords } from "../src/utils.js";

describe("processStatistics()", () => {
  it("should correctly calculate statistics for countries, authors, and books", () => {
    getAvrWordCountInSetence.mockReturnValue(10); 
    nonRepeatingWords.mockReturnValue(["word1", "word2", "word3"]);

    const dataInfo = [
      {
        countryName: "Country A",
        authorsList: [
          {
            authorName: "Author 1",
            booksList: [
              { name: "Book 1", content: "This is the first book" },
              { name: "Book 2", content: "This is the second book" },
            ],
          },
        ],
      },
      {
        countryName: "Country B",
        authorsList: [
          {
            authorName: "Author 2",
            booksList: [
              { name: "Book 3", content: "This is another book" },
            ],
          },
        ],
      },
    ];

    const result = processStatistics(dataInfo);

    expect(result.countriesCount).toBe(2);
    expect(result.countAuthors).toBe(2);
    expect(result.countBooks).toBe(3);
    expect(result.authorsStatistics).toStrictEqual([
      {
        name: "Author 1",
        avrWordInSentence: 3, 
        avrUniqueWordCount: 10, 
      },
      {
        name: "Author 2",
        avrWordInSentence: 3,
        avrUniqueWordCount: 10,
      },
    ]);
    expect(result.booksStatistics).toStrictEqual([
      {
        title: "Book 1",
        countUniqueWords: 3, 
        avrWordCountInSentence: 10,
      },
      {
        title: "Book 2",
        countUniqueWords: 3,  
        avrWordCountInSentence: 10,
      },
      {
        title: "Book 3",
        countUniqueWords: 3, 
        avrWordCountInSentence: 10, 
      },
    ]);
  });

  it("should handle edge cases when no authors or books are present", () => {
    const dataInfo = [
      {
        countryName: "Country A",
        authorsList: [],
      },
    ];

    const result = processStatistics(dataInfo);

    expect(result.countriesCount).toBe(1);
    expect(result.countAuthors).toBe(0);
    expect(result.countBooks).toBe(0);
    expect(result.authorsStatistics).toEqual([]);
    expect(result.booksStatistics).toEqual([]);
  });
});
