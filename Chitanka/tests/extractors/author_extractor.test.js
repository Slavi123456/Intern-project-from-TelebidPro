import * as cheerio from "cheerio";
import { describe, it, expect, vi } from "vitest";
import { extractAuthors } from "../../src/extractors/authors.js";


describe("")

// vi.mock("cheerio", () => ({
//   load: vi.fn().mockImplementation(() => {
//     return vi.fn().mockImplementation((selector) => {
//       if (selector === 'a[href*="/person"]') {
//         return {
//           each: vi.fn().mockImplementation((callback) => {
//             const mockElements = [
//               { text: () => "Author One", attr: () => "/person/1" },
//               { text: () => "Author Two", attr: () => "/person/2" }
//             ];
//             mockElements.forEach((el, idx) => callback(idx, el));
//           }),
//         };
//       }
//       return {};
//     });
//   }),
// }));


// describe("extractAuthors()", () => {
//   it("should extract authors and their hrefs from the HTML", () => {
//     const html = `<html><body>
//       <a href="/person/1">Author One</a>
//       <a href="/person/2">Author Two</a>
//     </body></html>`;

//     const expectedResult = [
//       { author: "Author One", href: "/person/1" },
//       { author: "Author Two", href: "/person/2" },
//     ];

//     const result = extractAuthors(html);

//     expect(result).toEqual(expectedResult);
//   });
// });
