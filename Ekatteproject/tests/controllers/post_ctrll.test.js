import { describe, vi, expect, it } from "vitest";
import { createVillageHandler } from "../../src/handlers/create_village_handler";
import request from "supertest";
import { server } from "../../src";

vi.mock("../../src/handlers/create_village_handler", () => ({
  createVillageHandler: vi.fn()
}));

describe("POST /api/create-data", () => {
    it("calls createVillageHandler and returns 200", async () => {
        const reqBody = {id : 3};

        const response = await request(server).post("/api/create-data").send(reqBody);

        expect(createVillageHandler).toHaveBeenCalledWith(reqBody);
        expect(response.status).toBe(200);
        expect(response.text).toBe("Request was successful");
    })
})