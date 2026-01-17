import { NotFoundError, ValidationError } from "../errors/custom_error.js";
import { delete_village_row } from "../model/village.js";

export {deleteVillageHandler};

async function deleteVillageHandler(reqBody) {
  if (!reqBody.id) {
    throw new ValidationError("id is required");
  }
  let rows = await delete_village_row(reqBody.id);

  if (rows.length <= 0) {
    throw new NotFoundError("Village not found");
  }

  return true;
}
