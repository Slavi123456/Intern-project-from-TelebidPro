import { describe, it, expect, vi } from "vitest";
import * as cheerio from "cheerio";
import { extractCountries } from "../../src/extractors/countries.js";


describe("")


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
