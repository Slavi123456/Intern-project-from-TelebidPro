
async function scrapeAuthor() {
  const baseUlr = "https://chitanka.info/authors/country/-";
  try {
    const html = await fetchPage(baseUlr);
    console.log(html);
    // const countriesInfo = extractCountries(html);
    // console.log(countriesInfo);

    // await bulkCreateDirectory(countriesInfo);
    extractAuthors(html);
  } catch (error) {
    console.error("Error fetching page:", error.message);
  }
}
