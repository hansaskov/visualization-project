import type { Query } from '../types';

export const platformMarketShareQuery: Query = {
    name: "Sales percentage over time grouped by platform",
    duckdbQuery: `SELECT
        Year_of_Release as release_year,
        Platform as platform,
        (SUM(Global_Sales) / SUM(SUM(Global_Sales)) OVER (PARTITION BY Year_of_Release) * 100) as market_share_percentage
    FROM data
    WHERE Year_of_Release >= 1996
    GROUP BY Year_of_Release, Platform
    ORDER BY release_year ASC`,
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
                        "PS", "PS2", "PS3", "PS4", "PSP", "PSV",
                        "XB", "X360", "XOne",
                        "GC", "Wii", "WiiU",
                        "GBA", "DS", "3DS",
                        "PC", "DC"
                    ],
                    "range": [
                        "#234565", "#2b567d", "#336696", "#3a76ae", "#4cc5c5", "#63cdce",
                        "#2f551e", "#3c6d26", "#48852e",
                        "#b280d5", "#c197de", "#cfafe6",
                        "#c96160", "#d27877", "#da908f",
                        "#404040", "#cfae44"
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
}; 