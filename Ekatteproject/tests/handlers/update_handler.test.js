import { vi, describe, expect, it, beforeEach } from "vitest";

vi.mock("../../src/model/district.js", () => ({
  select_id_query_from_district: vi.fn(),
}));

vi.mock("../../src/model/township.js", () => ({
  select_id_query_from_township: vi.fn(),
}));
vi.mock("../../src/model/village.js", () => ({
  update_village: vi.fn(),
}));

import { select_id_query_from_district } from "../../src/model/district.js";
import { select_id_query_from_township } from "../../src/model/township.js";
import { update_village } from "../../src/model/village.js";
import { updateVillageHandler } from "../../src/handlers/update_village_handler";
import { ValidationError } from "../../src/errors/custom_error";

describe("updateVillageHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws ValidationError if village data is undefined", async () => {
    await expect(updateVillageHandler(undefined)).rejects.toBeInstanceOf(
      ValidationError
    );
  });
   it("throws ValidationError if village data is missing", async () => {
    await expect(updateVillageHandler({})).rejects.toBeInstanceOf(
      ValidationError
    );
  });
  it("updates village successfully", async () => {
    select_id_query_from_district.mockResolvedValue(10);
    select_id_query_from_township.mockResolvedValue(20);
    update_village.mockResolvedValue(true);

    const result = await updateVillageHandler({
      id: 1,
      name: "Село",
      name_en: "Village",
      township_name: "Township",
      district_name: "District",
    });

    expect(select_id_query_from_district).toHaveBeenCalledWith("District");
    expect(select_id_query_from_township).toHaveBeenCalledWith("Township");

    expect(update_village).toHaveBeenCalledWith(1, {
      name: "Село",
      name_en: "Village",
      township_id: 20,
      district_id: 10,
    });

    expect(result).toBe(true);
  });
});

