import { describe, vi, it, expect } from "vitest";

// import axios from "axios";
// import fs from "fs/promises";

// export {downloadZip};

// async function downloadZip(url, outputPath) {
//   const response = await axios.get(url, { responseType: "arraybuffer" });
//   await fs.writeFile(outputPath, response.data);
//   //   console.log("Downloaded ZIP:", outputPath);
// }
import { downloadZip } from "../src/services/download_services.js";

vi.mock("axios", () => ({
    default: {
        get: vi.fn()
    }
}));

vi.mock("fs/promises", () => ({
    default: {
        writeFile: vi.fn()
    }
}));

import axios from "axios";
import fs from "fs/promises";

describe("downloadZip()", () => {
    const url = 'https://example.com/zipfile.zip';
    const outputPath = './output.zip';
    const mockArrayBuffer = new ArrayBuffer(8);

    it('should download and save the ZIP file successfully', async () => {
        axios.get.mockResolvedValue({
            data: mockArrayBuffer,
        });

        await downloadZip(url, outputPath);


        expect(axios.get).toHaveBeenCalledWith(url, { responseType: 'arraybuffer' });
        expect(fs.writeFile).toHaveBeenCalledWith(outputPath, mockArrayBuffer);
    });
});
