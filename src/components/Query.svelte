<script lang="ts">
    import { executeQuery } from "../queries/select";
    import embed, { type VisualizationSpec } from "vega-embed";

    let queryString = 
    `SELECT genre, SUM("Global_Sales") AS total_sales
FROM data
GROUP BY genre
ORDER BY total_sales DESC
LIMIT 50`;

    let configString = 
`{
    "mark": "bar",
    "encoding": {
        "x": {"field": "Genre", "type": "nominal", "sort": "-y", "title":"Genre"},
        "y": {"field": "total_sales", "type": "quantitative", "title":"Total Sales"}
    }
}`;

    let results: Record<string, any>[] | Error = [];
    let showTable = false;

    async function runQueryAndVisualize() {
        results = await executeQuery(queryString);
        showTable = results instanceof Error || (results && results.length > 0);

        if (results && !(results instanceof Error)) {
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
</script>

<section>
    <h1 class="text-center">DuckDB & Vega-Lite Explorer</h1>

    <form on:submit|preventDefault={runQueryAndVisualize}>
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
            <div class="alert alert-red">{results.message}</div>
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
