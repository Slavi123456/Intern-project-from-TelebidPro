import { describe, it, expect, vi , beforeEach} from "vitest";
import { populateTables } from "../../src/model/main_insert.js";

vi.mock("../../src/model/books", () => ({
  insertIntoTableBooks: vi.fn(),
}));

vi.mock("../../src/model/authors", () => ({
  insertIntoTableAuthors: vi.fn(),
}));

vi.mock("../../src/model/countries", () => ({
  insertIntoTable: vi.fn(),
}));

import * as authorModel from "../../src/model/authors";
import * as bookModel from "../../src/model/books";
import * as countryModel from "../../src/model/countries";

describe("populateTables", () => {
  beforeEach(() => {
     vi.resetAllMocks();
  })
  it("should call insertIntoTable for countries with correct data", async () => {
    const dataInfo = [
      { name: "Country1", authorsList: [] },
      { name: "Country2", authorsList: [] },
    ];

    countryModel.insertIntoTable.mockResolvedValue([
      { id: 1, name: "Country1" },
      { id: 2, name: "Country2" },
    ]);
    authorModel.insertIntoTableAuthors.mockResolvedValue([]);
    bookModel.insertIntoTableBooks.mockResolvedValue([]);

    await populateTables(dataInfo);

    expect(countryModel.insertIntoTable).toHaveBeenCalledWith("Countries", [
      "Country1",
      "Country2",
    ]);
  });

  it("should call insertIntoTableAuthors for each country with correct authors data", async () => {
    const dataInfo = [
      {
        name: "Country1",
        authorsList: [{ authorName: "Author1", booksList: [] }],
      },
    ];

    countryModel.insertIntoTable.mockResolvedValue([{ id: 1 }]);
    authorModel.insertIntoTableAuthors.mockResolvedValue([
      { id: 1, name: "Author1" },
    ]);
    bookModel.insertIntoTableBooks.mockResolvedValue([]);

    await populateTables(dataInfo);

    expect(authorModel.insertIntoTableAuthors).toHaveBeenCalledWith("Authors", [
      { name: "Author1", countryId: 1 },
    ]);
  });

  it("should call insertIntoTableBooks for each author with correct books data", async () => {
    const dataInfo = [
      {
        name: "Country1",
        authorsList: [
          {
            authorName: "Author1",
            booksList: [{ name: "Book1", content: "Book content" }],
          },
        ],
      },
    ];

    countryModel.insertIntoTable.mockResolvedValue([{ id: 1 }]);
    authorModel.insertIntoTableAuthors.mockResolvedValue([
      { id: 1, name: "Author1" },
    ]);
    bookModel.insertIntoTableBooks.mockResolvedValue([
      { id: 1, title: "Book1" },
    ]);

    await populateTables(dataInfo);

    expect(bookModel.insertIntoTableBooks).toHaveBeenCalledWith("Books", [
      {
        title: "Book1",
        content: "Book content",
        authorId: 1,
      },
    ]);
  });

  it("should handle an empty dataInfo array correctly", async () => {
    const dataInfo = [];

    countryModel.insertIntoTable.mockResolvedValue([]);
    authorModel.insertIntoTableAuthors.mockResolvedValue([]);
    bookModel.insertIntoTableBooks.mockResolvedValue([]);

    await populateTables(dataInfo);

    expect(authorModel.insertIntoTableAuthors).not.toHaveBeenCalled();
    expect(bookModel.insertIntoTableBooks).not.toHaveBeenCalled();
  });
});
