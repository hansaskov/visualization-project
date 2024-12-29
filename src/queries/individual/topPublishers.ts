import type { Query } from '../types';

export const topPublishersQuery: Query = {
    name: "Top 10 publishers",
    duckdbQuery: `SELECT Publisher, SUM(Global_Sales) AS total_global_sales
FROM data
GROUP BY Publisher
ORDER BY total_global_sales DESC
LIMIT 10`,
    vegaLiteQuery: `{
    "mark": "bar",
    "width": 800,
    "height": 400,
    "title": {
      "text": "All time most successful publishers based on sales",
      "subtitle": "EA and Nintendo are in the lead, each with 800-900 million sales",
      "fontSize": 20,
      "fontWeight": "bold",
      "subtitleFontSize": 14,
      "subtitleColor": "#666666",
      "offset": 10,
      "subtitlePadding": 15
    },
    "transform": [{"calculate": "split(datum.Publisher, ' ')", "as": "Publisher"}],
    "encoding": {
        "x": {"field": "Publisher", "type": "nominal", "sort": "-y", "title": "Genre", "axis" : {"labelAngle": -360}},
        "y": {"field": "total_global_sales", "type": "quantitative", "title": "Total Global Sales (millions)"}
    }
}`
}; 