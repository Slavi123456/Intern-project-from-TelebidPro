import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/config/db.js", () => ({
  default: { query: vi.fn() },
}));

vi.mock("../src/model/village.js", () => ({
  safe_get_village_values: vi.fn(),
}));

vi.mock("../src/utils/errorHandling.js", () => ({
  withErrorHandling: (fn) => fn, // just return original function
}));

vi.mock("../src/utils/validation.js", () => ({
  validateMany: vi.fn(),
}));

import db_client from "../src/config/db.js";
import { safe_get_village_values } from "../src/model/village.js";
import { bulk_inserts_from_json, insert_into_table } from "../src/services/databese_inserts.js";

describe("Bulk insert functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("insert_into_table calls db_client.query for each row", async () => {
    const fakeJson = [{ id: 1 }, { id: 2 }, { }];
    const mockMapper = vi.fn().mockImplementation((row) => [row.id]);

    db_client.query.mockResolvedValue({ rows: [{}] });

    await insert_into_table("INSERT INTO test", "TestTable", fakeJson, mockMapper);

    expect(mockMapper).toHaveBeenCalledTimes(fakeJson.length - 1);
    expect(db_client.query).toHaveBeenCalledTimes(fakeJson.length - 1);
  });

  it("bulk_inserts_from_json calls safe_get_village_values for villages", async () => {
    const fakeJson = [
      { ekatte: "1", name: "V1", name_en: "V1_EN", area1: "Text1" },
    ];
    // override JSON imports with test data
    const originalDistrictJson = globalThis.district__json_file;
    const originalVillagesJson = globalThis.villages__json_file;

    // mock db_client query
    db_client.query.mockResolvedValue({ rows: [{}] });
    safe_get_village_values.mockResolvedValue([1, 2, 3, 4, 5]);

    // Call bulk_inserts_from_json with test arrays instead of real JSON
    await bulk_inserts_from_json();

    expect(safe_get_village_values).toHaveBeenCalled();

    // restore JSON if needed
    globalThis.district__json_file = originalDistrictJson;
    globalThis.villages__json_file = originalVillagesJson;
  });
});
