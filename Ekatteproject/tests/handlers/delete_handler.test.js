import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteVillageHandler } from "../../src/handlers/delete_village_handler.js";
import { NotFoundError, ValidationError } from "../../src/errors/custom_error.js";

vi.mock("../../src/model/village.js", () => ({
  delete_village_row: vi.fn(),
}));

import { delete_village_row } from "../../src/model/village.js";

describe("deleteVillageHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws ValidationError if id is missing", async () => {
    await expect(deleteVillageHandler(undefined))
      .rejects.toBeInstanceOf(ValidationError);

    expect(delete_village_row).not.toHaveBeenCalled();
  });

  it("throws NotFoundError if no rows are deleted", async () => {
    delete_village_row.mockResolvedValue([]);

    await expect(deleteVillageHandler(123))
      .rejects.toBeInstanceOf(NotFoundError);

    expect(delete_village_row).toHaveBeenCalledWith(123);
  });

  it("returns true when village is deleted", async () => {
    delete_village_row.mockResolvedValue([{ id: 123 }]);

    const result = await deleteVillageHandler(123);

    expect(result).toBe(true);
    expect(delete_village_row).toHaveBeenCalledWith(123);
  });
});
