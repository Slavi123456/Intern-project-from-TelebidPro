import { NotFoundError, ValidationError } from "../errors/custom_error.js";
import { delete_village_row } from "../model/village.js";

export {deleteVillageHandler};

async function deleteVillageHandler(id) {
  if (!id) {
    throw new ValidationError("id is required");
  }
  const rows = await delete_village_row(id);

  if (rows.length <= 0) {
    throw new NotFoundError("Village not found");
  }

  return true;
}
