import client from "../config/db.js";

export {insertIntoTableBooks};
// const books = [
//   {title: 'Ari', content: "abc", authorId: 1 },
//   {title: 'Baba', content: "babs", authorId: 2 },
// ];
// console.log(await insertIntoTableBooks("Books", books));

async function insertIntoTableBooks(tableName, data) {
  console.log("->> Inserting into table " + tableName);

  let values = ``;
  const size = data.length;
  for (let i = 0; i < size; i++) {
    let statement = `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`;
    values += statement;
    if(i + 1 < size)  {
        values += `, `;
    }
  }
  const flatData = data.flatMap(book => [book.title, book.content, book.authorId]); 
  // console.log(flatData);

  let insertStatement = `INSERT INTO books (title, content, author_id) VALUES ${values} ON CONFLICT DO NOTHING RETURNING *`;
  // console.log(insertStatement);
  
  const res = await client.query(insertStatement, flatData);
  const succesful_isertions = res.rows.length;
  console.log(
    `->> Successfuly inserted into table {${tableName}} this many rows {${succesful_isertions}}`);
    return res.rows;
}

// [
//   { id: 1, title: 'Ari', content: 'abc', author_id: 1 },
//   { id: 2, title: 'Baba', content: 'babs', author_id: 2 }
// ]