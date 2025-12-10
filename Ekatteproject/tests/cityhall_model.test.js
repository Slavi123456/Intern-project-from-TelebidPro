import { describe, it, expect, vi } from "vitest";

import client from "../src/config/db.js";
import { get_cityhall_rows_count } from "../src/model/cityhalls.js";

vi.mock("../src/config/db.js", () => ({
  default: {
    query: vi.fn(),
  },
}));

describe("get_cityhall_rows_count()", () => {
  it("check for success", async () => {
    client.query.mockResolvedValue({
      rows: [{ count: 42 }],
    });

    const result = await get_cityhall_rows_count();
    expect(result).toBe(42);

    expect(client.query).toHaveBeenCalledWith("SELECT COUNT(*) FROM cityhall;");
  });

  it("check for undefined", async () => {
    client.query.mockResolvedValue({ rows: [] });

    const result = await get_cityhall_rows_count();
    expect(result).toBeUndefined();
  });
});
