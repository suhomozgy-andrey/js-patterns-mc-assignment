export const isNumber = (value) => /^-?\d+(\.\d+)?$/.test(value);

// data parsing
export const parseDataCell = (cell) => (cell && isNumber(cell) ? parseFloat(cell) : cell);

export const parseData = (data) => {
    const [labels, ...lines] = data.trim().split("\n");
    return {
        labels: labels.split(",").map((cell) => cell.trim()),
        data: lines.map((line) => line.split(",").map(cell => parseDataCell(cell))),
    };
};

// data processing
export const processData = (data, sortBy = "density") => {
    if (!data || typeof data !== "string") return;
    const { labels, data: lines } = parseData(data);
    const sortIndex = labels.indexOf(sortBy);
    if (sortIndex === -1) return { labels, data: lines };

    return {
        labels,
        data: [...lines].sort((a, b) => b[sortIndex] - a[sortIndex]),
    };
};

// data rendering
export const getColumnWidths = (labels, data) => labels.map((_, i) =>
    Math.max(labels[i].length, ...data.map((row) => row[i].toString().length))
);

export const prepareRenderRow = (row, colWidths) =>
    row
        .map((cell, i) => {
            const str = cell.toString();
            return i === 0 ? str.padEnd(colWidths[i]) : str.padStart(colWidths[i]);
        })
        .join("  ");