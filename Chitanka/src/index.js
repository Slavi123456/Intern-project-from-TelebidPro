import { extractingCycle } from "./extractors/main_extractor.js";
import { processStatistics } from "./statistics.js";
import { populateTables } from "./model/main_insert.js";

("use-strict");
export {main};

main();

async function main() {
  const dataInfo = await extractingCycle();
  if (dataInfo == null) {
    return;
  }

  populateTables(dataInfo);

  const statistics = processStatistics(dataInfo);
  console.log(statistics);
}

