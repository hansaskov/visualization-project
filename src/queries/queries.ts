

export type QuerySelection = {
    name: string;
    duckdbQuery: string;
    vegaLiteQuery: string;
}


export const queries: QuerySelection[] = [
    {
        name: "Select All",
        duckdbQuery: 
`SELECT *
FROM data
LIMIT 50`,
    vegaLiteQuery: ""
    },
    {
        name: "Sales by Genre",
        duckdbQuery: 
`SELECT genre, SUM("Global_Sales") AS total_sales
FROM data
GROUP BY genre
ORDER BY total_sales DESC
LIMIT 50`,
        vegaLiteQuery: 
`{
    "mark": "bar",
    "encoding": {
        "x": {"field": "Genre", "type": "nominal", "sort": "-y", "title":"Genre"},
        "y": {"field": "total_sales", "type": "quantitative", "title":"Total Sales"}
    }
}`,
    },
    { 
        name: "Top 10 publishers",
        duckdbQuery: 
`SELECT Publisher, SUM(Global_Sales) AS total_global_sales
FROM data
GROUP BY Publisher
ORDER BY total_global_sales DESC
LIMIT 10`,
vegaLiteQuery: 
`{
    "mark": "bar",
    "encoding": {
        "y": {"field": "Publisher", "type": "nominal", "sort": "-x", "title": "Publisher"},
        "x": {"field": "total_global_sales", "type": "quantitative", "title": "Total Global Sales (millions)"}
    },
    "title": "Top 10 Publishers by Global Sales"
}
`
    },
    { 
        name: "Critic Score by Platform",
        duckdbQuery: 
`SELECT Platform, AVG(Critic_Score) AS avg_critic_score, CAST(COUNT(*) AS INT) AS game_count
FROM data
WHERE Critic_Score IS NOT NULL
GROUP BY Platform
HAVING COUNT(*) > 10
ORDER BY avg_critic_score DESC
LIMIT 15
`,
vegaLiteQuery: 
`{
  "mark": "circle",
  "encoding": {
    "x": {
      "field": "Platform",
      "type": "nominal",
      "axis": {"labelAngle": -45}
    },
    "y": {
      "field": "avg_critic_score",
      "type": "quantitative",
      "title": "Average Critic Score",
      "scale": {"zero": false}
    },
    "size": {
      "field": "game_count",
      "type": "quantitative",
      "title": "Number of Games",
      "scale": {"range": [20, 1000]}
    }
  }
}
`
    },
];
