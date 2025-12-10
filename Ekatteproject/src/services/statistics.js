import { get_village_rows_count } from "../model/village.js";
import { NotFoundError } from "../errors/custom_error.js";
import { get_district_rows_count } from "../model/district.js";
import { get_township_rows_count } from "../model/township.js";
import { get_cityhall_rows_count } from "../model/cityhalls.js";

export { getStatistics };

async function getStatistics() {
  const tableStatistics = {
    village_count: await get_village_rows_count(),
    district_count: await get_district_rows_count(),
    township_count: await get_township_rows_count(),
    cityhalls_count: await get_cityhall_rows_count(),
  };
  console.log(tableStatistics);
  if (
    tableStatistics.village_count == null ||
    tableStatistics.district_count == null ||
    tableStatistics.township_count == null ||
    tableStatistics.cityhalls_count == null
  ) {
    return new NotFoundError(`Couldn't get tables statistics`);
  }

  return tableStatistics;
}
