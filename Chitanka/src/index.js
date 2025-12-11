import fs from "fs/promises";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fetchPage();

async function fetchPage() {
    const baseUlr = "https://chitanka.info/book/12011-magazinyt";

    try {
        const response = await axios.get(baseUlr);
        const html = response.data;
        
        console.log("Page downloaded!");
        console.log(html.substring(0, 200));
        
        const filePath = path.join(__dirname, "page.html");
        await fs.writeFile(filePath, html, "utf8");
        console.log("Saved to", filePath);
        
        // const html = await readFile("", "page.html");
        const $ = cheerio.load(html);

        ///////////////////////////////
        //Selecting the book info
        const infoDiv = $("div.book-extra-info");
        const info = {};

        infoDiv.find("p").each((i, el) => {
            let text = $(el).text().trim();

            const [key, value] = text.split(":").map((x) => x.trim());

            if (key && value) {
                info[key] = value;
            }
        });

        console.log(info);

        ///////////////////////////////
        //Selecting the attribute with downloadable links
        const txtLink = $('a[href$=".txt.zip"]').attr("href");

        if (!txtLink) {
            throw new Error("txt.zip link not found");
        }

        //Making request for downloading the zip
        const fullUrl = "https://chitanka.info" + txtLink;
        console.log("TXT ZIP URL:", fullUrl);

        await downloadZip(fullUrl, "book.zip");

        //Unzipping
        unzipFile("book.zip", "./");

        //Reading the unzipped .txt file
        const text = await readBookText("./");
        console.log(text);

    } catch (error) {
        console.error("Error fetching page:", error.message);
    }
}

////////////////////////////////////////////////////

async function downloadZip(url, outputPath) {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    await fs.writeFile(outputPath, response.data);
    console.log("Downloaded ZIP:", outputPath);
}

////////////////////////////////////////////////////

async function readFile(folder, file) {
  try {
    const filePath = path.join(__dirname, folder, file);
    console.log(filePath);
    const data = await fs.readFile(filePath,  {encoding: "utf8"});

    // console.log(data);
    return data;
  }
  catch (err){

  }
}

////////////////////////////////////////////////////
import AdmZip from "adm-zip";

// unzipFile("book.zip", "./");

function unzipFile(zipPath, outputFolder) {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(outputFolder, true);
    console.log("Extracted ZIP to:", outputFolder);
}

////////////////////////////////////////////////////
// const text = await readBookText("./");
// console.log(text.substring(0, 1500));
// console.log(text);

async function readBookText(folder) {
    const files = await fs.readdir(folder);
    const txtFile = files.find(f => f.endsWith(".txt"));

    if (!txtFile) throw new Error("No TXT file found in ZIP");

    const content = await fs.readFile(path.join(folder, txtFile), "utf8");
    return content;
}