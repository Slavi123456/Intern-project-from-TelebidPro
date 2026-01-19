import * as cheerio from "cheerio";
import { processAuthors } from "./authors.js";

export {extractCountries, proccesCountries, createCountryInfo};

const SLICE_OF_OBJECTS = 1;

async function proccesCountries(scrapedCountries, newCountryDir, countriesUrls) {
  let dataInfo = [];
  for (let i = 0; i < scrapedCountries.length; ++i) {
    const countryInfo = createCountryInfo(
      scrapedCountries[i],
      newCountryDir[i],
      countriesUrls[i],
    );
    await processAuthors(countryInfo);
    dataInfo.push(countryInfo);
  }

  // console.log(dataInfo);
  return dataInfo;
}


function createCountryInfo(scrapedCountrie, newCountryDir, countrieUrl) {
  return {
    name: scrapedCountrie.country,
    countryDir: newCountryDir,
    countryFullUrl: countrieUrl,
  };
}

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