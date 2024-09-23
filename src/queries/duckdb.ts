
import * as duckdb from '@duckdb/duckdb-wasm';

const serverUrl = import.meta.env.DEV ? "http://localhost:4321" : "https://visualization-project-agv.pages.dev";

const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

// Select a bundle based on browser checks
const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

const worker_url = URL.createObjectURL(
  new Blob([`importScripts("${bundle.mainWorker!}");`], {type: 'text/javascript'})
);

// Instantiate the asynchronus version of DuckDB-Wasm
const worker = new Worker(worker_url);
const logger = new duckdb.ConsoleLogger();
const db = new duckdb.AsyncDuckDB(logger, worker);
await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
URL.revokeObjectURL(worker_url);

export const c = await db.connect()

await c.insertCSVFromPath(`${serverUrl}/data.csv`, {
    name: 'data',
    detect: true,
    header: true,
});

