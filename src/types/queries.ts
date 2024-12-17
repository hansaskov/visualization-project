import { queries } from '../queries/queries';

// Create a union type of all possible query names
export type QueryNames = 
    | "Select All"
    | "Top 10 publishers"
    | "Top 10 platforms by Critic Score"
    | "Sales over time grouped by genre (AI)"
    | "boksplot global sales vertical"
    | "Boksplot criticscore and userscore"
    | "Top 5 most popular genres by sales"
    | "7. Pie chart of total Games sold by region"
    | "Game Sales Heatmap by Genre and Region"
    | "Sales percentage over time grouped by genre"
    | "Sales percentage over time grouped by platform"
    | "Critics vs user score compared by genre over time";

// Get the type of a single query
export type Query = {
    name: QueryNames;
    duckdbQuery: string;
    vegaLiteQuery: string;
};

// Type guard to ensure a query exists
export function getQueryByName(name: QueryNames): Query | undefined {
    return queries.find((q): q is Query => q.name === name);
}

// Export the queries array for direct access
export { queries };