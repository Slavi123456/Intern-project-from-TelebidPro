import { __scrappedFileDir, __websiteUrl } from "./paths.js";

async function scrapeAuthorWorks() {
  const baseUlr = "https://chitanka.info/person/Anna-Blaman";
  try {
    const html = await fetchPage(baseUlr);

    const bookInfo = extractBookInfo(html);
    const titles = bookInfo.map((book) => book.title);
    await bulkCreateDirectory(__scrappedFileDir,titles);
    const zipPaths = await bulkBookDownloadZips(bookInfo, __websiteUrl, __scrappedFileDir);
    // console.log(zipPaths);
    // const dir = path.dirname('c:\\Proekti\\TelebidIntern\\TrainingRepo\\Chitanka\\books\\Плувецът\\Плувецът.zip');
    // console.log(dir);
    const unzipedPaths = await bulkUnzipFile(zipPaths);
    // console.log(unzipedPaths);
    const texts = await bulkReadBookText(unzipedPaths);
    printTexts(texts);
  } catch (error) {
    console.error("Error fetching page:", error.message);
  }
}

async function fetchBookInfo(cheerio) {
  const infoDiv = cheerio("div.book-extra-info");
  const info = {};

  infoDiv.find("p").each((i, el) => {
    let text = cheerio(el).text().trim();

    const [key, value] = text.split(":").map((x) => x.trim());

    if (key && value) {
      info[key] = value;
    }
  });

  //   console.log(info);
  return info;
}