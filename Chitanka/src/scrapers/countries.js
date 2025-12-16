async function scrapeAuthorCountries() {
  const baseUlr = "https://chitanka.info/authors";
  try {
    const html = await fetchPage(baseUlr);

    const countriesInfo = extractCountries(html);
    console.log(countriesInfo);
    const countriesNames = countriesInfo.map(item => item.country);
    await bulkCreateDirectory(countriesNames);

  } catch (error) {
    console.error("Error fetching page:", error.message);
  }
}