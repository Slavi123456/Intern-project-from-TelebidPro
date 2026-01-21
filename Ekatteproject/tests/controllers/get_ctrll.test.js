import { describe, it, expect, vi, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { server } from "../../src/index.js";


vi.mock("../../src/services/static_files.js", () => ({
  serve_static_files: vi.fn((req, res) => {
    res.writeHead(200);
    res.end("STATIC");
  }),
}));

vi.mock("../../src/services/databese_inserts.js", () => ({
  bulk_inserts_from_json: vi.fn(),
}));
vi.mock("../../src/model/township.js", () => ({
  get_township_rows_names: vi.fn(() => ["Township 1"]),
}));
vi.mock("../../src/model/district.js", () => ({
  get_district_rows_names: vi.fn(() => ["District 1"]),
}));
vi.mock("../../src/model/village.js", () => ({
  get_all_village_rows: vi.fn(() => [{ id: 1, name: "Test" }]),
  get_villages_info: vi.fn(() => [{ id: 2, name: "Search" }]),
}));

vi.mock("../../src/services/statistics.js", () => ({
  getStatistics: vi.fn(() => ({ count: 5 })),
}));

vi.mock("../../src/model/sorting.js", () => ({
  sorting: vi.fn(() => [{ id: 1 }]),
}));

vi.mock("../../src/handlers/exporting_handler.js", () => ({
  exportHandler: vi.fn((req, res, ext) => {
    res.setHeader("Content-Type", ext === "csv" ? "text/csv" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.end("EXPORT");
  }),
}));
import { get_all_village_rows, get_villages_info } from "../../src/model/village.js";
import { get_district_rows_names } from "../../src/model/district.js";
import { get_township_rows_names } from "../../src/model/township.js";
import { serve_static_files } from "../../src/services/static_files.js";
import { getStatistics } from "../../src/services/statistics.js";
import { sorting } from "../../src/model/sorting.js";
import { exportHandler } from "../../src/handlers/exporting_handler.js";
import { bulk_inserts_from_json } from "../../src/services/databese_inserts.js";
// describe("GET C")
afterAll(() => {
  server.close();
});

describe("Static routes", () => {
//   it("GET /", async () => {
//     const res = await request(server).get("/");
//     expect(res.status).toBe(200);
//     expect(res.text).toEqual("STATIC");
//   });

  it("GET /main.css", async () => {
    const res = await request(server).get("/assets/css/main.css");
    expect(res.status).toBe(200);
  });

  it("GET /main.js", async () => {
    const res = await request(server).get("/assets/js/main.js");
    expect(res.status).toBe(200);
  });

  it("GET /edit_data.html", async () => {
    const res = await request(server).get("/edit_data.html");
    expect(res.status).toBe(200);
  });
});


describe("API routes", () => {
  it("GET /api/init", async () => {
    const res = await request(server).get("/api/init");
    expect(res.status).toBe(200);
  });

  it("GET /api/villages", async () => {
    const res = await request(server).get("/api/villages");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: "Test" }]);
  });

  it("GET /api/init-statistics", async () => {
    const res = await request(server).get("/api/init-statistics");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ count: 5 });
  });

  it("GET /search/villages", async () => {
    const res = await request(server).get("/search/villages?name=test");
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("Search");
  });

  it("GET /districts-names", async () => {
    const res = await request(server).get("/districts-names");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(["District 1"]);
  });

  it("GET /townships-names", async () => {
    const res = await request(server).get("/townships-names");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(["Township 1"]);
  });
});

describe("GET /sorted/villages", () => {
  it("returns sorted villages", async () => {
    const res = await request(server).get("/sorted/villages");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1 }]);
  });
});

describe("Export routes", () => {
  it("GET /export/csv", async () => {
    const res = await request(server).get("/export/csv");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("text/csv");
    expect(res.text).toBe("EXPORT");
  });

  it("GET /export/excel", async () => {
    const res = await request(server).get("/export/excel");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"])
      .toBe("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  });
});
