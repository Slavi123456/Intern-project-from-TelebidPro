import client from "../config/db.js";

export {insertIntoTableAuthors};

// const authors = [{name: "Ari", countryId: 11}, {name: "Kori", countryId: 12}];
// console.log(await insertIntoTableAuthors("Poki", authors));

async function insertIntoTableAuthors(tableName, data) {
  console.log("->> Inserting into table " + tableName);

  let values = ``;
  const size = data.length;
  for (let i = 0; i < size; i++) {
    let statement = `($${i * 2 + 1}, $${i * 2 + 2})`;
    values += statement;
    if(i + 1 < size)  {
        values += `, `;
    }
  }
  const authorsData = data.flatMap(author => [author.name, author.countryId]); 
  // console.log(authorsData);

  let insertStatement = `INSERT INTO authors (name, country_id) VALUES ${values} ON CONFLICT DO NOTHING RETURNING *`;
  // console.log(insertStatement);
  
  const res = await client.query(insertStatement, authorsData);
  const succesful_isertions = res.rows.length;
  console.log(
    `->> Successfuly inserted into table {${tableName}} this many rows {${succesful_isertions}}`);
    return res.rows;
}