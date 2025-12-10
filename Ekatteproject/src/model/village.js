import { parse_names_from_village_text } from "../utils/villageParser.js";
import { select_id_query_from_district } from "./district.js";
import { select_id_query_from_township } from "./township.js";
import { validateMany } from "../utils/validation.js";
import { withErrorHandling } from "../utils/errorHandling.js";
import dotenv from "dotenv";
import client from "../config/db.js"

export { safe_get_village_values, get_village_rows_count, get_villages_info};

//Somehow to be exported only on test environment
export { get_ids_from_queries, get_ids_from_text, get_village_values}

dotenv.config();

const safe_get_village_values = withErrorHandling(get_village_values);

async function get_ids_from_text(text) {
  validateMany(
    {
      text: process.env.VALIDATION_TYPE_NONEMPTY_STRING,
      // client: process.env.VALIDATION_TYPE_DB_CLIENT,
    },
    arguments
  );

  ////////
  //Logic
  const values = parse_names_from_village_text(text);
  // if(!values) throw new ;
  // console.log(JSON.stringify(values));

  const ids = await get_ids_from_queries(
    values.township,
    values.district,
  );
  // console.log(ids);
  return ids;
}

async function get_ids_from_queries(township_name, district_name) {
  validateMany(
    {
      township_name: process.env.VALIDATION_TYPE_NONEMPTY_STRING,
      district_name: process.env.VALIDATION_TYPE_NONEMPTY_STRING,
      // client: process.env.VALIDATION_TYPE_DB_CLIENT,
    },
    arguments
  );

  ////
  //Logic
  let ids = {
    district_id: await select_id_query_from_district(district_name),
    township_id: await select_id_query_from_township(township_name),
  };

  if (ids.district_id == null || ids.township_id == null) {
    return new NotFoundError(
      `Couldn't get the district_id with district: ${district_name} or township_id from township ${township_name}`
    );
  }

  return ids;
}

async function get_village_values(file_row) {
  validateMany(
    {
      file_row: process.env.VALIDATION_TYPE_OBJECT,
      // client: process.env.VALIDATION_TYPE_DB_CLIENT,
    },
    arguments
  );

  /////
  //Logic
  const ids = await get_ids_from_text(file_row.area1);
  if (!ids)
    return new NotFoundError(
      `Couldn't get ids from information ${JSON.stringify(file_row.area1)}`
    );

  return [
    file_row.ekatte,
    file_row.name,
    file_row.name_en,
    ids.township_id,
    ids.district_id,
  ];
}

async function get_village_rows_count() {
  ////
  //Logic
  const villages_count = await client.query("SELECT COUNT(*) FROM villages;");
  // console.log(villages_count.rows);
  // console.log(villages_count.rows[0]?.count);

  return villages_count.rows[0]?.count;
}

async function get_villages_info({ bgName, enName }) {
  // let sql = `SELECT * FROM villages WHERE 1=1`;
  let sql = `
    SELECT 
        V.id,
        V.name,
        V.name_en,
        D.name AS DistrictName,
        T.name AS TownshipName,
        (SELECT name FROM cityhall C WHERE C.township_id = T.id LIMIT 1) AS CityhallName
    FROM villages V
    JOIN district D ON V.district_id = D.id
    JOIN township T ON V.township_id = T.id
    WHERE 1 = 1`;
  const params = [];
  let count = 1;
  if (bgName !== undefined) {
    sql += ` AND V.name = $${count}`;
    count++;
    params.push(bgName);
  }

  if (enName !== undefined) {
    sql += ` AND V.name_en = $${count}`;
    count++;
    params.push(enName);
  }
  // console.log(sql, params);
  return await client.query(sql, params);
}
