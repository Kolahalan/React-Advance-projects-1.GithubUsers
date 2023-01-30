// STEP 1 - Include Dependencies
// Include react
import React from "react";

// Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";

// Include the fusioncharts library
import FusionCharts from "fusioncharts";

// Include the chart type
import Chart from "fusioncharts/fusioncharts.charts";

import FusionTheme from "fusioncharts/themes/fusioncharts.theme.candy"; //theme.candy should match with the name theme:"theme name"  in chart config

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, FusionTheme, Chart);

// STEP 3 - Creating the JSON object to store the chart configurations

const ChartComponent = ({ data }) => {
  const chartConfigs = {
    type: "doughnut2d", // The chart type
    width: "100%", // Width of the chart
    height: "400", // Height of the chart
    dataFormat: "json", // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        //Set the chart caption
        caption: "Stars per language",

        decimals: 0, //This to stop displaying decimals in a chart. By default, this wont be there and the chart will show decimals
        doughnutRadius: "35%", //Increases the overall radius of piechart
        showPercentValues: 0, //Restricts the % symbol added to data by default as in piechart
        //paletteColors: "#f0db4f", //You can specify your own colours in this field
        theme: "candy", //This data should match with the theme.themename extention in FusionTheme in line 14
      },
      // Chart Data
      data: data,
    },
  };
  return <ReactFC {...chartConfigs} />;
};

export default ChartComponent;
