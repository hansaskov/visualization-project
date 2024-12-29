import type { Query } from '../types';

export const topPlatformsQuery: Query = {
    name: "Top 10 platforms by Critic Score",
    duckdbQuery: `SELECT Platform, AVG(Critic_Score) AS avg_critic_score, CAST(COUNT(*) AS INT) AS game_count
FROM data
GROUP BY Platform
HAVING COUNT(*) > 10
ORDER BY avg_critic_score DESC
LIMIT 10`,
    vegaLiteQuery: `{
  "mark": "bar",
  "width": 800,
  "height": 400,
  "title": {
    "text": "All time most liked platforms based on critic reviews",
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
}`
}; 