import type { Query } from '../types';

export const criticsVsUserScoreQuery: Query = {
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
        "subtitle": ["Being above the line, indicates that users have given a higher rated review than critics for that year and gerne", "Critics rated games higher in the mid 2000s. Where users rated games higher in the 2010s"],
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
                "type": "rule",
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
}; 