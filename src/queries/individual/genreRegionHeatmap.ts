import type { Query } from '../types';

export const genreRegionHeatmapQuery: Query = {
    name: "Game Sales Heatmap by Genre and Region",
    duckdbQuery: `WITH TotalSalesByRegion AS (
  SELECT
      SUM(NA_Sales) AS Total_NA_Sales,
      SUM(EU_Sales) AS Total_EU_Sales,
      SUM(JP_Sales) AS Total_JP_Sales,
      SUM(Other_Sales) AS Total_Other_Sales
  FROM data
),
NormalizedSales AS (
  SELECT
      Genre,
      ROUND(SUM(NA_Sales) * 100.0 / (SELECT Total_NA_Sales FROM TotalSalesByRegion), 2) AS NA_Percentage,
      ROUND(SUM(EU_Sales) * 100.0 / (SELECT Total_EU_Sales FROM TotalSalesByRegion), 2) AS EU_Percentage,
      ROUND(SUM(JP_Sales) * 100.0 / (SELECT Total_JP_Sales FROM TotalSalesByRegion), 2) AS JP_Percentage,
      ROUND(SUM(Other_Sales) * 100.0 / (SELECT Total_Other_Sales FROM TotalSalesByRegion), 2) AS Other_Percentage
  FROM
      data
  GROUP BY
      Genre
)
SELECT * FROM NormalizedSales;`,
    vegaLiteQuery: `{
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "Video Game Genre Dominance Based on Geographical Location",
    "title": {
      "text": "Sales Of Video Game Genres Across Geographical Regions",
      "subtitle": ["Role-Playing games are the most popular genre in Japan, Action games are universally popular,", "and Shooter and Sports games does best outside of Japan"],
      "fontSize": 20,
      "fontWeight": "bold",
      "subtitleFontSize": 14,
      "subtitleColor": "#666666",
      "offset": 20,
      "subtitlePadding": 15
    },
    "width": 250,
    "height": 500,
    "mark": {
      "type": "rect"
    },
    "encoding": {
      "x": {
        "field": "Region",
        "type": "nominal",
        "axis": {
          "title": "Region",
          "labelAngle": -45,
          "labelFontSize": 12,
          "labelPadding": 10
        },
        "spacing": 10
      },
      "y": {
        "field": "Genre",
        "type": "nominal",
        "axis": {
          "title": "Genre",
          "labelFontSize": 12
        }
      },
      "color": {
        "field": "Sales",
        "type": "quantitative",
        "scale": {
          "scheme": "viridis"
        },
        "legend": {
          "title": "Regional Sales (%)",
          "labelFontSize": 12,
          "titleFontSize": 14
        }
      },
      "tooltip": [
        {"field": "Region", "type": "nominal", "title": "Region"},
        {"field": "Genre", "type": "nominal", "title": "Genre"},
        {"field": "Sales", "type": "quantitative", "title": "Sales (%)"}
      ]
    },
    "transform": [
      {
        "fold": ["NA_Percentage", "EU_Percentage", "JP_Percentage", "Other_Percentage"],
        "as": ["Region", "Sales"]
      },
      {
        "filter": "datum.Genre != null"
      }
    ]
}`
}; 