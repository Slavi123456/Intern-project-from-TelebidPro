import AdmZip from "adm-zip";
import fs from "fs";

export { unzipFile };

// unzipFile("book.zip", "./");
function unzipFile(zipPath, outputFolder) {
  const zip = new AdmZip(zipPath);

  if (!fs.existsSync(zipPath)) {
    throw new Error(`The file ${zipPath} does not exist.`);
  }

  zip.extractAllTo(outputFolder, true);
  console.log("Extracted ZIP to:", outputFolder);
}

