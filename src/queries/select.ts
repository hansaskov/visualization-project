import { c } from "./duckdb";


export async function getAll(n: number) {
    return await c.query(`SELECT Name FROM data LIMIT ${n}`)
}