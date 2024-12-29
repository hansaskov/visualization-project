import type { Query } from '../types';

export const selectAllQuery: Query = {
    name: "Select All",
    duckdbQuery: `SELECT * FROM data`,
    vegaLiteQuery: `{
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": 800,
        "height": 400,
        "title": {
            "text": "All Video Game Data",
            "subtitle": "Complete dataset visualization",
            "fontSize": 20,
            "fontWeight": "bold",
            "subtitleFontSize": 14,
            "subtitleColor": "#666666",
            "offset": 10,
            "subtitlePadding": 15
        },
        "mark": "point",
        "encoding": {
            "x": {
                "field": "Year_of_Release",
                "type": "temporal",
                "axis": {
                    "title": "Year of Release",
                    "labelAngle": -45
                }
            },
            "y": {
                "field": "Global_Sales",
                "type": "quantitative",
                "axis": {
                    "title": "Global Sales (millions)"
                }
            },
            "color": {
                "field": "Genre",
                "type": "nominal",
                "legend": {
                    "title": "Genre"
                }
            },
            "tooltip": [
                {"field": "Name", "type": "nominal", "title": "Game"},
                {"field": "Platform", "type": "nominal"},
                {"field": "Genre", "type": "nominal"},
                {"field": "Publisher", "type": "nominal"},
                {"field": "Global_Sales", "type": "quantitative", "title": "Global Sales", "format": ".2f"},
                {"field": "Critic_Score", "type": "quantitative", "title": "Critic Score"},
                {"field": "User_Score", "type": "quantitative", "title": "User Score"}
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