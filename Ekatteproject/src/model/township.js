import { validateMany } from "../utils/validation.js";
import client from "../config/db.js"

export {select_id_query_from_township, get_township_rows_count};

async function select_id_query_from_township(township_name) {
  validateMany ( {
    township_name: process.env.VALIDATION_TYPE_NONEMPTY_STRING,
    // client: process.env.VALIDATION_TYPE_DB_CLIENT,
  }, arguments);

  ////
  //Logic
  const township_id_id_res = await client.query(
    "SELECT id FROM township WHERE township.name = $1;",
    [township_name]
  );
  // console.log("Township id ", township_id_id_res.rows[0]?.id, "for ", township_name );
  return township_id_id_res.rows[0]?.id;
}


async function get_township_rows_count() {
  ////
  //Logic
  const res = await client.query("SELECT COUNT(*) FROM township;");
  // console.log(villages_count.rows);
  // console.log(villages_count.rows[0]?.count);

  return res.rows[0]?.count;
}