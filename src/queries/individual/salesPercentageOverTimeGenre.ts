import type { Query } from '../types';

export const salesPercentageOverTimeGenreQuery: Query = {
    name: "Sales percentage over time grouped by genre",
    duckdbQuery: `SELECT 
    Year_of_Release as release_year,
    Genre as genre,
    (SUM(Global_Sales) / SUM(SUM(Global_Sales)) OVER (PARTITION BY Year_of_Release) * 100) as market_share_percentage
FROM data
WHERE Year_of_Release >= 1996
GROUP BY Year_of_Release, Genre
ORDER BY release_year ASC;`,
    vegaLiteQuery: `{
  "width": 800,
  "height": 600,
  "title": {
    "text": "Evolution of Video Game Genres Market Share (1996-Present)",
    "subtitle": ["Select Genres on the side to focus specific lines. Shift + Click to select multiple"],
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
      "field": "release_year",
      "type": "quantitative",
      "title": "Year of Release",
      "scale": {"domainMin": 1996},
      "axis": {"format": "d", "domain": false, "tickSize": 0}
    },
    "y": {
      "field": "market_share_percentage",
      "type": "quantitative",
      "title": "Market Share (%)",
      "stack": "normalize",
      "axis": {"format": ".0%"}
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
          "#E53935",
          "#FF5252",
          "#FF7043"
        ]
      }
    },
    "opacity": {
      "condition": {"param": "genre_selection", "value": 1},
      "value": 0.2
    },
    "tooltip": [
      {"field": "genre", "type": "nominal", "title": "Genre"},
      {"field": "market_share_percentage", "type": "quantitative", "format": ".1f", "title": "Market Share (%)"},
      {"field": "release_year", "type": "quantitative", "title": "Year"}
    ]
  },
  "params": [
    {
      "name": "genre_selection",
      "select": {"type": "point", "fields": ["genre"]},
      "bind": "legend"
    }
  ]
}`
}; 