import { get_all_village_rows } from "../model/village.js";
import { data_load, fill_tables, village_query_handler} from "./queries.js";
import { serve_static_files } from "./static_files.js";

export { get_controller };

async function get_controller(req, res) {
  switch (req.pathname) {
    case "/": {
      await serve_static_files(req, res, "public/main.html");
      break;
    }
    case "/main.css": {
      await serve_static_files(req, res, "public");
      break;
    }
    case "/main.js": {
      await serve_static_files(req, res, "public");
      break;
    }
    case "/api/init": {
      await fill_tables();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("");
      break;
    }
    
    case "/api/villages": {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(await get_all_village_rows()));
      break;
    }
    
    case "/api/init-statistics": {
      await data_load(req,res);
      break;
    }
    case "/search/villages": {
      await village_query_handler(req,res);
      break;
    }
    default: {
      await serve_static_files(req, res, "public");
    }
  }
}

