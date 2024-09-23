import { c } from "./duckdb";

const prepared = await c.prepare(`SELECT * FROM data LIMIT ?`);

export async function getAll(n: number) {
    const result = await prepared.query(n)
    const json = result.toArray().map((row) => row.toJSON());

    return json
}