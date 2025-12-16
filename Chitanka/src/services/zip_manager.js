import AdmZip from "adm-zip";
import path from "path";

export {bulkUnzipFile};


async function bulkUnzipFile(zipPaths) {
  let unzipedPaths = [];
  for (const zipPath of zipPaths) {
    const outputPath = path.dirname(zipPath);
    unzipedPaths.push(outputPath);
    await unzipFile(zipPath, outputPath);
  }
  return unzipedPaths;
}

// unzipFile("book.zip", "./");
function unzipFile(zipPath, outputFolder) {
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(outputFolder, true);
  console.log("Extracted ZIP to:", outputFolder);
}

