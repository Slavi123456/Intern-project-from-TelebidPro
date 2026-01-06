import { select_id_query_from_district } from "../model/district.js";
import { select_id_query_from_township } from "../model/township.js";
import { get_village_id, update_village } from "../model/village.js";
import { routes } from "../routes.js";

routes.get("POST").set("/api/edit-data", async (req, res) => { 
    console.log(req.body);
// {
//   name: 'Кария',
//   name_en: 'Karia',
//   township_id: 'Шабла',
//   district_id: 'Добрич'
// }
    const {id, name, name_en, township_name, district_name} = req.body;
    console.log(id, name, name_en, township_name, district_name)
    const district_id =  await select_id_query_from_district(district_name);
    const township_id =  await select_id_query_from_township(township_name);
    console.log(district_id, township_id);
    await update_village(id, {name, name_en, township_id, district_id});
});