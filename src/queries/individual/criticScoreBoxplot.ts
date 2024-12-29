import type { Query } from '../types';

export const criticScoreBoxplotQuery: Query = {
    name: "Boksplot criticscore and userscore",
    duckdbQuery: `SELECT 
    'User Score (Normalized)' AS category,
    ROUND(MIN(CAST("User_Score" AS DOUBLE) * 10), 2) AS min_value,
    ROUND(APPROX_QUANTILE(CAST("User_Score" AS DOUBLE) * 10, 0.25), 2) AS q1_value,
    ROUND(MEDIAN(CAST("User_Score" AS DOUBLE) * 10), 2) AS median_value,
    ROUND(APPROX_QUANTILE(CAST("User_Score" AS DOUBLE) * 10, 0.75), 2) AS q3_value,
    ROUND(MAX(CAST("User_Score" AS DOUBLE) * 10), 2) AS max_value
FROM data
WHERE "User_Score" IS NOT NULL
  AND TRY_CAST("User_Score" AS DOUBLE) IS NOT NULL

UNION ALL

SELECT 
    'Critic Score' AS category,
    ROUND(MIN(CAST("Critic_Score" AS DOUBLE)), 2) AS min_value,
    ROUND(APPROX_QUANTILE(CAST("Critic_Score" AS DOUBLE), 0.25), 2) AS q1_value,
    ROUND(MEDIAN(CAST("Critic_Score" AS DOUBLE)), 2) AS median_value,
    ROUND(APPROX_QUANTILE(CAST("Critic_Score" AS DOUBLE), 0.75), 2) AS q3_value,
    ROUND(MAX(CAST("Critic_Score" AS DOUBLE)), 2) AS max_value
FROM data
WHERE "Critic_Score" IS NOT NULL
  AND TRY_CAST("Critic_Score" AS DOUBLE) IS NOT NULL;`,
    vegaLiteQuery: `{
  "title": {
    "text": "Distribution of 'User reviews' and 'Critic reviews'",
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
          {"field": "min_value", "type": "quantitative", "title": "Minimum", "format": ".2f"},
          {"field": "max_value", "type": "quantitative", "title": "Maximum", "format": ".2f"}
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
          {"field": "q1_value", "type": "quantitative", "title": "Q1", "format": ".2f"},
          {"field": "q3_value", "type": "quantitative", "title": "Q3", "format": ".2f"}
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
          {"field": "median_value", "type": "quantitative", "title": "Median", "format": ".2f"}
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
        "text": {"field": "min_value", "type": "quantitative", "format": ".2f"},
        "tooltip": [{"field": "min_value", "type": "quantitative", "title": "Minimum", "format": ".2f"}]
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
        "text": {"field": "max_value", "type": "quantitative", "format": ".2f"},
        "tooltip": [{"field": "max_value", "type": "quantitative", "title": "Maximum", "format": ".2f"}]
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
        "text": {"field": "q1_value", "type": "quantitative", "format": ".2f"},
        "tooltip": [{"field": "q1_value", "type": "quantitative", "title": "Q1", "format": ".2f"}]
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
        "text": {"field": "q3_value", "type": "quantitative", "format": ".2f"},
        "tooltip": [{"field": "q3_value", "type": "quantitative", "title": "Q3", "format": ".2f"}]
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
}`
}; 