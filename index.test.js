
import { expect, describe, it } from "vitest";
import { processData } from "./index";
import { oneRowData, twoRowData } from "./data";

describe("processData", () => {
    it("should return undefined when no data given", () => {
        expect(processData()).toBeUndefined();
    });

    it("should return undefined when data is falsy", () => {
        expect(processData("")).toBeUndefined();
        expect(processData(undefined)).toBeUndefined();
        expect(processData(null)).toBeUndefined();
        expect(processData([])).toBeUndefined();
    });

    it("should return undefined when data is not required type", () => {
        expect(processData([])).toBeUndefined();
        expect(processData({})).toBeUndefined();
        expect(processData(() => { })).toBeUndefined();
    });

    it("should return a table with 1 row in it", () => {
        expect(processData(oneRowData).data).toEqual([
            ["Shanghai", 24256800, 6340, 3826, "China"],
        ]);
    });

    it("should return a table with 1 row in it", () => {
        expect(processData(twoRowData).data).toEqual([
            ["Delhi", 16787941, 1484, 200, "India"],
            ["Shanghai", 24256800, 6340, 100, "China"],
        ]);
    });
});