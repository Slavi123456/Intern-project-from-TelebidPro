import { validateMany } from "../utils/validation.js";
import client from "../config/db.js"

export {select_id_query_from_district, get_district_rows_count};

async function select_id_query_from_district(district_name) {
  validateMany ( {
    district_name: process.env.VALIDATION_TYPE_NONEMPTY_STRING,
    // client: process.env.VALIDATION_TYPE_DB_CLIENT,
  }, arguments);
  
  ////
  //Logic
  const district_id_res = await client.query(
    "SELECT id FROM district WHERE district.name = $1;",
    [district_name]
  );
  // console.log("District id ", district_id_res.rows[0]?.id, "for ", district_name );
  return district_id_res.rows[0]?.id;
}


async function get_district_rows_count() {
  ////
  //Logic
  const res = await client.query("SELECT COUNT(*) FROM district;");
  // console.log(villages_count.rows);
  // console.log(villages_count.rows[0]?.count);

  return res.rows[0]?.count;
}
