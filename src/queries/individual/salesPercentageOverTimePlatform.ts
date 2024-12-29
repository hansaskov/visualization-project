import type { Query } from '../types';

export const salesPercentageOverTimePlatformQuery: Query = {
    name: "Sales percentage over time grouped by platform",
    duckdbQuery: `WITH yearly_sales AS (
    SELECT 
        Year_of_Release,
        Platform,
        SUM(Global_Sales) as total_sales
    FROM data
    WHERE Year_of_Release IS NOT NULL 
        AND Global_Sales IS NOT NULL 
        AND Platform IS NOT NULL
    GROUP BY Year_of_Release, Platform
),
yearly_totals AS (
    SELECT 
        Year_of_Release,
        SUM(total_sales) as year_total
    FROM yearly_sales
    GROUP BY Year_of_Release
)
SELECT 
    ys.Year_of_Release as year,
    ys.Platform as platform,
    CAST((ys.total_sales / yt.year_total) AS DOUBLE) as percentage
FROM yearly_sales ys
JOIN yearly_totals yt ON ys.Year_of_Release = yt.Year_of_Release
ORDER BY ys.Year_of_Release, ys.Platform;`,
    vegaLiteQuery: `{
  "width": 800,
  "height": 600,
  "title": {
    "text": "Evolution of Gaming Platforms Market Share (1985-Present)",
    "subtitle": ["Select Platforms on the side to focus specific lines. Shift + Click to select multiple"],
    "fontSize": 20,
    "fontWeight": "bold",
    "subtitleFontSize": 14,
    "subtitleColor": "#666666",
    "offset": 20,
    "subtitlePadding": 15
  },
  "mark": {"type": "area", "line": true},
  "encoding": {
    "x": {
      "field": "year",
      "type": "ordinal",
      "title": "Year",
      "axis": {
        "labelAngle": 0,
        "labelPadding": 10,
        "domain": false,
        "tickSize": 0
      }
    },
    "y": {
      "field": "percentage",
      "type": "quantitative",
      "title": "Market Share (%)",
      "stack": "normalize",
      "axis": {"format": ".0%"}
    },
    "color": {
      "field": "platform",
      "type": "nominal",
      "title": "Platform",
      "scale": {
        "domain": [
          "PS",
          "PS2",
          "PS3",
          "PS4",
          "PSP",
          "PSV",
          "XB",
          "X360",
          "XOne",
          "Wii",
          "WiiU",
          "GC",
          "DS",
          "3DS",
          "GBA",
          "DC",
          "PC"
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
          "#E53935",
          "#FF5252",
          "#FF7043",
          "#FFB300",
          "#FFD740",
          "#8D6E63",
          "#6D4C41",
          "#78909C"
        ]
      }
    },
    "opacity": {
      "condition": {"param": "platform_selection", "value": 1},
      "value": 0.2
    },
    "tooltip": [
      {"field": "year", "type": "ordinal", "title": "Year"},
      {"field": "platform", "type": "nominal", "title": "Platform"},
      {"field": "percentage", "type": "quantitative", "title": "Market Share", "format": ".1%"}
    ]
  },
  "params": [
    {
      "name": "platform_selection",
      "select": {"type": "point", "fields": ["platform"]},
      "bind": "legend"
    }
  ]
}`
}; 