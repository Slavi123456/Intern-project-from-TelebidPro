import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/config/db", () => ({
  default: {
    query: vi.fn(),
  },
}));

import client from "../../src/config/db";
import { sorting } from "../../src/model/sorting";

describe("sorting()", () => {
  beforeEach(() => {
    client.query.mockReset();
  });

  it("all arguments null", async () => {
    const fakedRows = [1];
    client.query.mockResolvedValue({
      rows: fakedRows,
    });

    const sortArguments = {
      id: null,
      nameBG: null,
      nameEN: null,
      district: null,
      township: null,
      cityhall: null,
    };

    const rows = await sorting(sortArguments);
    expect(rows).toBe(fakedRows);

    expect(client.query).toHaveBeenCalledTimes(1);
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining("ORDER BY V.id ASC")
    );
  });

  it("random arguments null", async () => {
    const fakedRows = [1];
    client.query.mockResolvedValue({
      rows: fakedRows,
    });

    const sortArguments = {
      id: 'DESC',
      nameBG: 'ASC',
      nameEN: 'DESC',
      district: 'ASC',
      township: 'ASC',
      cityhall: 'DESC',
    };

    const rows = await sorting(sortArguments);
    expect(rows).toBe(fakedRows);

    expect(client.query).toHaveBeenCalledTimes(1);
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining(" ORDER BY V.id DESC, V.name ASC, V.name_en DESC, D.name ASC, T.name ASC, CityhallName DESC")
    );
  });
});

// async function sorting(sortArguments) {
//     const { id, nameBG, nameEN, district, township, cityhall } = sortArguments;

//     // Build array of ordering clauses
//     const orderClauses = [];

//     if (id === 'ASC' || id === 'DESC') orderClauses.push(`V.id ${id}`);
//     if (nameBG === 'ASC' || nameBG === 'DESC') orderClauses.push(`V.name ${nameBG}`);
//     if (nameEN === 'ASC' || nameEN === 'DESC') orderClauses.push(`V.name_en ${nameEN}`);
//     if (district === 'ASC' || district === 'DESC') orderClauses.push(`D.name ${district}`);
//     if (township === 'ASC' || township === 'DESC') orderClauses.push(`T.name ${township}`);
//     if (cityhall === 'ASC' || cityhall === 'DESC') orderClauses.push(`(SELECT name FROM cityhall C WHERE C.township_id = T.id LIMIT 1) ${cityhall}`);

//     const ordering = orderClauses.length > 0 ? orderClauses.join(', ') : 'V.id ASC';

//     const sql = `
//         SELECT
//             V.id,
//             V.name,
//             V.name_en,
//             D.name AS DistrictName,
//             T.name AS TownshipName,
//             (SELECT name FROM cityhall C WHERE C.township_id = T.id LIMIT 1) AS CityhallName
//         FROM villages V
//         JOIN district D ON V.district_id = D.id
//         JOIN township T ON V.township_id = T.id
//         ORDER BY ${ordering};
//     `;

//     // console.log(sql);
//     const res = await client.query(sql);

//     return res.rows;
// }
