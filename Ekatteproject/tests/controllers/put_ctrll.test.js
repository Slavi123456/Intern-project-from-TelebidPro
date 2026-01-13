import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { server } from "../../src";
import { updateVillageHandler } from "../../src/handlers/update_village_handler.js";

vi.mock("../../src/handlers/update_village_handler.js", () => ({
  updateVillageHandler: vi.fn(),
}));

describe("PUT /api/edit-data (unit style)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls updateVillageHandler and sends 200 response", async () => {
    const reqBody = { villageId: 5, name: "New Name" };
    const response = await request(server).put("/api/edit-data").send(reqBody);
    console.log(response);
    expect(updateVillageHandler).toHaveBeenCalledWith({
      villageId: 5,
      name: "New Name",
    });
    expect(response.status).toBe(200);
    expect(response.text).toBe("Request was successful");
  });
});
