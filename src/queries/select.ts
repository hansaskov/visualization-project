import { c } from "./duckdb";


export async function getAll(n: number) {
    return await c.query(`SELECT * FROM data LIMIT ${n}`)
}