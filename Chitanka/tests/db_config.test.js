import { describe, it, vi, expect } from "vitest";

// describe("");

vi.mock("pg", () => {
  return {
    Client: class {
      constructor() {
        this.connect = vi.fn().mockResolvedValue();
        this.query = vi.fn().mockResolvedValue({ rows: [] });
        this.end = vi.fn().mockResolvedValue();
      }
    },
  };
});

import client from "../src/config/db.js";

describe("Database client module", () => {
  it("should connect the client on import", async () => {
    expect(client.connect).toHaveBeenCalled();
  });
});
