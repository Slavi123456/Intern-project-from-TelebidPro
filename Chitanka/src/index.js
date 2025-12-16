import * as cheerio from "cheerio";
import path from "path";
import { __scrappedFileDir, __websiteUrl } from "./paths.js";


("use-strict");

main();

async function main() {
  const baseUlr = __websiteUrl + "/book/12011-magazinyt";

  try {
    // await createDirectory(__scrappedFileDir);

    const html = await fetchPage(baseUlr);
    await saveFile(html, __scrappedFileDir, "page.html");

    // const html = await readFile(__scrappedFileDir, "page.html");
    const $ = cheerio.load(html);

    ///////////////////////////////
    //Selecting the book info
    // const info = await fetchBookInfo($);
    const filePath = path.join(__scrappedFileDir, "country2");
    await createDirectory(filePath);
    const zipPath = path.join(filePath, "book.zip");

    await downloadBookContent($, "https://chitanka.info", zipPath);
    // console.log(zipPath, filePath)
    ////Unzipping
    unzipFile(zipPath, filePath);

    ////Reading the unzipped .txt file
    const text = await readBookText(filePath);
    console.log(text.substring(0, 100));
  } catch (error) {
    console.error("Error fetching page:", error.message);
  }
}


