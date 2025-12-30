import { describe, it, expect, vi, beforeEach } from "vitest";
import { main } from "../src/index.js"; 
import * as mainExtractor from "../src/extractors/main_extractor"; 
import * as statistics from "../src/statistics";  
import * as model from "../src/model/main_insert";
import * as db from "../src/config/db";

vi.mock("../src/config/db", () => ({
  connectToDatabase: vi.fn(),
  disconnectFromDatabase: vi.fn(),
}));

vi.mock("../src/extractors/main_extractor", () => ({
  extractingCycle: vi.fn(),
}));

vi.mock("../src/statistics", () => ({
  processStatistics: vi.fn(),
}));

vi.mock("../src/model/main_insert", () => ({
  populateTables: vi.fn(),
}));

describe("main()", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    db.connectToDatabase.mockResolvedValue(true);
    db.disconnectFromDatabase.mockResolvedValue(true);
  });
  it("should call populateTables and processStatistics when dataInfo is valid", async () => {
    const mockDataInfo = [{ countryName: "Country A", authorsList: [] }];
    
    mainExtractor.extractingCycle.mockResolvedValue(mockDataInfo);
    statistics.processStatistics.mockReturnValue({
      countriesCount: 1,
      countAuthors: 1,
      countBooks: 1,
      authorsStatistics: [],
      booksStatistics: [],
    });
    
    await main();

    expect(mainExtractor.extractingCycle).toHaveBeenCalled();
    expect(statistics.processStatistics).toHaveBeenCalledWith(mockDataInfo);    
    expect(model.populateTables).toHaveBeenCalledWith(mockDataInfo);
  });

  it("should not call populateTables or processStatistics when dataInfo is null", async () => {
    mainExtractor.extractingCycle.mockResolvedValue(null);

    await main();

    expect(statistics.processStatistics).not.toHaveBeenCalled();
    expect(model.populateTables).not.toHaveBeenCalled();
  });
});
