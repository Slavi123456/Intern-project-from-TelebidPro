import client from "../config/db.js"

export {get_cityhall_rows_count};

async function get_cityhall_rows_count() {
  ////
  //Logic
  const res = await client.query("SELECT COUNT(*) FROM cityhall;");
  // console.log(villages_count.rows);
  // console.log(villages_count.rows[0]?.count);

  return res.rows[0]?.count;
}