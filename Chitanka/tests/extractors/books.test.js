import { describe, it, expect, vi} from "vitest";
import path from "path";
import { extractBookInfo, readBookText } from "../../src/extractors/books.js";

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


vi.mock("fs/promises", () => ({
  default: {
    readdir: vi.fn(),
    readFile: vi.fn(),
  }
}));

import fs from "fs/promises";

describe("readBookText", () => {
  it("reads content from a txt file in the folder", async () => {
    fs.readdir.mockResolvedValue(["book.txt", "other.md"]);
    fs.readFile.mockResolvedValue("Book content here");

    const content = await readBookText("/fake/folder");

    expect(fs.readdir).toHaveBeenCalledWith("/fake/folder");
    expect(fs.readFile).toHaveBeenCalledWith(
      path.join("/fake/folder", "book.txt"),
      "utf8"
    );
    expect(content).toBe("Book content here");
  });

  it("throws error if no txt file is found", async () => {
    fs.readdir.mockResolvedValue(["file.md", "image.png"]);

    await expect(readBookText("/fake/folder")).rejects.toThrow(
      "No TXT file found in ZIP"
    );
  });
});