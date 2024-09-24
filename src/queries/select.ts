import { c } from "./duckdb";


export async function getAll(n: number) {
    return await c.query(`
        SELECT * 
        FROM data 
        ORDER BY Name
        LIMIT ${n}
        OFFSET 20
    `).then(v => v.toArray().map((row: any) => row.toJSON()));
}