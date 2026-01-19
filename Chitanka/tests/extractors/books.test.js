import { describe, it, expect, vi, beforeEach} from "vitest";
import path from "path";
import { extractBookInfo, downloadAndUnzipBooks, processBook } from "../../src/extractors/books.js";

vi.mock("../../src/services/download_services.js", () => ({
  downloadZip: vi.fn()
}))
vi.mock("../../src/services/zip_manager.js", () => ({
  unzipFile: vi.fn()
}))

vi.mock("../../src/services/website_fetch.js", () => ({
  createUrls: vi.fn()
}))
vi.mock("../../src/scrapers/generic.js", () => ({
  scrapeInformation: vi.fn()
}))
vi.mock("../../src/services/filesystem_manager.js", () => ({
  readBookText: vi.fn(),
  bulkCreateDirectory: vi.fn()
}))

import { scrapeInformation } from "../../src/scrapers/generic.js";
import { createUrls } from "../../src/services/website_fetch.js";
import { readBookText, bulkCreateDirectory } from "../../src/services/filesystem_manager.js";
import { downloadZip } from "../../src/services/download_services.js";
import { unzipFile } from "../../src/services/zip_manager.js";


describe('processBook', () => {
  const mockAuthorInfo = {
    authorFullUrl: 'https://example.com/author1',
    authorDir: '/path/to/author1',
    booksList: [],
  };

  const mockBooksInfo = [
    { title: 'Book 1', txtZipLink: 'https://example.com/book1.zip' },
    { title: 'Book 2', txtZipLink: 'https://example.com/book2.zip' },
  ];

  const mockBooksUrls = [
    'https://example.com/book1.zip',
    'https://example.com/book2.zip',
  ];

  const mockBookNames = ['Book 1', 'Book 2'];
  const mockBookDirs = ['/path/to/book1', '/path/to/book2'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // it('should scrape books, generate URLs, create directories, and process books', async () => {
  //   // Mocking the external function implementations
  //   vi.mocked(scrapeInformation).mockResolvedValue(mockBooksInfo);
  //   vi.mocked(createUrls).mockReturnValue(mockBooksUrls);
  //   vi.mocked(bulkCreateDirectory).mockResolvedValue(mockBookDirs);
  //   vi.mocked(downloadZip).mockResolvedValue(undefined);
  //   vi.mocked(unzipFile).mockResolvedValue(undefined);
  //   vi.mocked(readBookText).mockResolvedValue('Some book content');

  //   // Call the function
  //   await processBook(mockAuthorInfo);

  //   // Assertions
  //   expect(vi.mocked(scrapeInformation)).toHaveBeenCalledWith(mockAuthorInfo.authorFullUrl, expect.any(Function));
  //   expect(vi.mocked(createUrls)).toHaveBeenCalledWith(__websiteUrl, mockBooksInfo.map(item => item.txtZipLink));
  //   expect(vi.mocked(bulkCreateDirectory)).toHaveBeenCalledWith(mockAuthorInfo.authorDir, mockBookNames);
  //   expect(vi.mocked(downloadZip)).toHaveBeenCalledTimes(2);
  //   expect(vi.mocked(unzipFile)).toHaveBeenCalledTimes(2);
  //   expect(vi.mocked(readBookText)).toHaveBeenCalledTimes(2);

  //   // Check that books were added to booksList
  //   expect(mockAuthorInfo.booksList).toHaveLength(2);
  //   expect(mockAuthorInfo.booksList[0]).toEqual({
  //     name: 'Book 1',
  //     content: 'Some book content'.substring(0, 100),
  //     bookDir: '/path/to/book1',
  //     bookUrl: 'https://example.com/book1.zip',
  //   });
  //   expect(mockAuthorInfo.booksList[1]).toEqual({
  //     name: 'Book 2',
  //     content: 'Some book content'.substring(0, 100),
  //     bookDir: '/path/to/book2',
  //     bookUrl: 'https://example.com/book2.zip',
  //   });
  // });

  // it('should handle empty books info gracefully', async () => {
  //   scrapeInformation.mockResolvedValue([]);

  //   await processBook(mockAuthorInfo);
  //   // console.log(mockAuthorInfo);
  //   expect(mockAuthorInfo.booksList).toHaveLength(0);
  // });

  it('should handle errors during scraping gracefully', async () => {
    vi.mocked(scrapeInformation).mockRejectedValue(new Error('Scraping failed'));

    await expect(processBook(mockAuthorInfo)).rejects.toThrowError(Error);
  });
});

describe('downloadAndUnzipBooks', () => {
  it('should download, unzip, and process each book', async () => {
    const booksUrls = ['https://example.com/book1.zip', 'https://example.com/book2.zip'];
    const bookDirs = ['/path/to/book1', '/path/to/book2'];
    const bookNames = ['Book 1', 'Book 2'];
    const mockAuthorInfo = { booksList: [] };

    vi.mocked(downloadZip).mockResolvedValue(undefined);
    vi.mocked(unzipFile).mockResolvedValue(undefined);
    vi.mocked(readBookText).mockResolvedValue('Some book content');

    await downloadAndUnzipBooks(booksUrls, bookDirs, bookNames, mockAuthorInfo);

    expect(vi.mocked(downloadZip)).toHaveBeenCalledTimes(2);
    expect(vi.mocked(unzipFile)).toHaveBeenCalledTimes(2);
    expect(vi.mocked(readBookText)).toHaveBeenCalledTimes(2);
    expect(mockAuthorInfo.booksList).toHaveLength(2);
  });

  it('should handle empty book URLs gracefully', async () => {
    const mockAuthorInfo = { booksList: [] };

    await downloadAndUnzipBooks([], [], [], mockAuthorInfo);
    expect(mockAuthorInfo.booksList).toHaveLength(0);
  });
});

describe("extractBookInfo", () => {
  it("extracts book titles and txt.zip links", () => {
    const html = `
      <div id="texts">
        <dl class="text-entity">
          <dt class="text-title">
            <a href="/ebooks/1"><i>Book One</i></a>
          </dt>
          <dd>
            <a href="/files/book-one.txt.zip">Download</a>
          </dd>
        </dl>

        <dl class="text-entity">
          <dt class="text-title">
            <a href="/ebooks/2"><i>Book Two</i></a>
          </dt>
          <dd>
            <a href="/files/book-two.txt.zip">Download</a>
          </dd>
        </dl>

        <dl class="text-entity">
          <dt class="text-title">
            <a href="/ebooks/3"><i>Book Three</i></a>
          </dt>
        </dl>
      </div>
    `;

    const result = extractBookInfo(html);

    expect(result).toEqual([
      {
        title: "Book One",
        txtZipLink: "/files/book-one.txt.zip",
      },
      {
        title: "Book Two",
        txtZipLink: "/files/book-two.txt.zip",
      },
    ]);
  });

  it("returns empty array if no valid books exist", () => {
    const html = `<div id="texts"></div>`;

    const result = extractBookInfo(html);

    expect(result).toEqual([]);
  });
});


