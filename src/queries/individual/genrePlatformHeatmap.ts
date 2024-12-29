import type { Query } from '../types';

export const genrePlatformHeatmapQuery: Query = {
    name: "9. Which genres sells the best on different platforms",
    duckdbQuery: `WITH platform_totals AS (
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
    ORDER BY gt.total_genre_sales DESC, d.Platform, percentage_of_platform DESC`,
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
}; 