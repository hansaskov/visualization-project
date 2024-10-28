<script lang="ts">
    import type {
        AsyncDuckDB,
        AsyncDuckDBConnection,
    } from "@duckdb/duckdb-wasm";
    import {
        createDuckDB,
        createDuckDBConnection,
        executeQuery,
    } from "../queries/duckdb";
    import { queries, type QuerySelection } from "../queries/queries";
    import embed, { type VisualizationSpec } from "vega-embed";
    import CodeMirror from "./CodeMirror.svelte";
    import { onMount } from "svelte";
    import {queryStringStore} from '../store/store.ts'


    let db: AsyncDuckDB | null = null;
    let c: AsyncDuckDBConnection | null = null;
    let isLoading = true;
    let lastSelected: QuerySelection|undefined = queries.find((query) => query.name === sessionStorage.getItem('selectedQuery'));
    let selected: QuerySelection = lastSelected !== undefined ? lastSelected : queries[0];

    
    let queryString = sessionStorage.getItem('workingQuerySQL')? 
    sessionStorage.getItem('workingQuerySQL') : selected.duckdbQuery;
    let configString = sessionStorage.getItem('workingConfigString')?
    sessionStorage.getItem('workingConfigString'):selected.vegaLiteQuery;

    let results: Record<string, any>[] | Error = [];
    let showTable = false;

    queryStringStore.subscribe(value => {
        if(!c){
            return;
        }
        queryString = value;
    });

    async function runQueryAndVisualize() {
        if (!c) {
            results = new Error(
                "Failed to use db connection when running query",
            );
            return;
        }

        results = await executeQuery(c, queryString!);
        showTable = results instanceof Error || (results && results.length > 0);

        if (results && !(results instanceof Error) && configString) {
            try {
                const spec: VisualizationSpec = JSON.parse(configString);
                spec.data = { values: results };
                embed("#vis", spec, { width: 800, height: 400 });
            } catch (error) {
                console.error("Error parsing Vega-Lite config:", error);
                results = error as Error;
            }
        }
    }


    async function cache(query: string | null, cacheName: string ) {
        if (!query) {
            sessionStorage.removeItem(cacheName)
            return;
        }
        sessionStorage.setItem(cacheName, query);
    }

    function updateForm() {
        queryString = selected.duckdbQuery;
        configString = selected.vegaLiteQuery;

        sessionStorage.setItem('workingQuerySQL', queryString);
        sessionStorage.setItem('workingConfigString', configString);
        sessionStorage.setItem('selectedQuery', selected.name);
        lastSelected = selected;
    }

    // Code will when the component is mounted into the dom. So it will only run once.
    onMount(async () => {
        try {
            db = await createDuckDB();
            c = await createDuckDBConnection(db);
            isLoading = false;
            if(sessionStorage.getItem('workingQuerySQL')){
                queryString = sessionStorage.getItem('workingQuerySQL');
            }
            if(sessionStorage.getItem('workingConfigString')){
                configString = sessionStorage.getItem('workingConfigString');
            }
        } catch (error) {
            console.error("Error initializing DuckDB:", error);
            results = error as Error;
            showTable = true;
            isLoading = false;
        }
    });

</script>

<section>
    <h1>Visualization Playground</h1>
    {#if isLoading}
        <p aria-busy="true">Loading DuckDB...</p>
    {/if}
        <form 
            on:submit|preventDefault={runQueryAndVisualize}
        >
            <select
                bind:value={selected}
                name="Quick select a predefined query"
                on:change={updateForm}
            >
                {#each queries as query}
                    <option value={query}>{query.name}</option>
                {/each}
            </select>
            <fieldset>
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label
                    >DuckDB Query:
                    <!-- <textarea rows="15" bind:value={queryString}  on:change={cashe(queryString,'workingQuerySQL')}/> -->
                    <CodeMirror bind:value={queryString} on:change={() => cache(queryString,'workingQuerySQL')}/>
                </label>

                <label for="config"
                    >Vega-Lite Config:
                    <textarea rows="15" bind:value={configString} on:change={() => cache(configString, 'workingConfigString')}/>
                </label>
            </fieldset>
                <button disabled={isLoading}>Run & Visualize</button>
        </form>
        {#if !isLoading}
        {#if showTable}
            {#if results instanceof Error}
                <div>{results.message}</div>
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
                        Table size is {results.length} which exceeds the maximum
                        length of 1000. Please select a smaller table to visualize
                        it.
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
