import { db } from "./duckdb";

const serverUrl = import.meta.env.DEV ? "http://localhost:4321" : "https://visualization-project.pages.dev";
const c = await db.connect();
await c.insertCSVFromPath(`${serverUrl}/data.csv`, {
    name: 'data',
    detect: true,
    header: true,
});

export async function executeQuery(queryString: string): Promise<Record<string, any>[] | Error> {
    try {
        const result = await c.query(queryString);
        return result.toArray().map((row: any) => row.toJSON());
    } catch (error) {
        console.error("Error executing query:", error);
        return error instanceof Error ? error : new Error(String(error));
    }
}