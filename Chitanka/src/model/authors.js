import client from "../config/db.js";

// const authors = [{name: "Ari", country_id: [11]}, {name: "Kori", country_id: [12]}];
// console.log(insertIntoTableAuthors("Poki", authors));

async function insertIntoTableAuthors(tableName, data) {
  console.log("->> Inserting into table " + tableName);

  let values = ``;
  const size = data.length;
  for (let i = 0; i < size; i++) {
    let statement = `($${index * 2 + 1}, $${index * 2 + 2})`;
    values += statement;
    if(i + 1 < size)  {
        values += `, `;
    }
  }
  const authorsData = data.flatMap(author => [author.name, author.countryId]); 

  let insertStatement = `INSERT INTO countries (name) VALUES ${values} ON CONFLICT DO NOTHING RETURNING *`;
  console.log(insertStatement);
  
//   const res = await client.query(insertStatement, authorsData);
//   const succesful_isertions = data.length - res.rows.length;
//   console.log(
//     `->> Successfuly inserted into table {${tableName}} this many rows {${succesful_isertions}}`);
}
