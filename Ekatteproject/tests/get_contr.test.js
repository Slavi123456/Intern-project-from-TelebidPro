import { describe, it, vi, expect, beforeEach } from "vitest";
import { get_controller } from "../src/controllers/get_controller.js";

vi.mock("../src/controllers/static_files.js", () => ({
  serve_static_files: vi.fn(),
}));

vi.mock("../src/controllers/queries.js", () => ({
  data_load: vi.fn(),
  fill_tables: vi.fn(),
  village_query_handler: vi.fn(),
}));

import { serve_static_files } from "../src/services/static_files.js";
// import {
//   fill_tables,
//   data_load,
//   village_query_handler,
// } from "../src/services/queries.js";
// import { data_load } from "../src/controllers/queries.js";
// import { village_query_handler } from "../src/controllers/queries.js";

function createMockReq(pathname, method = "GET") {
  return {
    pathname,
    method,
  };
}

function createMockRes() {
  const res = {};
  res.statusCode = 200;
  res.end = vi.fn();
  res.writeHead = vi.fn();
  return res;
}
describe("")
// describe("get_controller integration tests", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it("should serve main.html for '/'", async () => {
//     const req = createMockReq("/");
//     const res = createMockRes();

//     // serve_static_files.mockResolvedValue(4);

//     await get_controller(req, res);

//     expect(serve_static_files).toHaveBeenCalledWith(
//       req,
//       res,
//       "public/main.html"
//     );
//   });

//   it("should serve main.css for '/main.css'", async () => {
//     const req = createMockReq("/main.css");
//     const res = createMockRes();

//     await get_controller(req, res);

//     expect(serve_static_files).toHaveBeenCalledWith(req, res, "public");
//   });

//   it("should serve main.js for '/main.js'", async () => {
//     const req = createMockReq("/main.js");
//     const res = createMockRes();

//     await get_controller(req, res);

//     expect(serve_static_files).toHaveBeenCalledWith(req, res, "public");
//   });

//   it("should call fill_tables and data_load for '/api/init'", async () => {
//     const req = createMockReq("/api/init");
//     const res = createMockRes();

//     await get_controller(req, res);

//     expect(fill_tables).toHaveBeenCalled();
//     expect(data_load).toHaveBeenCalledWith(req, res);
//   });

//   it("should call village_query_handler for '/villages'", async () => {
//     const req = createMockReq("/villages");
//     const res = createMockRes();

//     await get_controller(req, res);

//     expect(village_query_handler).toHaveBeenCalledWith(req, res);
//   });

//   it("should fallback to serve_static_files for unknown routes", async () => {
//     const req = createMockReq("/unknown");
//     const res = createMockRes();

//     await get_controller(req, res);

//     expect(serve_static_files).toHaveBeenCalledWith(req, res, "public");
//   });
// });
