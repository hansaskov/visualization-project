import type { Query } from '../types';

export const topGenresBarQuery: Query = {
    name: "Top 10 genres by global sales",
    duckdbQuery: `SELECT 
        Genre as genre,
        SUM(Global_Sales) as total_sales
    FROM data
    GROUP BY Genre
    ORDER BY total_sales DESC
    LIMIT 10;`,
    vegaLiteQuery: `{
  "width": 800,
  "height": 400,
  "title": {
    "text": "Top 10 Genres by Global Sales",
    "subtitle": ["Action games dominate with over 1.2 billion units sold globally, followed by Sports and Shooter genres"],
    "fontSize": 20,
    "fontWeight": "bold",
    "subtitleFontSize": 14,
    "subtitleColor": "#666666",
    "offset": 20,
    "subtitlePadding": 15
  },
  "mark": {
    "type": "bar",
    "color": "#4682b4"
  },
  "encoding": {
    "x": {
      "field": "genre",
      "type": "nominal",
      "title": "Genre",
      "sort": "-y",
      "axis": {
        "labelAngle": -360
      }
    },
    "y": {
      "field": "total_sales",
      "type": "quantitative",
      "title": "Global Sales (millions)",
      "axis": {
        "grid": true,
        "gridDash": [3, 3]
      }
    },
    "tooltip": [
      {"field": "genre", "type": "nominal", "title": "Genre"},
      {"field": "total_sales", "type": "quantitative", "title": "Global Sales (millions)", "format": ".2f"}
    ]
  },
  "config": {
    "axis": {
      "labelFontSize": 12,
      "titleFontSize": 14,
      "gridColor": "#ddd"
    },
    "view": {
      "stroke": "transparent"
    }
  }
}`
}; 