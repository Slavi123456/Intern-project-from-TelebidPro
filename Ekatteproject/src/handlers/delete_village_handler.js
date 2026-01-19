import { NotFoundError, ValidationError } from "../errors/custom_error.js";
import { delete_village_row } from "../model/village.js";

export {deleteVillageHandler};

async function deleteVillageHandler(reqBody) {
  if (!reqBody || !reqBody.id) {
    throw new ValidationError("Failed to process deleteVillageHandler");
  }
  let rows = await delete_village_row(reqBody.id);

  if (rows.length <= 0) {
    throw new NotFoundError("Village not found");
  }

  return true;
}
