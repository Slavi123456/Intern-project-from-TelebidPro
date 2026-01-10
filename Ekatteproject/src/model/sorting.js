import client from "../config/db.js";

export { sorting }

// ORDER BY V.name DESC, D.name DESC
// sorting({
//   id: null,        
//   nameBG: 'DESC',
//   nameEN: null,
//   district: 'DESC',
//   township: null,
//   cityhall: null
// });


async function sorting(sortArguments) {
    const { id, nameBG, nameEN, district, township, cityhall } = sortArguments;

    // Build array of ordering clauses
    const orderClauses = [];

    if (id === 'ASC' || id === 'DESC') orderClauses.push(`V.id ${id}`);
    if (nameBG === 'ASC' || nameBG === 'DESC') orderClauses.push(`V.name ${nameBG}`);
    if (nameEN === 'ASC' || nameEN === 'DESC') orderClauses.push(`V.name_en ${nameEN}`);
    if (district === 'ASC' || district === 'DESC') orderClauses.push(`D.name ${district}`);
    if (township === 'ASC' || township === 'DESC') orderClauses.push(`T.name ${township}`);
    if (cityhall === 'ASC' || cityhall === 'DESC') orderClauses.push(`CityhallName ${cityhall}`);

    const ordering = orderClauses.length > 0 ? orderClauses.join(', ') : 'V.id ASC';

    const sql = `
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
        ORDER BY ${ordering};
    `;

    // console.log(sql);
    const res = await client.query(sql);

    return res.rows;
}
