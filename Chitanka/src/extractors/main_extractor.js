import { __scrappedFileDir, __websiteUrl } from "../paths.js";
import { createUrls } from "../services/website_fetch.js";
import { bulkCreateDirectory } from "../services/filesystem_manager.js";
import { scrapeInformation } from "../scrapers/generic.js";
import { extractCountries, proccesCountries } from "./countries.js";

export { extractingCycle };

const SLICE_OF_OBJECTS = 1;

async function extractingCycle() {
  const baseUlr = "https://chitanka.info/authors";
  try {
    const scrapedCountries = await scrapeInformation(baseUlr, extractCountries);

    const countriesNames = scrapedCountries
      .slice(0, SLICE_OF_OBJECTS)
      .map((item) => item.country);
    const newCountryDir = await bulkCreateDirectory(
      __scrappedFileDir,
      countriesNames,
    );

    const countriesUrlExtensions = scrapedCountries
      .slice(0, SLICE_OF_OBJECTS)
      .map((item) => item.href);
    const countriesUrls = createUrls(__websiteUrl, countriesUrlExtensions);

    let dataInfo = proccesCountries(
      scrapedCountries.slice(0, SLICE_OF_OBJECTS),
      newCountryDir,
      countriesUrls,
    );

    return dataInfo;
  } catch (error) {
    console.error("Error fetching page:", error.message);
  }
}

