<script lang="ts">
    import type { AsyncDuckDB, AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
    import { createDuckDB, createDuckDBConnection, executeQuery } from "../queries/duckdb";
    import { queries, type QuerySelection } from "../queries/queries";
    import embed, { type VisualizationSpec } from "vega-embed";
    import { onMount } from "svelte";


    let db: AsyncDuckDB | null = null;
    let c: AsyncDuckDBConnection | null = null;
    let isLoading = true;
    let selected: QuerySelection = queries[0];

    let queryString = selected.duckdbQuery;
    let configString = selected.vegaLiteQuery;

    let results: Record<string, any>[] | Error = [];
    let showTable = false;


    async function runQueryAndVisualize() {
        if (!c) {
            return
        }

        results = await executeQuery(c, queryString);
        showTable = results instanceof Error || (results && results.length > 0);

        if (results && !(results instanceof Error) && configString)  {
            try {
                const spec: VisualizationSpec = JSON.parse(configString);
                spec.data = { values: results };
                embed("#vis", spec, { width: 400, height: 200 });
            } catch (error) {
                console.error("Error parsing Vega-Lite config:", error);
                results = error as Error;
            }
        }
    }

    function updateForm() {
        queryString = selected.duckdbQuery;
        configString = selected.vegaLiteQuery;
    }


    onMount(async () => {
        try {
            db = await createDuckDB();
            c = await createDuckDBConnection(db);
            isLoading = false;
        } catch (error) {
            console.error("Error initializing DuckDB:", error);
            results = error as Error;
            showTable = true;
            isLoading = false;
        }
    });

</script>

<section>
    <h1 >Visualization Playground</h1>

    {#if isLoading}
    <p aria-busy="true">Loading DuckDB...</p>
    {:else}
    <form on:submit|preventDefault={runQueryAndVisualize}>
        <select bind:value={selected} name="Quick select a predefined query" on:change={updateForm}>
            {#each queries as query}
                <option value={query}>{query.name}</option>
            {/each}
        </select>
        <fieldset>
            <label
                >DuckDB Query:
                <textarea rows="15" bind:value={queryString}/>
            </label>

            <label for="config"
                >Vega-Lite Config:
                <textarea rows="15" bind:value={configString}/>
            </label>
        </fieldset>
        <button>Run & Visualize</button>
    </form>
   

    {#if showTable}
        {#if results instanceof Error}
            <div >{results.message} </div>
        {:else if results.length > 0}
            {#if results.length <= 1000}
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                {#each Object.keys(results[0]) as header}
                                    <th>{header}</th>
                                {/each}
                            </tr>
                        </thead>
                        <tbody>
                            {#each results as result}
                                <tr>
                                    {#each Object.keys(result) as key}
                                        <td>{result[key]}</td>
                                    {/each}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else}
                <div class="alert">
                    Table size is {results.length} which exceeds the maximum length
                    of 1000. Please select a smaller table to visualize it.
                </div>
            {/if}
            <div id="vis"></div>
        {:else}
            <div class="alert">
                No results to display. Execute a query to see results.
            </div>
        {/if}
    {/if}
    {/if}
</section>

<style>
    div:has(table) {
        overflow-x: auto;
        overflow-y: auto;
        height: 40rem;
        -webkit-overflow-scrolling: touch;
    }

    fieldset {
        display: grid;
        grid-template-columns: 2fr;
        gap: 1rem;
    }

    @media (min-width: 768px) {
        fieldset {
            grid-template-columns: 1fr 2fr;
        }
    }

    textarea {
        width: 100%;
        font-family: monospace;
        font-size: medium;
    }
</style>
