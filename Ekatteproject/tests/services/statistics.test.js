import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/model/village.js", () => ({
  get_village_rows_count: vi.fn(),
}));

vi.mock("../../src/model/district.js", () => ({
  get_district_rows_count: vi.fn(),
}));

vi.mock("../../src/model/township.js", () => ({
  get_township_rows_count: vi.fn(),
}));

vi.mock("../../src/model/cityhalls.js", () => ({
  get_cityhall_rows_count: vi.fn(),
}));


// vi.mock("../src/errors/custom_error.js", () => ({
//   NotFoundError: class NotFoundError ex{
//     constructor(msg) {
//       this.message = msg;
//       this.name = "NotFoundError";
//     }
//   },
// }));

// --- 3) Import after mocks ---
import { getStatistics } from "../../src/services/statistics.js";
import { get_village_rows_count } from "../../src/model/village.js";
import { get_district_rows_count } from "../../src/model/district.js";
import { get_township_rows_count } from "../../src/model/township.js";
import { get_cityhall_rows_count } from "../../src/model/cityhalls.js";

// Prevent logs during tests
vi.spyOn(console, "log").mockImplementation(() => {});

describe("getStatistics()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all table statistics when counts are valid", async () => {
    get_village_rows_count.mockResolvedValue(100);
    get_district_rows_count.mockResolvedValue(28);
    get_township_rows_count.mockResolvedValue(250);
    get_cityhall_rows_count.mockResolvedValue(400);

    const result = await getStatistics();

    expect(result).toEqual({
      village_count: 100,
      district_count: 28,
      township_count: 250,
      cityhalls_count: 400,
    });

    expect(get_village_rows_count).toHaveBeenCalled();
    expect(get_district_rows_count).toHaveBeenCalled();
    expect(get_township_rows_count).toHaveBeenCalled();
    expect(get_cityhall_rows_count).toHaveBeenCalled();
  });

  it("returns NotFoundError when any count is null", async () => {
    get_village_rows_count.mockResolvedValue(null); // triggers error
    get_district_rows_count.mockResolvedValue(28);
    get_township_rows_count.mockResolvedValue(250);
    get_cityhall_rows_count.mockResolvedValue(400);

    const result = await getStatistics();

    expect(result).toBeInstanceOf(Error);
    expect(result.name).toBe("NotFoundError");
    expect(result.message).toBe("Couldn't get tables statistics");
  });
});
