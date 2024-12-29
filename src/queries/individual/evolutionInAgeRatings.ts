import type { Query } from '../types';

export const evolutionInAgeRatingsQuery: Query = {
    name: "13. evolution in age rating",
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
      "field": "genre",
      "type": "nominal",
      "scale": {
        "domain": ["E", "E10+", "T", "M", "AO", "RP"],
        "scheme": "category10"
      }
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
}`
}; 