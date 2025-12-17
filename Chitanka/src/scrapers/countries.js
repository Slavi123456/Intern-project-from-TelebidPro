import { fetchPage } from "../services/website_fetch.js";
import { extractCountries } from "../extractors/countries.js";

export {scrapeAuthorCountries};

// const baseUlr = "https://chitanka.info/authors";
async function scrapeAuthorCountries(baseUlr) {
  try {
    const html = await fetchPage(baseUlr);

    const countriesInfo = extractCountries(html);
    
    return countriesInfo;
  } catch (error) {
    console.error("Error fetching page:", error.message);
  }
}