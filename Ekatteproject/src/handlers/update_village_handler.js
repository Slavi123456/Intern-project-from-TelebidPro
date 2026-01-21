import { select_id_query_from_district } from "../model/district.js";
import { select_id_query_from_township } from "../model/township.js";
import { update_village } from "../model/village.js";
import { ValidationError } from "../errors/custom_error.js";

export {updateVillageHandler};

async function updateVillageHandler(village) {
    if (!village) {
        throw new ValidationError("village data is required");
      }
    const {id, name, name_en, township_id, district_id} = village;
    if(!id || !name || !name_en || !township_id || !district_id) {
      throw new ValidationError("Cannot update village in updateVillageHandler with village missing arguments")
    }
    // const district_id =  await select_id_query_from_district(district_name);
    // const township_id =  await select_id_query_from_township(township_name);
    await update_village(id, {name, name_en, township_id, district_id});

    return true;
}