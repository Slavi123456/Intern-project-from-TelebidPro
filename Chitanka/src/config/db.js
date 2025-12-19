import { Client } from "pg";

//To run locally only this file you need 
// C:\path to the directory>node --env-file=.env "path to the file" - FOR WINDOWS !!!!
console.log(process.env.HOST, process.env.PDB_NAME,process.env.PDB_USER, process.env.PDB_PASSWORD);

const client = new Client({
    user: process.env.PDB_USER,
    password: process.env.PDB_PASSWORD,
    host: process.env.PDB_HOST,
    port: process.env.PDB_PORT,
    database: process.env.PDB_NAME,
  });

await client.connect();


// const tableNames = await client.query(`SELECT table_name FROM information_schema.tables
//                       WHERE table_schema='public';`);
// console.log(tableNames.rows);
export default client;
