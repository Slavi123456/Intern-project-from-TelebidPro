import { extractingCycle } from "./extractors/main_extractor.js";
import { processStatistics } from "./statistics.js";
import { populateTables } from "./model/main_insert.js";

("use-strict");

main();

async function main() {
  const dataInfo = await extractingCycle();
  if (dataInfo == null) {
    return;
  }

  populateTables(dataInfo);

  const statistics = processStatistics(dataInfo);
  console.log(statistics);

  // 4.Code coverage - 100%
}

