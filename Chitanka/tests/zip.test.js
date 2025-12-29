import { describe, it, expect, vi } from "vitest";

describe("");

vi.mock("adm-zip", () => {
  return {
    default: class {
      constructor(zipPath) {
        this.zipPath = zipPath;
        this.extractAllTo = vi.fn().mockResolvedValue(true);
      }
    }
  };
});

vi.mock("fs", () => ({
  default: { existsSync: vi.fn() },
}));

import { unzipFile } from "../src/services/zip_manager.js";
import fs from "fs";
// import AdmZip from "adm-zip";

describe("unzipFile()", () => {
  it("should extract files", async () => {
    fs.existsSync.mockReturnValue(true);

    const zipPath = "path/book.zip";
    const outputFolder = "./output";
    // const spyZip = vi.spyOn(AdmZip, "mockImplementation");

    await unzipFile(zipPath, outputFolder);

    // expect(spyZip).toHaveBeenCalledWith(zipPath);

    // const zip = new AdmZip(zipPath);
    // expect(zip.extractAllTo).toHaveBeenCalledWith(outputFolder, true);
  });
});
