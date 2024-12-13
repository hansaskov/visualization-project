export const queries = [
	{
		name: "Select All",
		duckdbQuery: `SELECT *
FROM data
LIMIT 50`,
		vegaLiteQuery: "",
	},
	{
		name: "Top 10 genres by global sales",
		duckdbQuery: `SELECT genre, SUM("Global_Sales") AS total_sales
FROM data
GROUP BY genre
ORDER BY total_sales DESC
LIMIT 10`,
		vegaLiteQuery: `{
    "width": 950,
    "height": 300,
    "mark": "bar",
    "title": {
      "text": "All time most popular genres based on sales",
      "subtitle": "Action games are by far the most popular genre, with adventure games being the least popular",
      "fontSize": 20,
      "fontWeight": "bold",
      "subtitleFontSize": 14,
      "subtitleColor": "#666666",
      "offset": 10,
      "subtitlePadding": 15
    },
    "encoding": {
        "x": {"field": "Genre", "type": "nominal", "sort": "-y", "title":"Genre", "axis": {"labelAngle": -360}},
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
}
`,
	},
  
	{
		name: "Top 10 platforms by Critic Score",
		duckdbQuery: `SELECT Platform, AVG(Critic_Score) AS avg_critic_score, CAST(COUNT(*) AS INT) AS game_count
FROM data
GROUP BY Platform
HAVING COUNT(*) > 10
ORDER BY avg_critic_score DESC
LIMIT 10
`,
		vegaLiteQuery: `{
  "mark": "bar",
  "width": 800,
  "height": 400,
  "title": {
    "text": "All time most liked platforms based on critic reviews ",
    "subtitle": ["Dreamcast is ahead as the most liked platform by critics.", "PC holds the throne after the dreamcast"],
    "fontSize": 20,
    "fontWeight": "bold",
    "subtitleFontSize": 14,
    "subtitleColor": "#666666",
    "offset": 10,
    "subtitlePadding": 15
  },
  "encoding": {
    "x": {
      "field": "Platform",
      "type": "nominal",
      "sort": "-y",
      "axis": {"labelAngle": -360}
    },
    "y": {
      "field": "avg_critic_score",
      "type": "quantitative",
      "title": "Average Critic Score",
      "scale": {"zero": false}
    }
  }
}
`,
	},
	{
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
		name: "boksplot global sales vertical",
		duckdbQuery: `SELECT
    'Global Sales' AS category,
    MIN("Global_Sales") AS min_value,
    APPROX_QUANTILE("Global_Sales", 0.25) AS q1_value,
    MEDIAN("Global_Sales") AS median_value,
    APPROX_QUANTILE("Global_Sales", 0.75) AS q3_value,
    1 AS max_value
FROM data
WHERE "Global_Sales" IS NOT NULL;`,
		vegaLiteQuery: `{
  "title": {
    "text": "Boxplot of Global Sales",
    "subtitle": ["Max Value is missing do to extreme difference.", "Max global sales was Wii Sports with 82.53 million", "", "The 1 indicates that the max lies above 1"]
  },
  "title": {
    "text": "Distribution of \'global sales\' ",
    "subtitle": ["50% of all videogames will sell between 110.000 and 755.000 copies.", "One max value is redacted from the graph do to extreme difference"],
    "fontSize": 20,
    "fontWeight": "bold",
    "subtitleFontSize": 14,
    "subtitleColor": "#666666",
    "offset": 20,
    "subtitlePadding": 15
  },
  "width": 600,
  "height": 400,
  "layer": [
    {
      "mark": {"type": "rule", "size": 2},
      "encoding": {
        "y": {
          "field": "min_value",
          "type": "quantitative",
          "scale": {
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
        "text": {"field": "max_value", "type": "norminal", "value": "< 1"},
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
  "title": {
    "text": "Distribution of \'User reviews\' and \'Critic reviews \' ",
    "subtitle": ["On average, users give a slightly higher rating than Critics"],
    "fontSize": 20,
    "fontWeight": "bold",
    "subtitleFontSize": 14,
    "subtitleColor": "#666666",
    "offset": 20,
    "subtitlePadding": 15
  },
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
	},
  {
    name: "7. Pie chart of total Games sold by region",
    duckdbQuery:
    `SELECT 
    'North America' as region,
    SUM(NA_Sales) as sales
FROM data
UNION ALL
SELECT 
    'Europe' as region,
    SUM(EU_Sales) as sales
FROM data
UNION ALL
SELECT 
    'Japan' as region,
    SUM(JP_Sales) as sales
FROM data
UNION ALL
SELECT 
    'Other Regions' as region,
    SUM(Other_Sales) as sales
FROM data
ORDER BY sales DESC;`,
    vegaLiteQuery:
    `{
  "width":500,
  "height": 400,
  "title": {
    "text": "Distibution of sales across the world",
    "subtitle": ["North America and Europe have the majority of all sales"],
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
    "theta": {"field": "sales", "type": "quantitative"},
    "color": {
      "field": "region",
      "type": "nominal",
      "title": "Region",
      "scale": {"scheme": "category10"},
      "legend": {"titleFontSize": 14, "labelFontSize": 12}
    },
    "tooltip": [
      {"field": "region", "type": "nominal", "title": "Region"},
      {
        "field": "sales",
        "type": "quantitative",
        "title": "Sales (millions)",
        "format": ".2f"
      }
    ]
  },
  "transform": [
    {
      "calculate": "'Region: ' + datum.region + ', Sales: ' + format(datum.sales, '.2f') + 'M'",
      "as": "label"
    }
  ],
  "config": {
    "view": {"stroke": null},
    "arc": {"labelRadius": 160, "labelFontSize": 12}
  }
}`
},
{
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
      "subtitle": ["Role-Playing games are the most popular genre in Japan, Action games are universally popular," ,"and Shooter and Sports games does best outside of Japan"],
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
  "title": {
    "text": "Evolution of Video Game Genres Market Share (1996-Present)",
    "subtitle": ["Select Genres on the side to focus specic lines. Shift + Click to select multiple"],
    "fontSize": 20,
    "fontWeight": "bold",
    "subtitleFontSize": 14,
    "subtitleColor": "#666666",
    "offset": 20,
    "subtitlePadding": 15
  },
  
  "width": 800,
  "height": 600,
   "mark": {"type":"line", "strokeWidth": 3},
  "params": [
    {
      "name": "genre_selection",
      "select": {"type": "point", "fields": ["genre"]},
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
      "title": "Market Share (%)"
    },
    "color": {
      "field": "genre",
      "type": "nominal",
      "title": "Genre",
      "scale": {"scheme": "category10"},
      "strokeWidth": 10
    },
    "opacity": {
      "condition": {"param": "genre_selection", "value": 1},
      "value": 0.2
    },
    "tooltip": [
      {"field": "genre", "type": "nominal", "title": "Genre"},
      {
        "field": "market_share_percentage",
        "type": "quantitative",
        "format": ".1f",
        "title": "Market Share (%)"
      },
      {"field": "release_year", "type": "quantitative", "title": "Year"}
    ]
  },
  "transform": [{"filter": "datum.market_share_percentage > 0"}]
    }`
},
{
  name: "9. Which genres sells the best on different platforms",
  duckdbQuery: `
    WITH platform_totals AS (
      SELECT
        Platform,
        SUM(Global_Sales) as platform_total_sales
      FROM data
      GROUP BY Platform
    ),
    genre_totals AS (
      SELECT 
        Genre,
        SUM(Global_Sales) as total_genre_sales
      FROM data
      GROUP BY Genre
      ORDER BY total_genre_sales DESC
    )
    SELECT
      d.Platform,
      d.Genre,
      SUM(d.Global_Sales) as total_sales,
      (SUM(d.Global_Sales) / pt.platform_total_sales * 100) as percentage_of_platform,
      gt.total_genre_sales
    FROM data d
    JOIN platform_totals pt ON d.Platform = pt.Platform
    JOIN genre_totals gt ON d.Genre = gt.Genre
    GROUP BY d.Platform, d.Genre, pt.platform_total_sales, gt.total_genre_sales
    ORDER BY gt.total_genre_sales DESC, d.Platform, percentage_of_platform DESC;
  `,
  vegaLiteQuery: `{
    "width": 700,
    "height": 500,
    "padding": {"top": 30, "bottom": 10, "left": 10, "right": 10},
    "title": {
      "text": "Video Game Genre Dominance Across Gaming Platforms",
      "subtitle": "Action games lead across most platforms, while Platform and Shooter games show platform-specific popularity",
      "fontSize": 20,
      "fontWeight": "bold",
      "subtitleFontSize": 14,
      "subtitleColor": "#666666",
      "offset": 20,
      "subtitlePadding": 15
    },
    "mark": "rect",
    "encoding": {
      "x": {
        "field": "Platform",
        "type": "nominal",
        "axis": {
          "labelAngle": 360,
          "title": "Platform"
        },
        "sort": [
          "NES", "SNES", "N64", "GC", "Wii", "WiiU",  
          "GB", "GBA", "DS", "3DS",
          "PS", "PS2", "PS3", "PS4", "PSP", "PSV",
          "XB", "X360", "XOne",
          "PC",
          "2600", "GEN", "DC", "SAT", "NG", "TG16", "3DO", "WS", "SCD", "PCFX"
        ]
      },
      "y": {
        "field": "Genre",
        "type": "nominal",
        "title": "Genre",
        "sort": {"field": "total_genre_sales", "order": "descending"}
      },
      "color": {
        "field": "percentage_of_platform",
        "type": "quantitative",
        "title": "% of Platform Sales",
        "scale": {
          "scheme": "viridis",
          "domain": [0, 40]
        }
      },
      "tooltip": [
        {"field": "Platform", "type": "nominal"},
        {"field": "Genre", "type": "nominal"},
        {
          "field": "percentage_of_platform",
          "type": "quantitative",
          "title": "% of Platform Sales",
          "format": ".1f"
        },
        {
          "field": "total_sales",
          "type": "quantitative",
          "title": "Total Sales (millions)",
          "format": ".2f"
        },
        {
          "field": "total_genre_sales",
          "type": "quantitative",
          "title": "Total Genre Sales (millions)",
          "format": ".2f"
        }
      ]
    },
    "config": {
      "view": {
        "stroke": "transparent"
      }
    }
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
  "width": 800,
  "height": 600,
  "title": {
    "text": "Evolution of Gaming Platforms Market Share (1996-Present)",
    "subtitle": ["Select Genres on the side to focus specic lines. Shift + Click to select multiple"],
    "fontSize": 20,
    "fontWeight": "bold",
    "subtitleFontSize": 14,
    "subtitleColor": "#666666",
    "offset": 20,
    "subtitlePadding": 15
  },
   "mark": {"type":"line", "strokeWidth": 3},
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
      "axis": {"format": "d", "domain": false, "tickSize": 2}
    },
    "y": {
      "field": "market_share_percentage",
      "type": "quantitative",
      "title": "Market Share (%)"
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
          "GC",
          "Wii",
          "WiiU",
          "GBA",
          "DS",
          "3DS",
          "PC",
          "DC"
        ],
        "range": [
          "#234565",
          "#2b567d",
          "#336696",
          "#3a76ae",
          "#4cc5c5",
          "#63cdce",
          "#2f551e",
          "#3c6d26",
          "#48852e",
          "#b280d5",
          "#c197de",
          "#cfafe6",
          "#c96160",
          "#d27877",
          "#da908f",
          "#404040",
          "#cfae44"
        ]
      }
    },
    "opacity": {
      "condition": {"param": "platform_selection", "value": 1},
      "value": 0.2
    },
    "tooltip": [
      {"field": "platform", "type": "nominal", "title": "Platform"},
      {
        "field": "market_share_percentage",
        "type": "quantitative",
        "format": ".1f",
        "title": "Market Share (%)"
      },
      {"field": "release_year", "type": "quantitative", "title": "Year"}
    ]
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
    "title": {
    "text": "Comparing reviews from critics and users through the years",
    "subtitle": ["Being above the line, indicates that users have given a higher rated review than critics for that year and gerne",  "Critics rated games higher in the mid 2000s. Where users rated games higher in the 2010s "],
    "fontSize": 20,
    "fontWeight": "bold",
    "subtitleFontSize": 14,
    "subtitleColor": "#666666",
    "offset": 10,
    "subtitlePadding": 15
  },
    "width": 800,
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
            "scale": {
              "domain": [6, 8],
              "zero": false
            }
          },
          "y": {
            "field": "avg_user_score",
            "type": "quantitative",
            "title": "Average User Score",
            "scale": {
              "domain": [6, 8],
              "zero": false
            }
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
},
{
  name: "10. Critics vs user score difference", 
  duckdbQuery: `SELECT 
      Year_of_Release as year,
      Genre as genre,
      AVG(User_Score) as avg_user_score,
      AVG(Critic_Score) / 10 as avg_critic_score,
      avg_user_score - avg_critic_score as score_difference,
      CAST(COUNT(*) AS INTEGER) as num_releases
  FROM data
  GROUP BY Year_of_Release, Genre`,

  vegaLiteQuery: `{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 800,
  "height": 400,
  "title": {
    "text": "Difference Between User and Critic Scores by Genre",
    "subtitle": "Positive values indicate higher user scores, negative values indicate higher critic scores",
    "fontSize": 20,
    "fontWeight": "bold",
    "subtitleFontSize": 14,
    "subtitleColor": "#666666",
    "offset": 10,
    "subtitlePadding": 15
  },
  "params": [{
    "name": "year_selection",
    "value": 2006,
    "bind": {
      "input": "range",
      "min": 1996,
      "max": 2016,
      "step": 1,
      "name": "Year Selection: "
    }
  }],
  "transform": [
    {"filter": "datum.year == year_selection"}
  ],
  "mark": "bar",
  "encoding": {
    "x": {
      "field": "genre",
      "type": "nominal",
      "axis": {
        "title": "Genre",
        "labelAngle": -360
      }
    },
    "y": {
      "field": "score_difference",
      "type": "quantitative",
      "axis": {
        "title": "Score Difference (User - Critic)",
        "gridColor": {
          "condition": {"test": "datum.value === 0", "value": "black"},
          "value": "#ddd"
        }
      }
    },
    "color": {
      "condition": {
        "test": "datum.score_difference > 0",
        "value": "#4C78A8"
      },
      "value": "#E45756"
    },
    "tooltip": [
      {"field": "genre", "type": "nominal", "title": "Genre"},
      {"field": "score_difference", "type": "quantitative", "title": "Score Difference", "format": ".2f"},
      {"field": "avg_user_score", "type": "quantitative", "title": "Avg User Score", "format": ".2f"},
      {"field": "avg_critic_score", "type": "quantitative", "title": "Avg Critic Score", "format": ".2f"},
      {"field": "num_releases", "type": "quantitative", "title": "Number of Releases"}
    ]
  },
  "config": {
    "view": {
      "stroke": "transparent"
    },
    "axis": {
      "domain": false
    }
  }
}`
},
{
  name:"13. evolution in age rating",
  duckdbQuery: `SELECT Year_of_Release as year,
              Rating as genre,
  CAST(COUNT(Rating) as INTEGER) as num_releases
  FROM data
  GROUP BY Year_of_Release, Rating
  ORDER BY year ASC;`,
  vegaLiteQuery: `{
 "width": 800,
  "height": 400,
  "title": {
    "text": "Evolution in Age Ratings for Game Releases",
    "subtitle": "E and T rated games were the most common age ratings in the late 1990s and early 2000s",
    "fontSize": 20,
    "fontWeight": "bold",
    "subtitleFontSize": 14,
    "subtitleColor": "#666666",
    "offset": 10,
    "subtitlePadding": 15
  },
  "params": [
    {
      "name": "genre_selection",
      "select": {"type": "point", "fields": ["genre"]},
      "bind": "legend"
    }
  ],
  "mark": "line",
  "encoding": {
    "x": {
      "field": "year",
      "type": "nominal",
      "axis": {"title": "Year of Release", "labelAngle": -360}
    },
    "y": {
      "field": "num_releases",
      "type": "quantitative",
      "axis": {
        "title": "Number of Releases"
      }
    },
    "color": {
      "field": "genre", "type": "nominal", "scale": { "domain": ["E", "E10+", "T", "M", "AO", "RP"],
      "scheme": "category10"}
    },
     "opacity": {
      "condition": {"param": "genre_selection", "value": 1},
      "value": 0.2
    },
    "tooltip": [
      {"field": "genre", "type": "nominal", "title": "Age Rating"},
      {
        "field": "num_releases",
        "type": "quantitative",
        "title": "Number of Releases"
      }
    ]
  },
  "config": {"view": {"stroke": "transparent"}, "axis": {"domain": false}}
}
  `
}

] as const;

export type QueryNames = typeof queries[number]["name"]