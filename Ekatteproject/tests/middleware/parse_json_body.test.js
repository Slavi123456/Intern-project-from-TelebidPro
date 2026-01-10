import { describe, vi, it, expect, beforeEach } from "vitest";

import { parseJsonBody } from "../../src/middlewares/parse_json";

describe("")
// describe("parseJsonBody()", () => {
//   let req,res,next;
//   beforeEach(() => {
//     req = { on: vi.fn(), method: "POST", headers: {} };
//     res = { writeHead: vi.fn(), end: vi.fn() };
//     next = vi.fn();
//   });

//   it("", () => {
//     req.headers["content-type"] = "application/json";
//     req.on.mockImplementationOnce((event, callback) => {
//       if (event === "data") callback('{"key": "value"}');
//       if (event === "end") callback();
//     });

//     parseJsonBody(req, res, next);

//     expect(req.body).toStrictEqual({ key: "value" });
//     expect(next).toHaveBeenCalled();
//   });
// });
