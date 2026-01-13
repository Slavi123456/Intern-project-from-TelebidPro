import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { server } from "../../src";
import { deleteVillageHandler } from "../../src/handlers/delete_village_handler";

vi.mock("../../src/handlers/delete_village_handler", () => ({
  deleteVillageHandler: vi.fn(),
}));

describe("DELETE /api/delete-data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it("calls deleteVillageHandler and returns 200", async () => {
    deleteVillageHandler.mockResolvedValue();

    const response = await request(server)
      .delete("/api/delete-data")
      .send({ villageId: 5 });

    expect(deleteVillageHandler).toHaveBeenCalledWith({ villageId: 5 });
    expect(response.status).toBe(200);
    expect(response.text).toBe("Request was successful");
  });
});
