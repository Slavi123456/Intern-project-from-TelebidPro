import { select_id_query_from_district } from "../model/district.js";
import { select_id_query_from_township } from "../model/township.js";
import { update_village } from "../model/village.js";
import { routes } from "../routes.js";

routes.get("PUT").set("/api/edit-data", async (req, res) => { 
    const {id, name, name_en, township_name, district_name} = req.body;
    const district_id =  await select_id_query_from_district(district_name);
    const township_id =  await select_id_query_from_township(township_name);
    await update_village(id, {name, name_en, township_id, district_id});

    res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Request was successful');
});