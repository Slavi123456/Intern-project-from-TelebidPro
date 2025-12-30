import { describe, it, expect, vi } from "vitest";
import { extractAuthors } from "../../src/extractors/authors.js";

import * as cheerio from "cheerio";

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
