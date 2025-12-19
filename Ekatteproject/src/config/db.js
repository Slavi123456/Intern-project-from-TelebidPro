import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log("Loaded .env from:", process.env.PWD || process.cwd());
console.log("PDB_PASSWORD:", process.env.PDB_PASSWORD);


const client = new Client({
    user: process.env.PDB_USER,
    password: process.env.PDB_PASSWORD,
    host: process.env.PDB_HOST,
    port: process.env.PDB_PORT,
    database: process.env.PDB_NAME,
  });

await client.connect();

export default client;
