import { describe, it, vi, expect, beforeEach } from "vitest";
import { connectToDatabase, disconnectFromDatabase } from "../src/config/db.js";
// describe("");

vi.mock("pg", () => {
  return {
    Client: class {
      constructor() {
        this.connect = vi.fn().mockResolvedValue();
        this.query = vi.fn().mockResolvedValue({ rows: [] });
        this.end = vi.fn().mockResolvedValue(true);
      }
    },
  };
});

import client from "../src/config/db.js";

describe("Database client module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("connectToDatabase should call client.connect()", async () => {
    await connectToDatabase();

    expect(client.connect).toHaveBeenCalledTimes(1);
  });

  it("disconnectFromDatabase should call client.end()", async () => {
    await disconnectFromDatabase();

    expect(client.end).toHaveBeenCalledTimes(1);
  });
});
