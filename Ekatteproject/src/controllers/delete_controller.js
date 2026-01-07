import { delete_village_row } from "../model/village.js";
import { routes } from "../routes.js";

routes.get("DELETE").set("/api/delete-data", async (req, res) => {
    const {id} = req.body;
    console.log("Delete req body", req.body);
    if(await delete_village_row(id)) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Request was successful');
    }else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request: Invalid method or endpoint.');
    }
});