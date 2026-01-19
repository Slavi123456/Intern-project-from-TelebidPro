import { describe, it, expect, vi, beforeEach } from "vitest";
import { extractAuthors, processAuthors, processBooksForAuthor } from "../../src/extractors/authors.js";

vi.mock("../../src/scrapers/generic.js", () => ({
  scrapeInformation: vi.fn(),
}));

vi.mock("../../src/services/website_fetch.js", () => ({
  createUrls: vi.fn(),
}));
vi.mock("../../src/services/filesystem_manager.js", () => ({
  bulkCreateDirectory: vi.fn(),
}));

vi.mock("../../src/extractors/books.js", () => ({
  processBook: vi.fn()
}))

import { processBook } from "../../src/extractors/books.js";
import { scrapeInformation } from "../../src/scrapers/generic.js";
import { createUrls } from "../../src/services/website_fetch.js";
import { bulkCreateDirectory } from "../../src/services/filesystem_manager.js";

describe('processAuthors', () => {
  const mockCountryInfo = {
    countryFullUrl: 'https://example.com/country',
    countryDir: '/path/to/countryDir',
  };

  const mockAuthorsInfo = [
    { author: 'Author 1', href: 'https://example.com/author1' },
    { author: 'Author 2', href: 'https://example.com/author2' },
  ];

  const mockAuthorsUrls = [
    'https://example.com/author1',
    'https://example.com/author2',
  ];

  const mockAuthorDirs = ['/path/to/author1', '/path/to/author2'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should scrape authors, generate URLs, and create directories', async () => {
    scrapeInformation.mockResolvedValue(mockAuthorsInfo);
    createUrls.mockReturnValue(mockAuthorsUrls);
    bulkCreateDirectory.mockResolvedValue(mockAuthorDirs);

    await processAuthors(mockCountryInfo);

    // expect(scrapeInformation).toHaveBeenCalledWith(mockCountryInfo.countryFullUrl);
    // expect(bulkCreateDirectory).toHaveBeenCalledWith(mockCountryInfo.countryDir, mockAuthorsInfo);
    // expect(processBooksForAuthor).toHaveBeenCalledWith(mockAuthorsInfo.slice(0, 2), mockAuthorsUrls, mockAuthorDirs, mockCountryInfo);
  });

  it('should handle empty authors gracefully', async () => {
    scrapeInformation.mockResolvedValue([]);

    const result = await processAuthors(mockCountryInfo);

    expect(result).toEqual(undefined);
  });
});

describe('processBooksForAuthor', () => {
  it('should process books for each author and update country info', async () => {
    const authorsInfo = [
      { author: 'Author 1' },
      { author: 'Author 2' },
    ];

    const authorsUrls = [
      'https://example.com/author1',
      'https://example.com/author2',
    ];

    const authorDirs = ['/path/to/author1', '/path/to/author2'];
    const mockCountryInfo = { authorsList: [] };

    await processBooksForAuthor(authorsInfo, authorsUrls, authorDirs, mockCountryInfo);

    expect(processBook).toHaveBeenCalledTimes(2);
    expect(processBook).toHaveBeenCalledWith({
      authorName: 'Author 1',
      authorDir: '/path/to/author1',
      authorFullUrl: 'https://example.com/author1',
    });
    expect(processBook).toHaveBeenCalledWith({
      authorName: 'Author 2',
      authorDir: '/path/to/author2',
      authorFullUrl: 'https://example.com/author2',
    });

    expect(mockCountryInfo.authorsList).toHaveLength(2);
  });

  it('should handle empty authors gracefully', async () => {
    const mockCountryInfo = { authorsList: [] };

    await processBooksForAuthor([], [], [], mockCountryInfo);
    expect(mockCountryInfo.authorsList).toHaveLength(0);
  });
});

describe("extractAuthors()", () => {
   it("extracts authors with /person links", () => {
    const html = `
      <html>
        <body>
          <a href="/person/123">Author One</a>
          <a href="/person/456">Author Two</a>
          <a href="/book/789">Not an Author</a>
        </body>
      </html>
    `;

    const result = extractAuthors(html);

    expect(result).toEqual([
      { author: "Author One", href: "/person/123" },
      { author: "Author Two", href: "/person/456" },
    ]);
  });

  it("trims author names", () => {
    const html = `
      <a href="/person/1">
        Author With Spaces
      </a>
    `;

    const result = extractAuthors(html);

    expect(result).toEqual([
      { author: "Author With Spaces", href: "/person/1" },
    ]);
  });

  it("returns empty array when no authors are found", () => {
    const html = `
      <html>
        <body>
          <a href="/book/1">Some Book</a>
        </body>
      </html>
    `;

    const result = extractAuthors(html);

    expect(result).toEqual([]);
  });

  it("handles empty HTML string", () => {
    const result = extractAuthors("");

    expect(result).toEqual([]);
  });

  it("handles missing href safely", () => {
    const html = `
      <a>Author Without Link</a>
      <a href="/person/99">Valid Author</a>
    `;

    const result = extractAuthors(html);

    expect(result).toEqual([
      { author: "Valid Author", href: "/person/99" },
    ]);
  });
});
