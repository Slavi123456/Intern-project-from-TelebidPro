import { select_id_query_from_district } from "../model/district.js";
import { select_id_query_from_township } from "../model/township.js";
import {
  get_biggest_village_id,
  insert_row_into_village,
} from "../model/village.js";
import { routes } from "../routes.js";

routes.get("POST").set("/api/create-data", async (req, res) => {
  const lastId = await get_biggest_village_id();
  const newId = String(parseInt(lastId, 10) + 1).padStart(5, "0");

  const { id, name, name_en, township_name, district_name } = req.body;
  const district_id = await select_id_query_from_district(district_name);
  const township_id = await select_id_query_from_township(township_name);

  await insert_row_into_village({
    id: newId,
    name: name,
    name_en: name_en,
    township_id: township_id,
    district_id: district_id,
  });
});
