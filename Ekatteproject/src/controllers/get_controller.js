import { get_district_rows_names } from "../model/district.js";
import { get_township_rows_names } from "../model/township.js";
import { get_all_village_rows, get_villages_info } from "../model/village.js";
import { serve_static_files } from "../services/static_files.js";

import { routes } from "../routes.js";
import { sorting } from "../model/sorting.js";
import { exportData } from "../services/exporting.js";
import { bulk_inserts_from_json } from "../services/databese_inserts.js";
import { getStatistics } from "../services/statistics.js";

routes
  .get("GET")
  .set("/", (req, res) => serve_static_files(req, res, "public/main.html"));
routes
  .get("GET")
  .set("/main.css", (req, res) => serve_static_files(req, res, "public/assets/css"));
routes
  .get("GET")
  .set("/edit_data.css", (req, res) => serve_static_files(req, res, "public/assets/css"));
routes
  .get("GET")
  .set("/main.js", (req, res) => serve_static_files(req, res, "public/assets/js"));
routes
  .get("GET")
  .set("/edit_data.js", (req, res) => serve_static_files(req, res, "public/assets/js"));
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
  console.log("GET req params", req.params);
  const data = await sorting(req.params);
  // console.log(data);
  if (data) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request: Invalid method or endpoint.');
  }
})

routes.get("GET").set("/export/excel", async (req,res) => {
  try {
        const data = [
            { id: 1, name: 'Village1', name_en: 'Village1EN' },
            { id: 2, name: 'Village2', name_en: 'Village2EN' }
        ];

        await exportData(req,res, data, 'xlsx');
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Failed to generate Excel');
    }
})
routes.get("GET").set("/export/csv", async (req,res) => {
  try {
        const data = [
            { id: 1, name: 'Village1', name_en: 'Village1EN' },
            { id: 2, name: 'Village2', name_en: 'Village2EN' }
        ];

        await exportData(req,res, data, 'csv');
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Failed to generate Excel');
    }
})