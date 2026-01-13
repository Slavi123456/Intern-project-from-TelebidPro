import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/model/district.js", () => ({
  select_id_query_from_district: vi.fn(),
}));
vi.mock("../../src/model/township.js", () => ({
  select_id_query_from_township: vi.fn(),
}));

vi.mock("../../src/config/db.js", () => ({
  default: {
    query: vi.fn(),
  },
}));

vi.mock("../../src/utils/validation.js", () => ({
  validateMany: vi.fn(),
}));

vi.mock("../../src/utils/villageParser.js", () => ({
  parse_names_from_village_text: vi.fn(),
}));

// vi.mock("../src/errors/custom_error.js", () => ({
//   NotFoundError: vi.
// }))

import { select_id_query_from_township } from "../../src/model/township.js";
import { select_id_query_from_district } from "../../src/model/district.js";
import { get_ids_from_queries } from "../../src/model/village.js";
import { parse_names_from_village_text } from "../../src/utils/villageParser.js";
import client from "../../src/config/db.js";
import { validateMany } from "../../src/utils/validation.js";

// import {parse_names_from_village_text, get_villages_info,get_village_rows_count}

// import { NotFoundError } from "../src/errors/custom_error.js";
import { get_ids_from_text } from "../../src/model/village.js";
import { get_village_values } from "../../src/model/village.js";
import { get_village_rows_count } from "../../src/model/village.js";
import { get_villages_info } from "../../src/model/village.js";

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

    const result = await expect(
      get_ids_from_queries("Township", "District")
    ).rejects.instanceOf(Error);
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

import { get_all_village_rows } from "../../src/model/village.js";
describe("get_all_village_rows()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("succesful getting all village rows", async () => {
    const testRows = [];
    client.query.mockResolvedValue({ rows: testRows });
    expect(await get_all_village_rows()).toEqual(testRows);
    expect(client.query).toBeCalledTimes(1);
  });
});

import { get_village_id } from "../../src/model/village.js";
describe("get_village_id()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("succesful get village id", async () => {
    const id = 3;
    const testRows = [{ id: id }];
    client.query.mockResolvedValue({ rows: testRows });
    expect(await get_village_id()).toBe(id);
    expect(client.query).toBeCalledTimes(1);
  });
});

import { update_village } from "../../src/model/village.js";
describe("update_village()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("successful updating village query", async () => {
    const testVillageId = 3;
    const testVillage = {
      name: "a",
      name_en: "b",
      township_id: "c",
      village_id: "d",
    };
    const sql = `UPDATE villages
    SET name = $1, name_en = $2, township_id = $3, district_id = $4
    WHERE id = $5;`;

    const testRows = [];
    client.query.mockResolvedValue({ rows: testRows });
    expect(await update_village(testVillageId, testVillage)).toEqual(testRows);
    expect(client.query).toBeCalledTimes(1);
    expect(client.query).toHaveBeenCalledWith(sql, [
      testVillage.name,
      testVillage.name_en,
      testVillage.township_id,
      testVillage.district_id,
      testVillageId,
    ]);
  });
});

import { get_biggest_village_id } from "../../src/model/village.js";
describe("get_biggest_village_id()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("succesfuly extracting biggest id", async () => {
    const id = 3;
    const testRows = [{ id: id }];
    client.query.mockResolvedValue({ rows: testRows });
    expect(await get_biggest_village_id()).toBe(id);
    expect(client.query).toBeCalledTimes(1);
  });
});

import { insert_row_into_village } from "../../src/model/village.js";
describe("insert_row_into_village()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("", async () => {
    const testVillage = {
      id: "123",
      name: "a",
      name_en: "b",
      township_id: "c",
      village_id: "d",
    };
    const sql = ` INSERT INTO villages(id, name, name_en, township_id, district_id)
                  VALUES($1, $2, $3, $4, $5); --ON CONFLICT DO NOTHING RETURNING *;`;
    const testRows = [];
    client.query.mockResolvedValue({ rows: testRows });
    expect(await insert_row_into_village(testVillage)).toEqual(testRows);
    expect(client.query).toBeCalledTimes(1);
  });
});

import { delete_village_row } from "../../src/model/village.js";
describe("delete_village_row", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("deletes a village by id and returns rows", async () => {
    const villageId = 5;
    const mockRows = [{ id: villageId, name: "Test Village" }];

    client.query.mockResolvedValue({
      rows: mockRows,
    });

    const result = await delete_village_row(villageId);

    expect(client.query).toHaveBeenCalledTimes(1);
    expect(client.query).toHaveBeenCalledWith(
      `DELETE FROM villages WHERE id = $1 RETURNING *;`,
      [villageId]
    );
    expect(result).toEqual(mockRows);
  });
});

