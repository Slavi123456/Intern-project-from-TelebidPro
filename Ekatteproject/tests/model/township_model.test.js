import { describe, it, expect, vi } from "vitest";

import client from "../../src/config/db.js";
import { select_id_query_from_township, get_township_rows_count } from "../../src/model/township.js";

vi.mock("../../src/config/db.js", () => ({
  default: {
    query: vi.fn(),
  },
}));

describe("get_township_rows_count()", () => {
  it("check for success", async () => {
    client.query.mockResolvedValue({
      rows: [{ count: 42 }],
    });

    const result = await get_township_rows_count();
    expect(result).toBe(42);

    expect(client.query).toHaveBeenCalledWith("SELECT COUNT(*) FROM township;");
  });

  it("check for undefined", async () => {
    client.query.mockResolvedValue({ rows: [] });

    const result = await get_township_rows_count();
    expect(result).toBeUndefined();
  });
});

describe("select_id_query_from_township()", () => {
  it("check for success", async () => {
    const district_name = "Dupnica";
    client.query.mockResolvedValue({
      rows: [{ id: 42 }],
    });

    const result = await select_id_query_from_township(district_name);
    expect(result).toBe(42);

    expect(client.query).toHaveBeenCalledWith(
      "SELECT id FROM township WHERE township.name = $1;",
      [district_name]
    );
  });

  it("check for undefined", async () => {
    const district_name = "Dupnica";
    client.query.mockResolvedValue({
      rows: [],
    });

    const result = await select_id_query_from_township(district_name);
    expect(result).toBeUndefined();

    expect(client.query).toHaveBeenCalledWith(
      "SELECT id FROM township WHERE township.name = $1;",
      [district_name]
    );
  });
  // it("check for success", async () => {
  //   const district_name = "Dupnica";
  //   client.query.mockResolvedValue({
  //     rows: [{ id: 42 }],
  //   });

  //   const result = await select_id_query_from_district(district_name);
  //   expect(result).toBe(42);

  //   expect(client.query).toHaveBeenCalledWith(
  //     "SELECT id FROM district WHERE district.name = $1;",
  //     [district_name]
  //   );
  // });

});



import { get_township_rows_names } from "../../src/model/township.js";
describe("get_district_rows_names()", () => {
  it("", async () => {
    const testRows = [];
    client.query.mockResolvedValue({rows: testRows});

    expect(await get_township_rows_names()).toEqual(testRows);
  })
})
