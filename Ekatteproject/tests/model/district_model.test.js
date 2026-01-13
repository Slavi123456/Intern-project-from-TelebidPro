import { describe, it, expect, vi } from "vitest";

import {
  get_district_rows_count,
  select_id_query_from_district,
} from "../../src/model/district.js";

vi.mock("../../src/config/db.js", () => ({
  default: {
    query: vi.fn(),
  },
}));
import client from "../../src/config/db.js";

describe("get_district_rows_count()", () => {
  it("check for success", async () => {
    client.query.mockResolvedValue({
      rows: [{ count: 42 }],
    });

    const result = await get_district_rows_count();
    expect(result).toBe(42);

    expect(client.query).toHaveBeenCalledWith("SELECT COUNT(*) FROM district;");
  });

  it("check for undefined", async () => {
    client.query.mockResolvedValue({ rows: [] });

    const result = await get_district_rows_count();
    expect(result).toBeUndefined();
  });
});

describe("select_id_query_from_district()", () => {
  it("check for success", async () => {
    const district_name = "Dupnica";
    client.query.mockResolvedValue({
      rows: [{ id: 42 }],
    });

    const result = await select_id_query_from_district(district_name);
    expect(result).toBe(42);

    expect(client.query).toHaveBeenCalledWith(
      "SELECT id FROM district WHERE district.name = $1;",
      [district_name]
    );
  });

  it("check for undefined", async () => {
    const district_name = "Dupnica";
    client.query.mockResolvedValue({
      rows: [],
    });

    const result = await select_id_query_from_district(district_name);
    expect(result).toBeUndefined();

    expect(client.query).toHaveBeenCalledWith(
      "SELECT id FROM district WHERE district.name = $1;",
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
// async function get_district_rows_names() {
//   const res = await client.query("SELECT id,name FROM district;");
//   return res.rows;
// }

import { get_district_rows_names } from "../../src/model/district.js";
describe("get_district_rows_names()", () => {
  it("", async () => {
    const testRows = [];
    client.query.mockResolvedValue({rows: testRows});

    expect(await get_district_rows_names()).toEqual(testRows);
  })
})
