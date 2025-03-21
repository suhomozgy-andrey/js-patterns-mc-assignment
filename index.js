
import { data } from "./data.js";

const isNumber = (value) => new RegExp(/^\d*\.?\d*$/).test(value);

// data parsing
const parseDataCell = (cell) => (isNumber(cell) ? parseFloat(cell) : cell);
const parseData = (data) => {
    const [labels, ...lines] = data.split("\n");
    return {
        labels: labels.split(","),
        data: lines.map((l) => l.split(",").map(parseDataCell)),
    };
};

// data processing
export const processData = (data) => {
    if (!data || typeof data !== "string") return;
    const { labels, data: lines } = parseData(data);

    return {
        labels,
        data: [...lines].sort((r1, r2) => r2[3] - r1[3]),
    };
};

// data rendering
const prepareRenderRow = (row) => {
    let s = row[0].padEnd(18);
    s += row[1].toString().padStart(10);
    s += row[2].toString().padStart(8);
    s += row[3].toString().padStart(8);
    s += row[4].padStart(18);

    return s;
};

const renderData = (processedData, options) => {
    if (!processedData) {
        console.log("No data to show");
        return;
    }

    const { showLabels } = options ?? {};

    const { labels, data } = processedData;

    if (!!showLabels) console.log(prepareRenderRow(labels));
    for (const row of data) {
        console.log(prepareRenderRow(row));
    }
};

renderData(processData(data), { showLabels: true });