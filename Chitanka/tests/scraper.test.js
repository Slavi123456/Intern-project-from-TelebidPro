import { describe, it, expect, vi } from "vitest";

vi.mock("../src/services/website_fetch.js", () => ({
      fetchPage: vi.fn(),
  }));

import { scrapeInformation } from "../src/scrapers/generic.js";
import * as webFetch from "../src/services/website_fetch.js";

describe("scrapeInformation()", () => {
  it("success", async () => {
    const baseUrl = "https://example.com";
    const fakeHtml = "<html><body>Test Page</body></html>";

    const mockExtractDataFunc = vi.fn().mockImplementation((row) => row);
    webFetch.fetchPage.mockResolvedValue(fakeHtml);

    const result = await scrapeInformation(baseUrl, mockExtractDataFunc);

    expect(webFetch.fetchPage).toHaveBeenCalledWith(baseUrl);
    expect(mockExtractDataFunc).toHaveBeenCalledWith(fakeHtml);
    expect(result).toBe(fakeHtml);
  });
  
  it('should handle error', async () => {
    const baseUrl = 'https://example.com';
    
    webFetch.fetchPage.mockRejectedValue(new Error('Failed to fetch page'));

    const mockExtractDataFunc = vi.fn();

    try {
      await scrapeInformation(baseUrl, mockExtractDataFunc);
    } catch (error) {
      expect(error.message).toBe('Failed to fetch page');
    }

    expect(webFetch.fetchPage).toHaveBeenCalledWith(baseUrl);
    expect(mockExtractDataFunc).not.toHaveBeenCalled();
  });
});
