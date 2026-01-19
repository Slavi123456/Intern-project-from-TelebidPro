import { describe, it, expect, vi } from "vitest";
import path from "path";
import fs from "fs/promises";
import { bulkCreateDirectory } from "../src/services/filesystem_manager.js"; // Replace with actual import

vi.mock("fs/promises", () => ({
  default: { mkdir: vi.fn(), readdir: vi.fn(), readFile: vi.fn() },
}));

describe("bulkCreateDirectory", () => {
  const folder = "/base/folder";
  const directoryNames = ["dir1", "dir2", "dir3"];

  it("should create multiple directories successfully", async () => {
    fs.mkdir.mockResolvedValue(undefined);

    const result = await bulkCreateDirectory(folder, directoryNames);

    directoryNames.forEach((name) => {
      const expectedPath = path.join(folder, name);
      expect(fs.mkdir).toHaveBeenCalledWith(expectedPath, { recursive: true });
    });

    expect(result).toEqual(
      directoryNames.map((name) => path.join(folder, name)),
    );
  });

  it("should skip directories that cannot be created", async () => {
    fs.mkdir
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("Permission Denied"))
      .mockResolvedValueOnce(undefined);

    const result = await bulkCreateDirectory(folder, directoryNames);

    expect(fs.mkdir).toHaveBeenCalledWith(path.join(folder, "dir1"), {
      recursive: true,
    });
    expect(fs.mkdir).toHaveBeenCalledWith(path.join(folder, "dir2"), {
      recursive: true,
    });
    expect(fs.mkdir).toHaveBeenCalledWith(path.join(folder, "dir3"), {
      recursive: true,
    });

    expect(result).toEqual([
      path.join(folder, "dir1"),
      path.join(folder, "dir3"),
    ]);
  });

  it("should return an empty array if no directories are provided", async () => {
    const result = await bulkCreateDirectory(folder, []);
    expect(result).toEqual([]);
  });
});

import { readBookText } from "../src/services/filesystem_manager.js";

describe("readBookText", () => {
  it("reads content from a txt file in the folder", async () => {
    fs.readdir.mockResolvedValue(["book.txt", "other.md"]);
    fs.readFile.mockResolvedValue("Book content here");

    const content = await readBookText("/fake/folder");

    expect(fs.readdir).toHaveBeenCalledWith("/fake/folder");
    expect(fs.readFile).toHaveBeenCalledWith(
      path.join("/fake/folder", "book.txt"),
      "utf8",
    );
    expect(content).toBe("Book content here");
  });

  it("throws error if no txt file is found", async () => {
    fs.readdir.mockResolvedValue(["file.md", "image.png"]);

    await expect(readBookText("/fake/folder")).rejects.toThrow(
      "No TXT file found in ZIP",
    );
  });
});
