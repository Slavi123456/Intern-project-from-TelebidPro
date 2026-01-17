import { routes } from "../config/routes.js";
import { createVillageHandler } from "../handlers/create_village_handler.js";

routes.get("POST").set("/api/create-data", async (req, res) => {
  await createVillageHandler(req.body);

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Request was successful");
});
