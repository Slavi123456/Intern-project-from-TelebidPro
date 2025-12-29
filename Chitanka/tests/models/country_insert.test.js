import { describe, it, vi, expect } from "vitest";

vi.mock("../../src/config/db", () => ({
  default: {
    query: vi.fn(),
  },
}));
// async function insertIntoTableAuthors(tableName, data) {
//   console.log("->> Inserting into table " + tableName);

//   let values = ``;
//   const size = data.length;
//   for (let i = 0; i < size; i++) {
//     let statement = `($${i * 2 + 1}, $${i * 2 + 2})`;
//     values += statement;
//     if(i + 1 < size)  {
//         values += `, `;
//     }
//   }
//   const authorsData = data.flatMap(author => [author.name, author.countryId]);
//   // console.log(authorsData);

//   let insertStatement = `INSERT INTO authors (name, country_id) VALUES ${values} ON CONFLICT DO NOTHING RETURNING *`;
//   // console.log(insertStatement);

//   const res = await client.query(insertStatement, authorsData);
//   const succesful_isertions = res.rows.length;
//   console.log(
//     `->> Successfuly inserted into table {${tableName}} this many rows {${succesful_isertions}}`);
//     return res.rows;
// }
import { insertIntoTable } from "../../src/model/countries.js";
import client from "../../src/config/db";

describe("insertIntoTable()", () => {
  it("success", async () => {
    const tableName = "Authors";
    const data = ["Air"];
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    client.query.mockResolvedValue({ rows: data });
    const result = await insertIntoTable(tableName, data);

    expect(client.query).toBeCalledWith(
      "INSERT INTO countries (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING *",
      ["Air"]
    );
    expect(logSpy).toHaveBeenCalledWith(`->> Successfuly inserted into table {${tableName}} this many rows {${data.length}}`);    

    expect(result).toEqual(data);

    logSpy.mockRestore();
  });
});
