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
		name: "Top 10 platforms by Critic Score",
		duckdbQuery: `SELECT Platform, AVG(Critic_Score) AS avg_critic_score, CAST(COUNT(*) AS INT) AS game_count
FROM data
WHERE Critic_Score IS NOT NULL
GROUP BY Platform
HAVING COUNT(*) > 10
ORDER BY avg_critic_score DESC
LIMIT 10
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
		name: "Sales over time grouped by genre",
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
        "domainMin": 1990,
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
    "width": 400,
    "title": "Percentage of null values in dataset by variable",
    "mark": "bar",
    "encoding": {
        "y": {
        "field": "column_name",
        "type": "nominal",
        "sort": "-x",
        "title": "Column Name"
        },
        "x": {
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
		duckdbQuery: `SELECT 'Genre' as column_name, COUNT(DISTINCT Genre) as unique_count
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
	/*
  {
		name: "boksplot 3 in 1 normalized horizontal",
		duckdbQuery: `SELECT 
    ("Global_Sales" - MIN("Global_Sales") OVER ()) / (MAX("Global_Sales") OVER () - MIN("Global_Sales") OVER ()) AS Global_Sales,
    ("Critic_Score" - MIN("Critic_Score") OVER ()) / (MAX("Critic_Score") OVER () - MIN("Critic_Score") OVER ()) AS Critic_Score,
    (CAST("User_Score" AS DOUBLE) - MIN(CAST("User_Score" AS DOUBLE)) OVER ()) / (MAX(CAST("User_Score" AS DOUBLE)) OVER () - MIN(CAST("User_Score" AS DOUBLE)) OVER ()) AS User_Score
FROM data
WHERE 
    "Global_Sales" IS NOT NULL
    AND "Critic_Score" IS NOT NULL
    AND TRY_CAST("User_Score" AS DOUBLE) IS NOT NULL`,
		vegaLiteQuery: `{
  "width": 800,
  "height": 300,
  "mark": {
    "type": "boxplot",
    "extent": "min-max"
  },
  "encoding": {
    "y": {
      "field": "category",
      "type": "nominal",
      "title": "Metrics",
      "sort": ["Global_Sales", "Critic_Score", "User_Score"]
    },
    "x": {
      "field": "value",
      "type": "quantitative",
      "title": "Normalized Values (0 - 1)",
      "scale": {
        "domain": [0, 1], 
        "nice": true
      },
      "axis": {
        "tickCount": 5
      }
    },
    "color": {
      "field": "category",
      "type": "nominal",
      "title": "Metric Type"
    }
  },
  "transform": [
    {
      "fold": ["Global_Sales", "Critic_Score", "User_Score"],
      "as": ["category", "value"]
    },
    {
      "filter": "datum.value != null && isFinite(datum.value)"
    }
  ],
  "title": "Horizontal Boxplots of Normalized Global Sales, Critic Score, and User Score (Min-Max Extent)"
}`,
	},
  */
	{
		name: "boksplot global sales vertical",
		duckdbQuery: `SELECT
    'Global Sales' AS category,
    MIN("Global_Sales") AS min_value,
    APPROX_QUANTILE("Global_Sales", 0.25) AS q1_value,
    MEDIAN("Global_Sales") AS median_value,
    APPROX_QUANTILE("Global_Sales", 0.75) AS q3_value,
    MAX("Global_Sales") AS max_value
FROM data
WHERE "Global_Sales" IS NOT NULL;`,
		vegaLiteQuery: `{
  "title": "Boxplot of Global Sales (Log Scale)",
  "width": 300,
  "height": 400,
  "layer": [
    {
      "mark": {"type": "rule", "size": 2},
      "encoding": {
        "y": {
          "field": "min_value",
          "type": "quantitative",
          "scale": {
            "type": "log",
            "base": 10,
            "zero": false,
            "nice": true,
            "padding": 10,
            "domainMin": 0.1
          },
          "title": "Global Sales (in millions)"
        },
        "y2": {"field": "max_value"},
        "x": {
          "field": "category",
          "type": "nominal",
          "title": "Metric",
          "axis": {
            "labelAngle": 0,
            "labelFontSize": 12,
            "titleFontSize": 14
          }
        },
        "tooltip": [
          {"field": "min_value", "type": "quantitative", "title": "Minimum"},
          {"field": "max_value", "type": "quantitative", "title": "Maximum"}
        ]
      }
    },
    {
      "mark": {"type": "bar", "size": 40},
      "encoding": {
        "y": {"field": "q1_value", "type": "quantitative"},
        "y2": {"field": "q3_value"},
        "x": {
          "field": "category",
          "type": "nominal",
          "title": "Metric"
        },
        "color": {"value": "#4682b4"},
        "tooltip": [
          {"field": "q1_value", "type": "quantitative", "title": "Q1"},
          {"field": "q3_value", "type": "quantitative", "title": "Q3"}
        ]
      }
    },
    {
      "mark": {
        "type": "tick",
        "color": "white",
        "size": 40
      },
      "encoding": {
        "y": {
          "field": "median_value",
          "type": "quantitative"
        },
        "x": {
          "field": "category",
          "type": "nominal"
        },
        "tooltip": [
          {"field": "median_value", "type": "quantitative", "title": "Median"}
        ]
      }
    },
    {
      "mark": {
        "type": "text",
        "align": "left",
        "dx": 5,
        "dy": -5,
        "color": "#000"
      },
      "encoding": {
        "y": {
          "field": "min_value",
          "type": "quantitative"
        },
        "x": {
          "field": "category",
          "type": "nominal"
        },
        "text": {"field": "min_value", "type": "quantitative"},
        "tooltip": [{"field": "min_value", "type": "quantitative", "title": "Minimum"}]
      }
    },
    {
      "mark": {
        "type": "text",
        "align": "left",
        "dx": 5,
        "dy": -5,
        "color": "#000"
      },
      "encoding": {
        "y": {
          "field": "max_value",
          "type": "quantitative"
        },
        "x": {
          "field": "category",
          "type": "nominal"
        },
        "text": {"field": "max_value", "type": "quantitative"},
        "tooltip": [{"field": "max_value", "type": "quantitative", "title": "Maximum"}]
      }
    },
    {
      "mark": {
        "type": "text",
        "align": "left",
        "dx": 20,
        "dy": 5,
        "color": "#000"
      },
      "encoding": {
        "y": {
          "field": "q1_value",
          "type": "quantitative"
        },
        "x": {
          "field": "category",
          "type": "nominal"
        },
        "text": {"field": "q1_value", "type": "quantitative"},
        "tooltip": [{"field": "q1_value", "type": "quantitative", "title": "Q1"}]
      }
    },
    {
      "mark": {
        "type": "text",
        "align": "left",
        "dx": 20,
        "dy": -5,
        "color": "#000"
      },
      "encoding": {
        "y": {
          "field": "q3_value",
          "type": "quantitative"
        },
        "x": {
          "field": "category",
          "type": "nominal"
        },
        "text": {"field": "q3_value", "type": "quantitative"},
        "tooltip": [{"field": "q3_value", "type": "quantitative", "title": "Q3"}]
      }
    }
  ],
  "config": {
    "axis": {
      "grid": true,
      "tickCount": 4,
      "gridDash": [5, 5],
      "gridOpacity": 1
    }
  }
}`,
	},
	{
		name: "Boksplot criticscore and userscore",
		duckdbQuery: `SELECT 
    'User Score (Normalized)' AS category,
    MIN(CAST("User_Score" AS DOUBLE) * 10) AS min_value,
    APPROX_QUANTILE(CAST("User_Score" AS DOUBLE) * 10, 0.25) AS q1_value,
    MEDIAN(CAST("User_Score" AS DOUBLE) * 10) AS median_value,
    APPROX_QUANTILE(CAST("User_Score" AS DOUBLE) * 10, 0.75) AS q3_value,
    MAX(CAST("User_Score" AS DOUBLE) * 10) AS max_value
FROM data
WHERE "User_Score" IS NOT NULL
  AND TRY_CAST("User_Score" AS DOUBLE) IS NOT NULL

UNION ALL

SELECT 
    'Critic Score' AS category,
    MIN(CAST("Critic_Score" AS DOUBLE)) AS min_value,
    APPROX_QUANTILE(CAST("Critic_Score" AS DOUBLE), 0.25) AS q1_value,
    MEDIAN(CAST("Critic_Score" AS DOUBLE)) AS median_value,
    APPROX_QUANTILE(CAST("Critic_Score" AS DOUBLE), 0.75) AS q3_value,
    MAX(CAST("Critic_Score" AS DOUBLE)) AS max_value
FROM data
WHERE "Critic_Score" IS NOT NULL
  AND TRY_CAST("Critic_Score" AS DOUBLE) IS NOT NULL;`,
		vegaLiteQuery: `{
  "title": "Boxplot of User and Critic Scores (Exponential Scale)",
  "width": 400,
  "height": 500,
  "layer": [
    {
      "mark": {"type": "rule", "size": 2},
      "encoding": {
        "y": {
          "field": "min_value",
          "type": "quantitative",
          "scale": {
            "type": "pow",
            "exponent": 2,
            "zero": false,
            "nice": true,
            "padding": 10,
            "domainMin": 0.1
          },
          "title": "Scores"
        },
        "y2": {"field": "max_value"},
        "x": {
          "field": "category",
          "type": "nominal",
          "title": "Metric",
          "axis": {
            "labelAngle": 0,
            "labelFontSize": 12,
            "titleFontSize": 14
          }
        },
        "tooltip": [
          {"field": "min_value", "type": "quantitative", "title": "Minimum"},
          {"field": "max_value", "type": "quantitative", "title": "Maximum"}
        ]
      }
    },
    {
      "mark": {"type": "bar", "size": 40},
      "encoding": {
        "y": {"field": "q1_value", "type": "quantitative"},
        "y2": {"field": "q3_value"},
        "x": {
          "field": "category",
          "type": "nominal"
        },
        "color": {"value": "#4682b4"},
        "tooltip": [
          {"field": "q1_value", "type": "quantitative", "title": "Q1"},
          {"field": "q3_value", "type": "quantitative", "title": "Q3"}
        ]
      }
    },
    {
      "mark": {
        "type": "tick",
        "color": "white",
        "size": 40
      },
      "encoding": {
        "y": {
          "field": "median_value",
          "type": "quantitative",
          "title": null
        },
        "x": {
          "field": "category",
          "type": "nominal"
        },
        "tooltip": [
          {"field": "median_value", "type": "quantitative", "title": "Median"}
        ]
      }
    },
    {
      "mark": {
        "type": "text",
        "align": "left",
        "dx": 10,
        "dy": 10,
        "color": "#000"
      },
      "encoding": {
        "y": {
          "field": "min_value",
          "type": "quantitative"
        },
        "x": {
          "field": "category",
          "type": "nominal"
        },
        "text": {"field": "min_value", "type": "quantitative"},
        "tooltip": [{"field": "min_value", "type": "quantitative", "title": "Minimum"}]
      }
    },
    {
      "mark": {
        "type": "text",
        "align": "right",
        "dx": -10,
        "dy": -10,
        "color": "#000"
      },
      "encoding": {
        "y": {
          "field": "max_value",
          "type": "quantitative"
        },
        "x": {
          "field": "category",
          "type": "nominal"
        },
        "text": {"field": "max_value", "type": "quantitative"},
        "tooltip": [{"field": "max_value", "type": "quantitative", "title": "Maximum"}]
      }
    },
    {
      "mark": {
        "type": "text",
        "align": "left",
        "dx": 20,
        "dy": 5,
        "color": "#000"
      },
      "encoding": {
        "y": {
          "field": "q1_value",
          "type": "quantitative"
        },
        "x": {
          "field": "category",
          "type": "nominal"
        },
        "text": {"field": "q1_value", "type": "quantitative"},
        "tooltip": [{"field": "q1_value", "type": "quantitative", "title": "Q1"}]
      }
    },
    {
      "mark": {
        "type": "text",
        "align": "right",
        "dx": -20,
        "dy": -5,
        "color": "#000"
      },
      "encoding": {
        "y": {
          "field": "q3_value",
          "type": "quantitative"
        },
        "x": {
          "field": "category",
          "type": "nominal"
        },
        "text": {"field": "q3_value", "type": "quantitative"},
        "tooltip": [{"field": "q3_value", "type": "quantitative", "title": "Q3"}]
      }
    }
  ],
  "config": {
    "axis": {
      "grid": true,
      "tickCount": 4,
      "gridDash": [5, 5],
      "gridOpacity": 1
    }
  }
}`,
	},{
    name: "Top 5 most popular genres by sales",
    duckdbQuery: 
    `SELECT 
  CASE 
    WHEN genre IN (
      SELECT genre 
      FROM data 
      GROUP BY genre 
      ORDER BY SUM(Global_Sales) DESC 
      LIMIT 5
    ) THEN genre 
    ELSE 'Others' 
  END as genre_group,
  SUM(Global_Sales) as total_sales
FROM data
GROUP BY genre_group
ORDER BY total_sales DESC;
    `,
    vegaLiteQuery: 
    `{
  "width": 400,
  "height": 400,
  "mark": {
    "type": "arc",
    "innerRadius": 100, 
    "stroke": "#fff", 
    "strokeWidth": 2
  },
  "encoding": {
    "theta": {"field": "total_sales", "type": "quantitative"},
    "color": {
      "field": "genre_group",
      "type": "nominal",
      "title": "Genre",
      "scale": {"scheme": "category10"},
      "legend": {"titleFontSize": 14, "labelFontSize": 12}
    },
    "tooltip": [
      {"field": "genre_group", "type": "nominal", "title": "Genre"},
      {
        "field": "total_sales",
        "type": "quantitative",
        "title": "Global Sales (millions)",
        "format": ".2f"
      }
    ]
  },
  "title": {
    "text": "Global Video Game Sales by Genre (in millions)",
    "fontSize": 18,
    "fontWeight": "bold",
    "anchor": "middle",
    "color": "#333"
  },
  "transform": [
    {
      "calculate": "'Genre: ' + datum.genre_group + ', Sales: ' + format(datum.total_sales, '.2f') + 'M'",
      "as": "label"
    }
  ],
  "encoding": {
    "theta": {"field": "total_sales", "type": "quantitative"},
    "color": {
      "field": "genre_group",
      "type": "nominal",
      "title": "Genre",
      "scale": {"scheme": "category10"}
    },
    "tooltip": [
      {"field": "genre_group", "type": "nominal", "title": "Genre"},
      {
        "field": "total_sales",
        "type": "quantitative",
        "title": "Global Sales (millions)",
        "format": ".2f"
      }
    ],
    "text": {"field": "label"}
  },
  "mark": {
    "type": "arc",
    "innerRadius": 100,
    "outerRadius": 200,
    "stroke": "#fff",
    "strokeWidth": 2
  },
  "config": {
    "view": {"stroke": null},
    "arc": {"labelRadius": 160, "labelFontSize": 12}
  }
}
`
	},
	{
		name: "Game Sales Heatmap by Genre and Region",
		duckdbQuery: `SELECT 
    Genre,
    SUM(NA_Sales) AS NA_Sales,
    SUM(EU_Sales) AS EU_Sales,
    SUM(JP_Sales) AS JP_Sales,
    SUM(Other_Sales) AS Other_Sales
FROM 
data
GROUP BY 
    Genre;`,
		vegaLiteQuery: `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "Game Sales Heatmap by Genre and Region",
  "width": 300,
  "height": 300,
  "mark": "rect",
  "encoding": {
    "x": {
      "field": "Region",
      "type": "nominal",
      "axis": {
        "title": "Region",
        "labelAngle": -45,
        "labelFontSize": 12,
        "labelPadding": 10
      }
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
        "scheme": "blues"
      },
      "legend": {
        "title": "Total Sales (Millions)"
      }
    }
  },
  "transform": [
    {
      "fold": ["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"],
      "as": ["Region", "Sales"]
    },
    {
      "filter": "datum.Genre != null"
    }
  ]
}`,
	},
  {
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
      "title": "Evolution of Video Game Genres Market Share (1996-Present)",
      "width": 800,
      "height": 600,
      "mark": "area",
      "params": [{
        "name": "genre_selection",
        "select": {"type": "point", "fields": ["genre"]},
        "bind": "legend"
      }],
      "encoding": {
        "x": {
          "field": "release_year",
          "type": "quantitative",
          "title": "Year of Release",
          "scale": {
            "domainMin": 1996,
            "type": "linear"
          },
          "axis": {
            "format": "d",
            "domain": false,
            "tickSize": 0
          }
        },
        "y": {
          "field": "market_share_percentage",
          "type": "quantitative",
          "title": "Market Share (%)",
          "stack": "normalize"
        },
        "color": {
          "field": "genre",
          "type": "nominal",
          "title": "Genre",
          "scale": {"scheme": "category20b"}
        },
        "opacity": {
          "condition": {"param": "genre_selection", "value": 1},
          "value": 0.2
        }
      },
      "transform": [
        {
          "filter": "datum.market_share_percentage > 0"
        }
      ]
    }`
},
{
  name: "Sales percentage over time grouped by platform",
  duckdbQuery: `SELECT
      Year_of_Release as release_year,
      Platform as platform,
      (SUM(Global_Sales) / SUM(SUM(Global_Sales)) OVER (PARTITION BY Year_of_Release) * 100) as market_share_percentage
  FROM data
  WHERE Year_of_Release >= 1996
  GROUP BY Year_of_Release, Platform
  ORDER BY release_year ASC;`,
  
  vegaLiteQuery: `{
    "title": "Evolution of Gaming Platforms Market Share (1996-Present)",
    "width": 800,
    "height": 600,
    "mark": "area",
    "params": [
      {
        "name": "platform_selection",
        "select": {"type": "point", "fields": ["platform"]},
        "bind": "legend"
      }
    ],
    "encoding": {
      "x": {
        "field": "release_year",
        "type": "quantitative",
        "title": "Year of Release",
        "scale": {"domainMin": 1996, "type": "linear"},
        "axis": {"format": "d", "domain": false, "tickSize": 0}
      },
      "y": {
        "field": "market_share_percentage",
        "type": "quantitative",
        "title": "Market Share (%)",
        "stack": "normalize"
      },
      "color": {
        "field": "platform",
        "type": "nominal",
        "title": "Platform",
        "scale": {
          "domain": [
            "PS", "PS2", "PS3", "PS4", "PSP", "PSV",
            "XB", "X360", "XOne",
            "GC", "Wii", "WiiU", "DS", "3DS", "GBA",
            "PC",
            "DC"
          ],
          "range": [
            "#393b79", "#5254a3", "#6b6ecf", "#9c9ede", "#4c4f9c", "#8587c4",
            "#31a354", "#74c476", "#a1d99b",
            "#843c39", "#ad494a", "#d6616b", "#e7969c", "#7b4173", "#a55194",
            "#404040",
            "#ce6dbd"
          ]
        }
      },
      "opacity": {
        "condition": {"param": "platform_selection", "value": 1},
        "value": 0.2
      }
    },
    "transform": [{"filter": "datum.market_share_percentage > 0"}]
  }`
},
{
  name: "Critics vs user score compared by genre over time", 
  duckdbQuery: `SELECT 
      Year_of_Release as year,
      Genre as genre,
      AVG(User_Score) as avg_user_score,
      AVG(Critic_Score) / 10 as avg_critic_score,
      CAST(COUNT(*) AS INTEGER) as num_releases
  FROM data
  GROUP BY Year_of_Release, Genre`,

  vegaLiteQuery: `{
    "title": "Genre Performance by User and Critic Scores",
    "width": 600,
    "height": 400,
    "params": [
      {
        "name": "year_slider",
        "value": 2006,
        "bind": {
          "input": "range",
          "min": 1996,
          "max": 2016,
          "step": 1,
          "name": "Year: "
        }
      }
    ],
    "layer": [
      {
        "mark": {
          "type": "line",
          "color": "gray",
          "opacity": 1,
          "strokeWidth": 2
        },
        "encoding": {
          "x": {"datum": -1000},
          "y": {"datum": -1000},
          "x2": {"datum": 1000},
          "y2": {"datum": 1000}
        }
      },
      {
        "mark": {
          "type": "text",
          "align": "right",
          "baseline": "top",
          "dx": -5,
          "dy": 5,
          "fontSize": 11,
          "fontStyle": "italic"
        },
        "encoding": {
          "x": {"datum": 10},
          "y": {"datum": 10},
          "text": {"value": "User / Critic Agreement Line"}
        }
      },
      {
        "mark": {"type": "circle", "opacity": 0.8},
        "encoding": {
          "x": {
            "field": "avg_critic_score",
            "type": "quantitative",
            "title": "Average Critic Score",
            "scale": {"domain": [0, 10]}
          },
          "y": {
            "field": "avg_user_score",
            "type": "quantitative",
            "title": "Average User Score",
            "scale": {"domain": [0, 10]}
          },
          "size": {
            "field": "num_releases",
            "type": "quantitative",
            "title": "Number of Releases",
            "scale": {"domain": [0, 50]}
          },
          "color": {
            "field": "genre",
            "type": "nominal",
            "title": "Genre",
            "scale": {"scheme": "category10"}
          },
          "tooltip": [
            {"field": "genre", "type": "nominal", "title": "Genre"},
            {
              "field": "avg_critic_score",
              "type": "quantitative",
              "format": ".1f",
              "title": "Critic Score"
            },
            {
              "field": "avg_user_score",
              "type": "quantitative",
              "format": ".1f",
              "title": "User Score"
            },
            {
              "field": "num_releases",
              "type": "quantitative",
              "title": "Number of Games"
            }
          ]
        },
        "selection": {
          "grid": {
            "type": "interval",
            "bind": "scales"
          }
        }
      }
    ],
    "transform": [{"filter": "datum.year == year_slider"}]
  }`
}

];
