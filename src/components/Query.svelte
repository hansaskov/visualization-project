<script lang="ts">
    import { executeQuery } from "../queries/select";
    import embed, { type VisualizationSpec } from 'vega-embed';

    let queryString = 
`SELECT genre, SUM("Global_Sales") AS total_sales
FROM data
GROUP BY genre
ORDER BY total_sales DESC
LIMIT 50`;

    let configString = 
`{
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "A bar chart showing total sales by video game genre.",
    "mark": "bar",
    "encoding": {
        "x": {"field": "Genre", "type": "nominal", "sort": "-y", "title":"Genre"},
        "y": {"field": "total_sales", "type": "quantitative", "title":"Total Sales"},
        "tooltip": [
        {"field": "Genre", "type": "nominal"},
        {"field": "total_sales", "type": "quantitative", "format": ".2f"}
        ]
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
                embed('#vis', spec, {width: 400, height: 200});
            } catch (error) {
                console.error("Error parsing Vega-Lite config:", error);
                results = error as Error; 
            }
        }
    }
</script>

<section >
    <h1 class="text-center">DuckDB & Vega-Lite Explorer</h1>

    <div class="grid">
        <div>
            <label for="query">DuckDB Query:</label>
            <textarea id="query" rows="15" bind:value={queryString}></textarea>
        </div>
        <div>
            <label for="config">Vega-Lite Config:</label>
            <textarea id="config" rows="15" bind:value={configString}></textarea>
        </div>
    </div>

    <button class="contrast" on:click={runQueryAndVisualize}>Run & Visualize</button>

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
                <div class="alert">Table size is {results.length} which exceeds the maximum length of 1000. Please select a smaller table to visualize it.</div>
            {/if}
            <div id="vis"></div>
        {:else}
            <div class="alert">No results to display. Execute a query to see results.</div>
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

    .grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 1rem;
    }

    textarea {
        width: 100%;
        font-family: monospace;
        font-size: medium;
    }
</style>