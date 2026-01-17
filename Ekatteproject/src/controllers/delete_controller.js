import { deleteVillageHandler } from "../handlers/delete_village_handler.js";
import { routes } from "../config/routes.js";

routes.get("DELETE").set("/api/delete-data", async (req, res) => {
  await deleteVillageHandler(req.body);

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Request was successful");
});

