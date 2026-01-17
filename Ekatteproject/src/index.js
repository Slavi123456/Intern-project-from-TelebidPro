import http from "http";
import dotenv from "dotenv";
import { handler } from "./handler.js";
import "./config/routes.js";

("use strict");

dotenv.config();

const hostname = process.env.HOST;
const port = process.env.PORT;

////Creating server
const server = http.createServer(async (req, res) => {
   try {
    await handler(req, res);
  } catch (err) {
    console.error("Request error:", err);

    if (!res.headersSent) {
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }
});

server.on("clientError", (err, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

export {server};