import path from "path";
import fs from "fs/promises";
import { __projectdir } from "../config/paths.js";

export {serve_static_files};

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".yaml": "application/yaml",
};

async function serve_static_files(req, res, folder) {
  try {
    const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
    const filePath = path.join(__projectdir, folder, urlPath);

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "application/octet-stream";

    console.log(filePath);
    // console.log(urlPath, "\n", filePath, "\n", ext, "\n", contentType);
    const data = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType, "Access-Control-Allow-Origin": "*", });
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end(`${req.url} not found`);
  }
}
