import { get_district_rows_names } from "../model/district.js";
import { get_township_rows_names } from "../model/township.js";
import { get_all_village_rows, get_villages_info } from "../model/village.js";
import { serve_static_files } from "../services/static_files.js";

import { routes } from "../routes.js";
import { sorting } from "../model/sorting.js";
import { bulk_inserts_from_json } from "../services/databese_inserts.js";
import { getStatistics } from "../services/statistics.js";
import { BadRequestError } from "../errors/custom_error.js";
import { exportHandler } from "../handlers/exporting_handler.js";

routes
  .get("GET")
  .set("/", (req, res) => serve_static_files(req, res, "public/main.html"));
routes
  .get("GET")
  .set("/main.css", (req, res) =>
    serve_static_files(req, res, "public/assets/css")
  );
routes
  .get("GET")
  .set("/edit_data.css", (req, res) =>
    serve_static_files(req, res, "public/assets/css")
  );
routes
  .get("GET")
  .set("/main.js", (req, res) =>
    serve_static_files(req, res, "public/assets/js")
  );
routes
  .get("GET")
  .set("/edit_data.js", (req, res) =>
    serve_static_files(req, res, "public/assets/js")
  );
routes
  .get("GET")
  .set("/edit_data.html", (req, res) => serve_static_files(req, res, "public"));
routes.get("GET").set("/api/init", async (req, res) => {
  await bulk_inserts_from_json();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end("");
});
routes.get("GET").set("/api/villages", async (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(await get_all_village_rows()));
});
routes.get("GET").set("/api/init-statistics", async (req, res) => {
  const tableStats = await getStatistics();

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(tableStats));
});
routes.get("GET").set("/search/villages", async (req, res) => {
  const query_res = await get_villages_info(req.query);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(query_res));
});
routes.get("GET").set("/districts-names", async (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(await get_district_rows_names()));
});
routes.get("GET").set("/townships-names", async (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(await get_township_rows_names()));
});
routes.get("GET").set("/sorted/villages", async (req, res) => {
  const data = await sorting(req.params);
  if (!data) {
    throw new BadRequestError("Bad Request: Invalid method or endpoint.");
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
});

routes.get("GET").set("/export/excel", async (req, res) => {
  exportHandler(req, res, "xlsx");
});
routes.get("GET").set("/export/csv", async (req, res) => {
  exportHandler(req, res, "csv");
});
//////////////////////Docs
routes.get("GET").set("/openapi.yaml", (req, res) => {
  serve_static_files(req, res, "public/");
  // console.log("Openapi.yaml is called");
});
import fs from "fs/promises";
import path from "path";
import { __projectdir } from "../paths.js";
routes.get("GET").set("/docs", async (req, res) => {
  // console.log("DOCS is called");
  const filePath = path.join(
    __projectdir,
    "/docs/swagger-ui/dest/swagger-ui/dist/index.html"
  );
  // console.log("Filepath", filePath);
  const data = await fs.readFile(filePath, "utf-8");
  // console.log("Data", data);
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(data);
});
routes.get("GET").set("/docs/swagger-ui.css", async (req, res) => {
  const filePath = path.join(
    __projectdir,
    "/docs/swagger-ui/dest/swagger-ui/dist/swagger-ui.css"
  );
  // console.log("Filepath", filePath);
  const data = await fs.readFile(filePath, "utf-8");
  // console.log("Data", data);
  res.writeHead(200, { "Content-Type": "text/css" });
  res.end(data);
});

routes.get("GET").set("/docs/index.css", async (req, res) => {
  const filePath = path.join(
    __projectdir,
    "/docs/swagger-ui/dest/swagger-ui/dist/index.css"
  );
  // console.log("Filepath", filePath);
  const data = await fs.readFile(filePath, "utf-8");
  // console.log("Data", data);
  res.writeHead(200, { "Content-Type": "text/css" });
  res.end(data);
});
routes.get("GET").set("/docs/swagger-initializer.js", async (req, res) => {
  const filePath = path.join(
    __projectdir,
    "/docs/swagger-ui/dest/swagger-ui/dist/swagger-initializer.js"
  );
  // console.log("Filepath", filePath);
  const data = await fs.readFile(filePath, "utf-8");
  // console.log("Data", data);
  res.writeHead(200, { "Content-Type": "application/js" });
  res.end(data);
});
routes.get("GET").set("/docs/swagger-ui-bundle.js", async (req, res) => {
  const filePath = path.join(
    __projectdir,
    "/docs/swagger-ui/dest/swagger-ui/dist/swagger-ui-bundle.js"
  );
  // console.log("Filepath", filePath);
  const data = await fs.readFile(filePath, "utf-8");
  // console.log("Data", data);
  res.writeHead(200, { "Content-Type": "application/js" });
  res.end(data);
});
routes.get("GET").set("/docs/swagger-ui-standalone-preset.js", async (req, res) => {
  const filePath = path.join(
    __projectdir,
    "/docs/swagger-ui/dest/swagger-ui/dist/swagger-ui-standalone-preset.js"
  );
  // console.log("Filepath", filePath);
  const data = await fs.readFile(filePath, "utf-8");
  // console.log("Data", data);
  res.writeHead(200, { "Content-Type": "application/js" });
  res.end(data);
});