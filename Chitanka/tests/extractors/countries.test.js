import { describe, it, expect, vi } from "vitest";
import * as cheerio from "cheerio";
import { extractCountries, proccesCountries, createCountryInfo } from "../../src/extractors/countries.js";

vi.mock("../../src/extractors/authors.js", () => ({
  processAuthors: vi.fn()
}))

import { processAuthors } from "../../src/extractors/authors.js";

describe('processCountries', () => {
  it('should process each country and include authors in country info', async () => {
    const scrapedCountries = [
      { country: 'Bulgaria' },
      { country: 'Romania' },
    ];
    const newCountryDir = ['/path/to/bulgaria', '/path/to/romania'];
    const countriesUrls = [
      'https://example.com/countries/bulgaria',
      'https://example.com/countries/romania',
    ];

    processAuthors.mockResolvedValueOnce(undefined).mockResolvedValueOnce(undefined);

    const result = await proccesCountries(scrapedCountries, newCountryDir, countriesUrls);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Bulgaria');
    expect(result[1].name).toBe('Romania');
    expect(result[0].authorsList).toBeUndefined();
    expect(result[1].authorsList).toBeUndefined();

    expect(processAuthors).toHaveBeenCalledTimes(2);
    expect(processAuthors).toHaveBeenCalledWith(result[0]);
    expect(processAuthors).toHaveBeenCalledWith(result[1]);
  });

  it('should handle empty input gracefully', async () => {
    const scrapedCountries = [];
    const newCountryDir = [];
    const countriesUrls = [];

    const result = await proccesCountries(scrapedCountries, newCountryDir, countriesUrls);

    expect(result).toHaveLength(0);
  });
});

describe("extractCountries()", () => {
  it("extracts countries with counts", () => {
    const html = `
      <ul class="countries">
        <li>
          <a href="/authors/country/uk">United Kingdom</a>
          <span class="nr-of-items">12</span>
        </li>
        <li>
          <a href="/authors/country/fr">France</a>
          <span class="nr-of-items">7</span>
        </li>
        <li>
          <a href="/authors/country/de">Germany</a>
          <span class="nr-of-items">3</span>
        </li>
        <li>
          <a href="/authors/genre/fiction">Fiction</a>
          <span class="nr-of-items">99</span>
        </li>
      </ul>
    `;

    const result = extractCountries(html);

    expect(result).toEqual([
      {
        country: "United Kingdom",
        href: "/authors/country/uk",
        count: 12,
      },
      {
        country: "France",
        href: "/authors/country/fr",
        count: 7,
      },
      {
        country: "Germany",
        href: "/authors/country/de",
        count: 3,
      },
    ]);
  });
});

describe('createCountryInfo', () => {
  it('should correctly create country info object', () => {
    const scrapedCountry = { country: 'Bulgaria' };
    const newCountryDir = '/path/to/directory';
    const countryUrl = 'https://example.com/countries/bulgaria';

    const result = createCountryInfo(scrapedCountry, newCountryDir, countryUrl);

    expect(result).toEqual({
      name: 'Bulgaria',
      countryDir: '/path/to/directory',
      countryFullUrl: 'https://example.com/countries/bulgaria',
    });
  });

  it('should handle missing country name', () => {
    const scrapedCountry = { country: '' };
    const newCountryDir = '/path/to/directory';
    const countryUrl = 'https://example.com/countries/unknown';

    const result = createCountryInfo(scrapedCountry, newCountryDir, countryUrl);

    expect(result).toEqual({
      name: '',
      countryDir: '/path/to/directory',
      countryFullUrl: 'https://example.com/countries/unknown',
    });
  });
});