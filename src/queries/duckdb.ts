
import * as duckdb from '@duckdb/duckdb-wasm';

const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

export async function createDuckDB() {
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

  return db;
}

export async function createDuckDBConnection(db: duckdb.AsyncDuckDB) {
  const serverUrl = import.meta.env.DEV ? "http://localhost:4321" : "https://visualization-project.pages.dev";
  const c = await db.connect();
  await c.insertCSVFromPath(`${serverUrl}/data.csv`, {
      name: 'data',
      detect: true,
      header: true,
  });

  return c;
  
}
export async function executeQuery(c: duckdb.AsyncDuckDBConnection, queryString: string): Promise<Record<string, any>[] | Error> {
    try {
        const result = await c.query(queryString);
        return result.toArray().map((row: any) => row.toJSON());
    } catch (error) {
        console.error("Error executing query:", error);
        return error instanceof Error ? error : new Error(String(error));
    }
}


