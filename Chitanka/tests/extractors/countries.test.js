import { describe, it, expect, vi } from "vitest";
import * as cheerio from "cheerio";
import { extractCountries } from "../../src/extractors/countries.js";


describe("")

// vi.mock("cheerio", () => ({
//   load: vi.fn().mockImplementation(() => {
//     return (selector) => {
//       if (selector === 'a[href*="/authors/country"]') {
//         return {
//           each: vi.fn().mockImplementation((callback) => {
//             const mockElements = [
//               { 
//                 text: () => "Country One", 
//                 attr: () => "/authors/country/one", 
//                 closest: () => ({
//                   find: () => ({
//                     text: () => "5"
//                   })
//                 })
//               },
//               { 
//                 text: () => "Country Two", 
//                 attr: () => "/authors/country/two", 
//                 closest: () => ({
//                   find: () => ({
//                     text: () => "10"
//                   })
//                 })
//               }
//             ];
//             mockElements.forEach((el, idx) => callback(idx, el)); 
//           }),
//         };
//       }
//       return {};
//     };
//   }),
// }));

// describe("extractCountries()", () => {
//   it("should extract countries, hrefs, and item counts from the HTML", () => {
//     const html = `<html><body>
//       <a href="/authors/country/one">Country One</a><span class="nr-of-items">5</span>
//       <a href="/authors/country/two">Country Two</a><span class="nr-of-items">10</span>
//     </body></html>`;

//     const expectedResult = [
//       { country: "Country One", href: "/authors/country/one", count: 5 },
//       { country: "Country Two", href: "/authors/country/two", count: 10 },
//     ];

//     const result = extractCountries(html);

//     expect(result).toEqual(expectedResult);
//   });
// });
