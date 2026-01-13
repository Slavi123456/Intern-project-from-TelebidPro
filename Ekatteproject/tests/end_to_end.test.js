import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { server } from "../src/index.js";

describe("Server Endpoints", () => {
  afterAll(() => {
    server.close();
  });

  it('200 for a GET request to "/"', async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);

  });

  it("should serve main.css on GET /main.css", async () => {
    const response = await request(server).get("/main.css");
    expect(response.status).toBe(200);
    expect(response.header["content-type"]).toMatch(/text\/css/);
  });

  it("404 for a non-existing route", async () => {
    const response = await request(server).get("/non-existing");
    expect(response.status).toBe(404);
  });

  it("should handle POST requests with 404", async () => {
    const response = await request(server).post("/");
    expect(response.status).toBe(404);
  });
});
