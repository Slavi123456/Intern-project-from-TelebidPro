import fs from "fs/promises";
import * as cheerio from "cheerio";
import path from "path";

export {extractBookInfo,readBookText};

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

async function readBookText(folder) {
  const files = await fs.readdir(folder);
  const txtFile = files.find((f) => f.endsWith(".txt"));

  if (!txtFile) throw new Error("No TXT file found in ZIP");

  const content = await fs.readFile(path.join(folder, txtFile), "utf8");
  return content;
}
