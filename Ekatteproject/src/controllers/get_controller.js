import { get_district_rows_names } from "../model/district.js";
import { get_township_rows_names } from "../model/township.js";
import { get_all_village_rows } from "../model/village.js";
import { data_load, fill_tables, village_query_handler } from "./queries.js";
import { serve_static_files } from "./static_files.js";

import { routes } from "../routes.js";

routes
  .get("GET")
  .set("/", (req, res) => serve_static_files(req, res, "public/main.html"));
routes
  .get("GET")
  .set("/main.css", (req, res) => serve_static_files(req, res, "public"));
routes
  .get("GET")
  .set("/main.js", (req, res) => serve_static_files(req, res, "public"));
routes
  .get("GET")
  .set("/editData.html", (req, res) => serve_static_files(req, res, "public"));
routes.get("GET").set("/api/init", async (req, res) => {
  await fill_tables();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end("");
});
routes.get("GET").set("/api/villages", async (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(await get_all_village_rows()));
});
routes.get("GET").set("/api/init-statistics", data_load);
routes.get("GET").set("/search/villages", village_query_handler);
routes.get("GET").set("/districts-names", async (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(await get_district_rows_names()));
});
routes.get("GET").set("/townships-names", async (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(await get_township_rows_names()));
});

// export { get_controller };

// async function get_controller(req, res) {
//   switch (req.pathname) {
//     case "/": {
//       await serve_static_files(req, res, "public/main.html");
//       return;
//     }
//     case "/main.css": {
//       await serve_static_files(req, res, "public");
//       return;
//     }
//     case "/main.js": {
//       await serve_static_files(req, res, "public");
//       break;
//     }
//     case "/api/init": {
//       await fill_tables();
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end("");
//       return;
//     }

//     case "/api/villages": {
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(JSON.stringify(await get_all_village_rows()));
//       return;
//     }

//     case "/api/init-statistics": {
//       await data_load(req,res);
//       return;
//     }
//     case "/editData.html": {
//       console.log("In edit page")
//       await serve_static_files(req, res, "public");
//       return;
//     }
//     case "/search/villages": {
//       await village_query_handler(req,res);
//       return;
//     }

//     case "/districts-names": {
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(JSON.stringify(await get_district_rows_names()));
//       return;
//     }
//     case "/townships-names": {
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(JSON.stringify(await (get_township_rows_names())));
//       return;
//     }
//     default: {
//       console.log("Default GET")
//       res.writeHead(404);
//       res.end(`${req.url} not found`);
//       return;
//     }
//   }
// }
