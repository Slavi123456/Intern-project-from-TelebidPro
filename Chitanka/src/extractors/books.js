import fs from "fs/promises";
import * as cheerio from "cheerio";
import path from "path";

export {extractBookInfo, bulkReadBookText, printTexts,readBookText};

function extractBookInfo(html) {
  const $ = cheerio.load(html);
  const results = [];

  $("#texts dl.text-entity").each((_, dl) => {
    const title = $(dl).find(".text-title a i").text().trim();

    const txtZipLink = $(dl).find('a[href$=".txt.zip"]').attr("href");

    if (title && txtZipLink) {
      results.push({
        title,
        txtZipLink,
      });
    }
  });

  return results;
}


async function bulkReadBookText(folders) {
  let bookText = [];
  for (const folder of folders) {
    bookText.push(await readBookText(folder));
  }
  return bookText;
}

// const text = await readBookText("./");
// console.log(text.substring(0, 1500));
// console.log(text);

async function readBookText(folder) {
  const files = await fs.readdir(folder);
  const txtFile = files.find((f) => f.endsWith(".txt"));

  if (!txtFile) throw new Error("No TXT file found in ZIP");

  const content = await fs.readFile(path.join(folder, txtFile), "utf8");
  return content;
}


// const folders = [
//   'c:\\Proekti\\TelebidIntern\\TrainingRepo\\Chitanka\\books\\Кръстоносецът',
//   'c:\\Proekti\\TelebidIntern\\TrainingRepo\\Chitanka\\books\\Плувецът'
// ];
// const texts = await bulkReadBookText(folders);
// for (const text of texts) {
//     console.log(text.substring(0,100));
// }
function printTexts(texts) {
    for (const text of texts) {
      console.log(text.substring(0, 100));
    }
}