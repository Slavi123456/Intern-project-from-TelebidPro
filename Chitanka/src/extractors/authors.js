import * as cheerio from "cheerio";
import { __scrappedFileDir, __websiteUrl } from "./paths.js";

function extractAuthors(html) {
  const $ = cheerio.load(html);
  const result = [];

  $('a[href*="/person"]').each((_, a) => {
    const author = $(a).text().trim();
    const href = $(a).attr("href");

    console.log(author, href);

    result.push({
      author,
      href,
    });
  });

  return result;
}