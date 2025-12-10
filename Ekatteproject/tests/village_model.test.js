import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/model/district.js", () => ({
  select_id_query_from_district: vi.fn(),
}));
vi.mock("../src/model/township.js", () => ({
  select_id_query_from_township: vi.fn(),
}));

vi.mock("../src/config/db.js", () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock("../src/utils/validation.js", () => ({
  validateMany: vi.fn(),
}));

vi.mock("../src/utils/villageParser.js", () => ({
  parse_names_from_village_text: vi.fn(),
}));

// vi.mock("../src/errors/custom_error.js", () => ({
//   NotFoundError: vi.
// }))

import { select_id_query_from_township } from "../src/model/township.js";
import { select_id_query_from_district } from "../src/model/district.js";
import { get_ids_from_queries } from "../src/model/village.js";
import { parse_names_from_village_text } from "../src/utils/villageParser.js";
import client from "../src/config/db.js";
import { validateMany } from "../src/utils/validation.js";

// import {parse_names_from_village_text, get_villages_info,get_village_rows_count}

// import { NotFoundError } from "../src/errors/custom_error.js";
import { get_ids_from_text } from "../src/model/village.js";
import { get_village_values } from "../src/model/village.js";
import { get_village_rows_count } from "../src/model/village.js";
import { get_villages_info } from "../src/model/village.js";

describe("Villages functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("get_ids_from_queries returns ids when present", async () => {
    select_id_query_from_district.mockResolvedValue(2);
    select_id_query_from_township.mockResolvedValue(5);

    const ids = await get_ids_from_queries("TownshipName", "DistrictName");
    expect(ids).toEqual({ district_id: 2, township_id: 5 });
  });

  it("get_ids_from_queries returns NotFoundError when id missing", async () => {
    select_id_query_from_district.mockResolvedValue(null);
    select_id_query_from_township.mockResolvedValue(5);

    const result = await expect(get_ids_from_queries("Township", "District")).rejects.instanceOf(Error);
  });

  it("get_ids_from_text parses text and returns ids", async () => {
    parse_names_from_village_text.mockReturnValue({
      township: "T",
      district: "D",
    });
    select_id_query_from_district.mockResolvedValue(10);
    select_id_query_from_township.mockResolvedValue(20);

    const ids = await get_ids_from_text("Some text");
    expect(ids).toEqual({ district_id: 10, township_id: 20 });
  });

  it("get_village_values returns array with ids", async () => {
    parse_names_from_village_text.mockReturnValue({
      township: "T",
      district: "D",
    });
    select_id_query_from_district.mockResolvedValue(2);
    select_id_query_from_township.mockResolvedValue(3);

    const file_row = {
      ekatte: "123",
      name: "Village",
      name_en: "VillageEN",
      area1: "some text",
    };
    const result = await get_village_values(file_row);

    expect(result).toEqual(["123", "Village", "VillageEN", 3, 2]);
  });

  it("get_village_rows_count returns count from db", async () => {
    client.query.mockResolvedValue({ rows: [{ count: 42 }] });
    const count = await get_village_rows_count();
    expect(count).toBe(42);
  });

  it("get_villages_info builds query and calls db", async () => {
    client.query.mockResolvedValue({
      rows: [{ id: 1, name: "V", name_en: "VE" }],
    });

    const result = await get_villages_info({
      bgName: "Village",
      enName: "VillageEN",
    });
    expect(client.query).toHaveBeenCalled();
    expect(result.rows[0].name).toBe("V");
  });
});
