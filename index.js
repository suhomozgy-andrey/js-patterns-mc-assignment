
import { data } from "./data.js";
import { processData, prepareRenderRow, getColumnWidths } from './utils.js'

export const renderData = (processedData, options = {}) => {
    if (!processedData?.data?.length) {
        console.log("No data to show");
        return;
    }

    const { showLabels } = options;
    const { labels, data } = processedData;

    const colWidths = getColumnWidths(labels, data);

    if (showLabels) console.log(prepareRenderRow(labels, colWidths));
    data.forEach((row) => console.log(prepareRenderRow(row, colWidths)));
};

const main = () => {
    const result = processData(data, "density");
    renderData(result, { showLabels: true });
};

main();