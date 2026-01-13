import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/model/district.js", () => ({
    select_id_query_from_district: vi.fn(),
}));

vi.mock("../../src/model/township.js", () => ({
    select_id_query_from_township: vi.fn(),
}));
vi.mock("../../src/model/village.js", () => ({
    get_biggest_village_id: vi.fn(),
    insert_row_into_village: vi.fn(),
}));

import { select_id_query_from_district } from "../../src/model/district";
import { select_id_query_from_township } from "../../src/model/township";
import {
    get_biggest_village_id,
    insert_row_into_village,
} from "../../src/model/village";
import { createVillageHandler } from "../../src/handlers/create_village_handler";
import { ValidationError } from "../../src/errors/custom_error";

describe("createVillageHandler()", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("throw on undifened village", async () => {
        await expect(createVillageHandler(undefined)).rejects.toBeInstanceOf(
            ValidationError
        );
    });

    it("throw on undifened fields of village", async () => {
        const failing_data = {
            id: "a",
            name: "Село",
            name_en: "",
            township_name: "Township",
            district_name: "District",
        };
        await expect(createVillageHandler(failing_data)).rejects.toBeInstanceOf(
            ValidationError
        );
    });

    it("creates village successfully", async () => {
        get_biggest_village_id.mockResolvedValue("00009");
        select_id_query_from_district.mockResolvedValue(1);
        select_id_query_from_township.mockResolvedValue(2);
        insert_row_into_village.mockResolvedValue(true);

        const id = await createVillageHandler({
            name: "Село",
            name_en: "Village",
            township_name: "Township",
            district_name: "District",
        });

        expect(id).toBe("00010");

        expect(insert_row_into_village).toHaveBeenCalledWith({
            id: "00010",
            name: "Село",
            name_en: "Village",
            township_id: 2,
            district_id: 1,
        });
    });
});
// async function createVillageHandler(village) {
//     if (!village) {
//         throw new ValidationError("Village is reqired for creatingVillage");
//     }
//     const lastId = await get_biggest_village_id();
//     const newId = String(parseInt(lastId, 10) + 1).padStart(5, "0");

//     const { id, name, name_en, township_name, district_name } = village;
//     if (!name || !name_en || !township_name || !district_name) {
//         throw new ValidationError("Missing required field");
//     }

//     const district_id = await select_id_query_from_district(district_name);
//     const township_id = await select_id_query_from_township(township_name);

//     await insert_row_into_village({
//         id: newId,
//         name: name,
//         name_en: name_en,
//         township_id: township_id,
//         district_id: district_id,
//     });

//     return newId;
// }
