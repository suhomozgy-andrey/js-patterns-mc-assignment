
import { expect, describe, it, beforeEach, vi } from "vitest";
import { processData, isNumber, parseDataCell, parseData, prepareRenderRow, getColumnWidths } from "./utils";
import { renderData } from './index'
import { oneRowData, twoRowData } from "./data";

const rawCSV = `city,population,area,density,country
CityA,1000,100,10,CountryX
CityB,2000,200,20,CountryY
CityC,1500,150,15,CountryZ`;

describe("isNumber", () => {
    it("correctly identifies numbers", () => {
        expect(isNumber("123")).toBe(true);
        expect(isNumber("123.45")).toBe(true);
        expect(isNumber("-67.8")).toBe(true);
        expect(isNumber("abc")).toBe(false);
        expect(isNumber("")).toBe(false);
        expect(isNumber(".")).toBe(false);
    });
});

describe("parseDataCell", () => {
    it("converts numbers and leaves strings", () => {
        expect(parseDataCell("42")).toBe(42);
        expect(parseDataCell("3.14")).toBeCloseTo(3.14);
        expect(parseDataCell("Hello")).toBe("Hello");
    });
});

describe("parseData", () => {
    it("parses CSV correctly", () => {
        const result = parseData(rawCSV);
        expect(result.labels).toEqual(["city", "population", "area", "density", "country"]);
        expect(result.data.length).toBe(3);
        expect(result.data[0]).toEqual(["CityA", 1000, 100, 10, "CountryX"]);
    });
});

describe("prepareRenderRow", () => {
    it("formats a row with padding", () => {
        const row = ["CityX", 1234, 100, 12.5, "CountryY"];
        const columnsWidth = getColumnWidths(["city", "population", "area", "density", "country"], [row])
        const formatted = prepareRenderRow(row, columnsWidth);
        expect(formatted).toContain("CityX");
        expect(formatted).toContain("1234");
        expect(formatted).toContain("100");
        expect(formatted).toContain("12.5");
        expect(formatted).toContain("CountryY");
    });
});

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

    it("should return a table with 2 rows in it", () => {
        expect(processData(twoRowData).data).toEqual([
            ["Delhi", 16787941, 1484, 200, "India"],
            ["Shanghai", 24256800, 6340, 100, "China"],
        ]);
    });

    it("should return a non-sorted data if sortBy is not defined", () => {
        expect(processData(twoRowData, 'unknownKey').data).toEqual([
            ["Shanghai", 24256800, 6340, 100, "China"],
            ["Delhi", 16787941, 1484, 200, "India"],
        ]);
    });
});

describe("renderData", () => {
    let consoleSpy;

    beforeEach(async () => {
        consoleSpy = vi.spyOn(console, "log").mockImplementation(() => { });
    });

    it("shows message on empty data", () => {
        renderData(undefined);

        expect(consoleSpy).toHaveBeenCalledWith("No data to show");
        expect(consoleSpy).toHaveBeenCalledOnce();
    });

    it("renders sorted data with headers", () => {
        const processed = processData(rawCSV, "density");
        renderData(processed, { showLabels: true });
        const columnsWidth = getColumnWidths(processed.labels, processed.data);

        expect(consoleSpy).toHaveBeenCalledWith(prepareRenderRow(processed.labels, columnsWidth));
        expect(consoleSpy).toHaveBeenCalledWith(prepareRenderRow(processed.data[0], columnsWidth));
        expect(consoleSpy).toHaveBeenCalledWith(prepareRenderRow(processed.data[1], columnsWidth));
        expect(consoleSpy).toHaveBeenCalledTimes(4);
    });

    it("renders data without headers", () => {
        const processed = processData(rawCSV, "density");
        renderData(processed, { showLabels: false });
        const columnsWidth = getColumnWidths(processed.labels, processed.data);

        expect(consoleSpy).not.toHaveBeenCalledWith(prepareRenderRow(processed.labels, columnsWidth));
        expect(consoleSpy).toHaveBeenCalledTimes(3);
    });


});