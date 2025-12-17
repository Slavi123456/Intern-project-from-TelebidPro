import * as cheerio from "cheerio";

export {extractCountries};

function extractCountries(html) {
  const $ = cheerio.load(html);
  const result = [];

  $('a[href*="/authors/country"]').each((_, a) => {
    const country = $(a).text().trim();
    const href = $(a).attr("href");

    const count = $(a).closest("li").find("span.nr-of-items").text().trim();

    result.push({
      country,
      href,
      count: Number(count),
    });
  });

  return result;
}