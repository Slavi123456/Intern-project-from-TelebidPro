import { describe, it, test, expect, vi } from 'vitest';
import axios from 'axios';
import { fetchPage, createUrls } from '../src/services/website_fetch.js'; 

vi.mock('axios', () => ({
  default: {get: vi.fn()},
}));

describe('fetchPage', () => {
  it('should fetch page successfully and return HTML content', async () => {
    const baseUrl = 'https://example.com';
    const fakeHtml = '<html><body>Test Page</body></html>';
    
    axios.get.mockResolvedValue({
      data: fakeHtml,
    });

    const result = await fetchPage(baseUrl);
    
    expect(axios.get).toHaveBeenCalledWith(baseUrl);
    
    expect(result).toBe(fakeHtml);
  });

  it('should handle error when fetching page', async () => {
    const baseUrl = 'https://example.com';
    
    axios.get.mockResolvedValue(new Error('Network Error'));

    try {
      await fetchPage(baseUrl);
    } catch (error) {
      expect(error.message).toBe('Network Error');
    }

    expect(axios.get).toHaveBeenCalledWith(baseUrl);
  });
});

describe('createUrls', () => {
  it('should generate correct URLs from baseUrl and extensions', () => {
    const baseUrl = 'https://example.com';
    const extensions = ['/page1', '/page2', '/page3'];
    
    const result = createUrls(baseUrl, extensions);
    
    const expectedUrls = [
      'https://example.com/page1',
      'https://example.com/page2',
      'https://example.com/page3'
    ];

    expect(result).toEqual(expectedUrls);
  });

  it('should return an empty array if no extensions are provided', () => {
    const baseUrl = 'https://example.com';
    const extensions = [];
    
    const result = createUrls(baseUrl, extensions);
    
    expect(result).toEqual([]);
  });
});
