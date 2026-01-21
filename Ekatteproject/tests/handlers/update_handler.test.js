import { vi, describe, expect, it, beforeEach } from "vitest";

vi.mock("../../src/model/village.js", () => ({
  update_village: vi.fn(),
}));

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
    update_village.mockResolvedValue(true);

    const fake_village_data = {
            name: "Село",
            name_en: "Village",
            township_id: "VAR02",
            district_id: "VAR",
    };
    const result = await updateVillageHandler({
      id: 1,
      ...fake_village_data
    });
    expect(update_village).toHaveBeenCalledWith(1, fake_village_data);

    expect(result).toBe(true);
  });
});

