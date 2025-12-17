import axios from "axios";
import path from "path";
import fs from "fs/promises";

export {bulkBookDownloadZips,downloadZip};

async function bulkBookDownloadZips(bookInfo, baseUrl, outputFolder) {
  let zipPaths = [];
  for (const { title, txtZipLink } of bookInfo) {
    const fullUrl = baseUrl + txtZipLink;
    const zipName = title + ".zip";
    const fullOutput = path.join(outputFolder, title, zipName);
    // console.log(fullUrl, fullOutput);
    zipPaths.push(fullOutput);
    await downloadZip(fullUrl, fullOutput);
  }
  return zipPaths;
}
async function downloadZip(url, outputPath) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  await fs.writeFile(outputPath, response.data);
  //   console.log("Downloaded ZIP:", outputPath);
}

async function downloadBookContent(cheerio, siteUrl, outputPath) {
  const txtLink = cheerio('a[href$=".txt.zip"]').attr("href");

  if (!txtLink) {
    throw new Error("txt.zip link not found");
  }

  const fullUrl = siteUrl + txtLink;
  console.log("TXT ZIP URL:", fullUrl);

  await downloadZip(fullUrl, outputPath);
}
