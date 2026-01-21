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

        const fake_village_data = {
            name: "Село",
            name_en: "Village",
            township_id: "VAR02",
            district_id: "VAR",
        };
        const id = await createVillageHandler(fake_village_data);

        expect(id).toBe("00010");

        expect(insert_row_into_village).toHaveBeenCalledWith({
            id: "00010",
            ...fake_village_data
        });
    });
});
