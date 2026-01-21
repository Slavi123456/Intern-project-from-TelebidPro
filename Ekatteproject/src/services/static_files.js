import path from "path";
import fs from "fs/promises";
import { __projectdir } from "../paths.js";
import { NotFoundError } from "../errors/custom_error.js";

export {serve_static_files, serveStaticFiles};

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
    throw new NotFoundError(`${req.url} not found`);
  }
}


async function serveStaticFiles(req, res) {
  const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  
  if (!urlPath.startsWith("/assets/")) {
    res.writeHead(404);
    res.end();
    return;
  }
  const ext = path.extname(urlPath);
  const filePath = path.join("public", urlPath);
  const contentType = mimeTypes[ext] || "application/octet-stream";
  console.log("Extension, ", ext , "\n", "Filepath", path.join(__projectdir,filePath), "\n","Content type",  contentType);

  fs.readFile(path.join(__projectdir,filePath))
    .then((data) => {
      console.log("Successs")
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      });
      res.end(data);
    })
    .catch(() => {
      console.log("FAIIIIL")
      res.writeHead(404);
      res.end("Not Found");
    });
}
