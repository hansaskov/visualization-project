import type { Query } from '../types';

export const salesOverTimeQuery: Query = {
    name: "Sales over time grouped by genre (AI)",
    duckdbQuery: `SELECT 
    Name AS game_title,
    Year_of_Release AS release_year,
    Platform AS platform,
    Genre AS genre,
    CAST(Global_Sales AS DOUBLE) AS global_sales
FROM 
    data
WHERE 
    Year_of_Release IS NOT NULL 
    AND Year_of_Release >= 1990
    AND Year_of_Release <= 2016
    AND Global_Sales IS NOT NULL 
    AND Global_Sales > 0
    AND Genre IS NOT NULL
ORDER BY 
    release_year ASC;`,
    vegaLiteQuery: `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 800,
  "height": 600,
  "title": {
    "text": "Sales Over Time by Genre",
    "subtitle": "Global sales trends across different game genres",
    "fontSize": 20,
    "fontWeight": "bold",
    "subtitleFontSize": 14,
    "subtitleColor": "#666666",
    "offset": 10,
    "subtitlePadding": 15
  },
  "layer": [
    {
      "mark": {
        "type": "circle",
        "opacity": 1
      },
      "encoding": {
        "x": {
          "field": "release_year",
          "type": "quantitative",
          "title": "Year of Release",
          "scale": {
            "domain": [1990, 2016],
            "type": "linear"
          },
          "axis": {
            "format": "d",
            "grid": true
          }
        },
        "y": {
          "aggregate": "sum",
          "field": "global_sales",
          "type": "quantitative",
          "title": "Total Global Sales (Millions)",
          "axis": {
            "grid": true,
            "tickCount": 10
          }
        },
        "size": {
          "aggregate": "sum",
          "field": "global_sales",
          "type": "quantitative",
          "legend": {
            "title": "Sales Volume",
            "values": [0, 20, 40, 60, 80, 100, 120]
          }
        },
        "color": {
          "field": "genre",
          "type": "nominal",
          "title": "Genre",
          "scale": {
            "domain": [
              "Action",
              "Adventure",
              "Fighting",
              "Misc",
              "Platform",
              "Puzzle",
              "Racing",
              "Role-Playing",
              "Shooter",
              "Simulation",
              "Sports",
              "Strategy"
            ],
            "range": [
              "#2E5A9C",
              "#3670BD",
              "#4086DE",
              "#50A0FF",
              "#7AB8FF",
              "#A5D1FF",
              "#1B5E20",
              "#2E7D32",
              "#43A047",
              "#404040",
              "#4682b4",
              "#5c92c4"
            ]
          },
          "legend": {
            "orient": "right",
            "direction": "vertical"
          }
        },
        "tooltip": [
          {"field": "genre", "type": "nominal", "title": "Genre"},
          {"aggregate": "sum", "field": "global_sales", "type": "quantitative", "title": "Total Global Sales (Millions)"},
          {"field": "release_year", "type": "quantitative", "title": "Year of Release"}
        ]
      }
    }
  ],
  "config": {
    "view": {"stroke": null},
    "axis": {
      "gridColor": "#ddd",
      "gridWidth": 1,
      "gridDash": [3, 3],
      "labelFontSize": 11,
      "titleFontSize": 12,
      "titlePadding": 10
    }
  }
}`
}; 