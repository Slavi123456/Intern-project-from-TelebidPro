import { NotFoundError, ValidationError } from "../errors/custom_error.js";
import { delete_village_row } from "../model/village.js";
import { routes } from "../routes.js";

routes.get("DELETE").set("/api/delete-data", async (req, res) => {
  await deleteVillageHandler(req.body);

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Request was successful");
});

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
