
import { routes } from "../config/routes.js";
import { updateVillageHandler } from "../handlers/update_village_handler.js";

routes.get("PUT").set("/api/edit-data", async (req, res) => { 
    await updateVillageHandler(req.body);
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Request was successful');
});