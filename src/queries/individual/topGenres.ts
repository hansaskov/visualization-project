import type { Query } from '../types';

export const topGenresDonutQuery: Query = {
    name: "Top 5 Genres by Global Sales",
    duckdbQuery: `SELECT 
        Genre as genre,
        SUM(Global_Sales) as total_sales,
        (SUM(Global_Sales) / (SELECT SUM(Global_Sales) FROM data)) as market_share
    FROM data
    GROUP BY Genre
    ORDER BY total_sales DESC
    LIMIT 5;`,
    vegaLiteQuery: `{
  "width": 500,
  "height": 400,
  "title": {
    "text": "Top 5 Genres by Global Sales",
    "subtitle": ["Together, the top five best-selling genres—headlined by Action games at nearly 30%—capture well over three-quarters of the global sales pie"],
    "fontSize": 20,
    "fontWeight": "bold",
    "subtitleFontSize": 14,
    "subtitleColor": "#666666",
    "offset": 10,
    "subtitlePadding": 15
  },
  "mark": {
    "type": "arc",
    "innerRadius": 100,
    "outerRadius": 200,
    "stroke": "#fff",
    "strokeWidth": 2
  },
  "encoding": {
    "theta": {"field": "total_sales", "type": "quantitative"},
    "color": {
      "field": "genre",
      "type": "nominal",
      "title": "Genre",
      "scale": {
        "domain": ["Action", "Sports", "Shooter", "Role-Playing", "Racing"],
        "range": [
          "#3182bd",  
          "#31a354",  
          "#e6550d",  
          "#de2d26",  
          "#756bb1"   
        ]
      }
    },
    "tooltip": [
      {"field": "genre", "type": "nominal", "title": "Genre"},
      {"field": "total_sales", "type": "quantitative", "title": "Total Sales (millions)", "format": ".2f"},
      {"field": "market_share", "type": "quantitative", "title": "Market Share", "format": ".1%"}
    ]
  }
}`
}; 