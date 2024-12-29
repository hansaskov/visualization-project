import type { Query } from '../types';

export const globalSalesBoxplotQuery: Query = {
    name: "boksplot global sales vertical",
    duckdbQuery: `SELECT
    'Global Sales' AS category,
    ROUND(MIN("Global_Sales"), 2) AS min_value,
    ROUND(APPROX_QUANTILE("Global_Sales", 0.25), 2) AS q1_value,
    ROUND(MEDIAN("Global_Sales"), 2) AS median_value,
    ROUND(APPROX_QUANTILE("Global_Sales", 0.75), 2) AS q3_value,
    1 AS max_value
FROM data
WHERE "Global_Sales" IS NOT NULL;`,
    vegaLiteQuery: `{
  "title": {
    "text": "Distribution of 'global sales'",
    "subtitle": ["50% of all videogames will sell between 110.000 and 755.000 copies.", "One max value is redacted from the graph due to extreme difference"],
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
          "type": "nominal",
          "title": "Metric"
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
          "type": "quantitative"
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
        "text": {"field": "min_value", "type": "quantitative", "format": ".2f"},
        "tooltip": [{"field": "min_value", "type": "quantitative", "title": "Minimum", "format": ".2f"}]
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