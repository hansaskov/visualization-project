export type QuerySelection = {
	name: string;
	duckdbQuery: string;
	vegaLiteQuery: string;
};

export const queries: QuerySelection[] = [
	{
		name: "Select All",
		duckdbQuery: `SELECT *
FROM data
LIMIT 50`,
		vegaLiteQuery: "",
	},
	{
		name: "Top 10 publishers",
		duckdbQuery: `SELECT genre, SUM("Global_Sales") AS total_sales
FROM data
GROUP BY genre
ORDER BY total_sales DESC
LIMIT 10`,
		vegaLiteQuery: `{
    "mark": "bar",
    "encoding": {
        "x": {"field": "Genre", "type": "nominal", "sort": "-y", "title":"Genre"},
        "y": {"field": "total_sales", "type": "quantitative", "title":"Total Sales"}
    }
}`,
	},
	{
		name: "Top 10 publishers",
		duckdbQuery: `SELECT Publisher, SUM(Global_Sales) AS total_global_sales
FROM data
GROUP BY Publisher
ORDER BY total_global_sales DESC
LIMIT 10`,
		vegaLiteQuery: `{
    "mark": "bar",
    "encoding": {
        "y": {"field": "Publisher", "type": "nominal", "sort": "-x", "title": "Publisher"},
        "x": {"field": "total_global_sales", "type": "quantitative", "title": "Total Global Sales (millions)"}
    },
    "title": "Top 10 Publishers by Global Sales"
}
`,
	},
	{
		name: "Critic Score by Platform",
		duckdbQuery: `SELECT Platform, AVG(Critic_Score) AS avg_critic_score, CAST(COUNT(*) AS INT) AS game_count
FROM data
WHERE Critic_Score IS NOT NULL
GROUP BY Platform
HAVING COUNT(*) > 10
ORDER BY avg_critic_score DESC
LIMIT 15
`,
		vegaLiteQuery: `{
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
`,
	},
	{
		name: "llm bubble chart",
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
    AND Global_Sales IS NOT NULL 
    AND Global_Sales > 0
    AND Genre IS NOT NULL
ORDER BY 
    release_year ASC;`,
		vegaLiteQuery: `{
  "width": 800,
  "height": 600,
  "mark": "circle",
  "encoding": {
    "x": {
      "field": "release_year",
      "type": "quantitative",
      "title": "Year of Release",
      "scale": {
        "domainMin": 1980,
        "type": "linear"
      },
      "axis": {
        "format": "d"
      }
    },
    "y": {
      "aggregate": "sum",
      "field": "global_sales",
      "type": "quantitative",
      "title": "Total Global Sales (Millions)",
      "scale": {
        "type": "pow",
        "exponent": 0.5,
        "nice": true
      }
    },
    "size": {
      "aggregate": "sum",
      "field": "global_sales",
      "type": "quantitative",
      "legend": {"title": "Sales Volume"}
    },
    "color": {
      "field": "genre",
      "type": "nominal",
      "title": "Genre"
    },
    "tooltip": [
      {"field": "genre", "type": "nominal", "title": "Genre"},
      {"aggregate": "sum", "field": "global_sales", "type": "quantitative", "title": "Total Global Sales (Millions)"},
      {"field": "release_year", "type": "quantitative", "title": "Year of Release"}
    ]
  },
  "transform": [
    {
      "filter": "datum.global_sales > 0"
    }
  ]
}`,
	},
	{
		name: "Show null percentage per column",
		duckdbQuery: "summarize data",
		vegaLiteQuery: `{
    "mark": "bar",
    "encoding": {
        "x": {
        "field": "column_name",
        "type": "nominal",
        "sort": "-y",
        "title": "Column Name"
        },
        "y": {
        "field": "null_percentage",
        "type": "quantitative",
        "title": "Null Percentage",
        "axis": {
            "format": ".1f"
        }
        }
    },
    "transform": [
        {
        "calculate": "parseFloat(replace(datum.null_percentage, '%', ''))",
        "as": "null_percentage"
        }
    ]
    }
        `,
	},
  {
		name: "Unique values in columns",
		duckdbQuery: 
`SELECT 'Genre' as column_name, COUNT(DISTINCT Genre) as unique_count
FROM data
UNION ALL
SELECT 'Platform', COUNT(DISTINCT Platform)
FROM data
UNION ALL
SELECT 'Publisher', COUNT(DISTINCT Publisher)
FROM data
UNION ALL
SELECT 'Developer', COUNT(DISTINCT Developer)
FROM data
UNION ALL
SELECT 'Rating', COUNT(DISTINCT Rating)
FROM data
ORDER BY column_name;`,
		vegaLiteQuery: ``,
	},
];
