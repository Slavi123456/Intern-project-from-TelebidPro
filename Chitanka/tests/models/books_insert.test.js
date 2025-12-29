import { describe, it, vi, expect } from "vitest";

vi.mock("../../src/config/db", () => ({
  default: {
    query: vi.fn(),
  },
}));

import { insertIntoTableBooks } from "../../src/model/books.js";
import client from "../../src/config/db";

describe("insertIntoTableBooks()", () => {
  it("success", async () => {
    const tableName = "Books";
    const data = [{title: 'Ari', content: "abc", authorId: 1 }];
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    client.query.mockResolvedValue({ rows: data });
    const result = await insertIntoTableBooks(tableName, data);

    expect(client.query).toBeCalledWith(
      "INSERT INTO books (title, content, author_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *",
      [ 'Ari', 'abc', 1]
    );
    expect(logSpy).toHaveBeenCalledWith(`->> Successfuly inserted into table {${tableName}} this many rows {${data.length}}`);    

    expect(result).toEqual(data);

    logSpy.mockRestore();
  });
});
