import client from "../config/db.js";

export {insertIntoTable}

// const data = ["ARI", "KORI"];
// console.log(await insertIntoTable("Chupa", data));

async function insertIntoTable(tableName, data) {
  console.log("->> Inserting into table " + tableName);

  let values = ``;
  const size = data.length;
  for (let i = 0; i < size; i++) {
    let statement = `($${i + 1})`;
    values += statement;
    if(i + 1 < size)  {
        values += `, `;
    }
  }

  let insertStatement = `INSERT INTO countries (name) VALUES ${values} ON CONFLICT DO NOTHING RETURNING *`;
  // console.log(insertStatement);
  
  const res = await client.query(insertStatement, data);
  const succesful_isertions = res.rows.length;
  console.log(
    `->> Successfuly inserted into table {${tableName}} this many rows {${succesful_isertions}}`);
  return res.rows;
}
