import type { Query } from '../types';

export const criticUserScoreDifferenceQuery: Query = {
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
}; 