import type { Query } from '../types';

export const genreMarketShareQuery: Query = {
    name: "Sales percentage over time grouped by genre",
    duckdbQuery: `SELECT 
        Year_of_Release as release_year,
        Genre as genre,
        (SUM(Global_Sales) / SUM(SUM(Global_Sales)) OVER (PARTITION BY Year_of_Release) * 100) as market_share_percentage
    FROM data
    WHERE Year_of_Release >= 1996
    GROUP BY Year_of_Release, Genre
    ORDER BY release_year ASC`,
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
}; 