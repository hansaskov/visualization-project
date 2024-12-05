// stores/duckdbStore.ts
import type { AsyncDuckDB, AsyncDuckDBConnection } from '@duckdb/duckdb-wasm';
import * as duckdb from '@duckdb/duckdb-wasm';
import { writable } from 'svelte/store';

interface DuckDBStore {
  db: AsyncDuckDB | null;
  connection: AsyncDuckDBConnection | null;
  isInitialized: boolean;
  error: Error | null;
}

// Create the store with initial values
const createDuckDBStore = () => {
  const { subscribe, set, update } = writable<DuckDBStore>({
    db: null,
    connection: null,
    isInitialized: false,
    error: null
  });

  let globalDB: AsyncDuckDB | null = null;
  let globalConnection: AsyncDuckDBConnection | null = null;

  // Initialize DuckDB instance
  async function initialize() {
    try {
      // Check if we already have an initialized instance in this session
      let storeValue: DuckDBStore;
      subscribe(value => { storeValue = value; })();
      
      if (storeValue.isInitialized) {
        return;
      }

      // Check if there's already a session active
      const hasActiveSession = sessionStorage.getItem('duckdb-session');
      if (hasActiveSession === 'true' && globalDB && globalConnection) {
        set({
          db: globalDB,
          connection: globalConnection,
          isInitialized: true,
          error: null
        });
        return;
      }

      const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

      const worker_url = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker!}");`], { type: 'text/javascript' })
      );

      const worker = new Worker(worker_url);
      const logger = new duckdb.ConsoleLogger();
      const db = new duckdb.AsyncDuckDB(logger, worker);
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
      URL.revokeObjectURL(worker_url);

      // Create connection
      const connection = await db.connect();

      // Initialize data
      const serverUrl = import.meta.env.DEV 
        ? "http://localhost:4321" 
        : "https://visualization-project.pages.dev";

      await connection.insertCSVFromPath(`${serverUrl}/data.csv`, {
        name: 'data',
        detect: true,
        header: true,
      });

      // Store the instances globally
      globalDB = db;
      globalConnection = connection;

      // Mark session as active
      sessionStorage.setItem('duckdb-session', 'true');

      // Update store with initialized instance
      set({
        db,
        connection,
        isInitialized: true,
        error: null
      });

    } catch (error) {
      sessionStorage.removeItem('duckdb-session');
      set({
        db: null,
        connection: null,
        isInitialized: false,
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  }

  async function executeQuery(queryString: string): Promise<Record<string, any>[] | Error> {
    let storeValue: DuckDBStore;
    subscribe(value => { storeValue = value; })();

    if (!storeValue.connection) {
      return new Error('DuckDB connection not initialized');
    }

    try {
      const result = await storeValue.connection.query(queryString);
      return result.toArray().map((row: any) => row.toJSON());
    } catch (error) {
      console.error("Error executing query:", error);
      return error instanceof Error ? error : new Error(String(error));
    }
  }

  // Cleanup function
  async function cleanup() {
    let storeValue: DuckDBStore;
    subscribe(value => { storeValue = value; })();

    if (storeValue.connection) {
      await storeValue.connection.close();
    }
    if (storeValue.db) {
      await storeValue.db.terminate();
    }

    // Clear session storage
    sessionStorage.removeItem('duckdb-session');
    globalDB = null;
    globalConnection = null;

    set({
      db: null,
      connection: null,
      isInitialized: false,
      error: null
    });
  }

  // Add event listener for page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      sessionStorage.removeItem('duckdb-session');
    });
  }

  return {
    subscribe,
    initialize,
    executeQuery,
    cleanup
  };
};

// Create a singleton instance
export const duckDBStore = createDuckDBStore();