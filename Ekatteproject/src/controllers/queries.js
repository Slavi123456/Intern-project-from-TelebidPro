import { bulk_inserts_from_json } from "../services/databese_inserts.js";
import { getStatistics } from "../services/statistics.js";
import { get_villages_info } from "../model/village.js";

export {data_load, fill_tables, village_query_handler };
// export { main_page_handler, data_load, main_page_css};

("use-strict");

async function fill_tables() {
  await bulk_inserts_from_json();
}

async function data_load(req, res) {
  const tableStats = await getStatistics();

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(tableStats));
}

async function village_query_handler(req, res) {
  const query = req.query;
  // console.log(query);
  const query_res = await get_villages_info(query);
  console.log(query_res.rows);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(query_res));
}

// async function main_page_handler(req, res) {
//   console.log("->> Main_page handler");
//   try {
//     const main_page = await load_files("public", "main.html");

//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.end(main_page);
//   } catch (err) {
//     res.writeHead(404);
//     res.end("main.html not found");
//   }
// }

// async function main_page_css(req, res) {
//   console.log("->> Main.css");
//   try {
//     const main_css = await load_files("public", "main.css")

//     res.writeHead(200, { "Content-Type": "text/css" });
//     res.end(main_css);
//   } catch (err) {
//     res.writeHead(404);
//     res.end("CSS not found");
//   }
// }

// async function load_files(folder, file) {
//   const filePath = path.join(__projectdir, folder, file);
//   const file = await fs.readFile(filePath, "utf-8");

//   return file;
// }
