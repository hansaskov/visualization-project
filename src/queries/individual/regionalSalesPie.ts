import type { Query } from '../types';

export const regionalSalesPieQuery: Query = {
    name: "7. Pie chart of total Games sold by region",
    duckdbQuery: `SELECT 
        'North America' as region,
        SUM(NA_Sales) as sales
    FROM data
    UNION ALL
    SELECT 
        'Europe' as region,
        SUM(EU_Sales) as sales
    FROM data
    UNION ALL
    SELECT 
        'Japan' as region,
        SUM(JP_Sales) as sales
    FROM data
    UNION ALL
    SELECT 
        'Other Regions' as region,
        SUM(Other_Sales) as sales
    FROM data
    ORDER BY sales DESC;`,
    vegaLiteQuery: `{
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": 500,
        "height": 400,
        "title": {
            "text": "Distibution of sales across the world",
            "subtitle": ["North America and Europe have the majority of all sales"],
            "fontSize": 20,
            "fontWeight": "bold",
            "subtitleFontSize": 14,
            "subtitleColor": "#666666",
            "offset": 10,
            "subtitlePadding": 15
        },
        "mark": {
            "type": "arc",
            "innerRadius": 100,
            "outerRadius": 200,
            "stroke": "#fff",
            "strokeWidth": 2
        },
        "encoding": {
            "theta": {
                "field": "sales",
                "type": "quantitative"
            },
            "color": {
                "field": "region",
                "type": "nominal",
                "title": "Region",
                "scale": {
                    "scheme": "category10"
                },
                "legend": {
                    "titleFontSize": 14,
                    "labelFontSize": 12
                }
            },
            "tooltip": [
                {"field": "region", "type": "nominal", "title": "Region"},
                {
                    "field": "sales",
                    "type": "quantitative",
                    "title": "Sales (millions)",
                    "format": ".2f"
                }
            ]
        },
        "transform": [
            {
                "calculate": "'Region: ' + datum.region + ', Sales: ' + format(datum.sales, '.2f') + 'M'",
                "as": "label"
            }
        ],
        "config": {
            "view": {"stroke": null},
            "arc": {"labelRadius": 160, "labelFontSize": 12}
        }
    }`
}; 