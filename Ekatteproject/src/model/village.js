import { parse_names_from_village_text } from "../utils/villageParser.js";
import { select_id_query_from_district } from "./district.js";
import { select_id_query_from_township } from "./township.js";
import { validateMany } from "../utils/validation.js";
import { withErrorHandling } from "../utils/errorHandling.js";
import dotenv from "dotenv";
import client from "../config/db.js"

export { safe_get_village_values, get_village_rows_count, get_villages_info, 
  get_all_village_rows, get_village_id, update_village, get_biggest_village_id,
  insert_row_into_village, delete_village_row};

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

async function get_all_village_rows() {
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
  const villages = await client.query(sql);
  // console.log(villages_count.rows);

  return villages.rows;
}

// console.log(get_all_village_rows());

async function get_village_id(village_name) {
  const id_res = await client.query(
    "SELECT id FROM villages WHERE villages.name = $1;",
    [village_name]
  );

  return id_res.rows[0]?.id;
}


async function update_village(village_id, new_info){
  const {name, name_en, township_id, district_id} = new_info;

  const res = await client.query(
    `UPDATE villages
    SET name = $1, name_en = $2, township_id = $3, district_id = $4
    WHERE id = $5;`,
    [name,name_en,township_id,district_id, village_id]
  );
  console.log(res.rows);
  // return res.rows;
}

async function get_biggest_village_id() {
  const res = await client.query(`SELECT id FROM villages ORDER BY id DESC LIMIT 1;`);
  // console.log('rows', res.rows[0], res.rows[0]?.id);
  return res.rows[0]?.id;
}

async function insert_row_into_village(newVillage) {
  const {id, name, name_en, township_id, district_id} = newVillage;
  console.log(id,name, name_en, township_id, district_id);
  const sql = ` INSERT INTO villages(id, name, name_en, township_id, district_id) 
                  VALUES($1, $2, $3, $4, $5); --ON CONFLICT DO NOTHING RETURNING *;`;

  const res = await client.query(sql, [id,name,name_en, township_id, district_id]);
  console.log('rows', res.rows);
  // return res.rows[];
}

async function delete_village_row(villageId) {
  const res = await client.query(`DELETE FROM villages WHERE id = $1 RETURNING *;`, [villageId]);
  console.log('DELETE rows', res);
  return res.rowCount > 0;
}