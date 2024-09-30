<script lang="ts">
    import { executeQuery } from "../queries/select";
    import type  {VisualizationSpec } from 'vega-embed';
    let results: Record<string, any>[] | Error = [];
    let queryString: string = `
SELECT genre, SUM("Global_Sales") AS total_sales
FROM data
GROUP BY genre
ORDER BY total_sales DESC
LIMIT 50
    `.trim();

    let configString: VisualizationSpec = ""

    async function setRes() {
        results = await executeQuery(queryString);
    }
</script>

<form on:submit|preventDefault={setRes}>
    <fieldset>
        <label
            >Enter your DuckDB query
            <textarea
                rows="5"
                bind:value={queryString}
                placeholder="Enter your SQL query here"
            ></textarea>
        </label>
        <label
            >Enter Vega-lite config without the data attribute
            <textarea
                rows="5"
                bind:value={configString}
                placeholder="Enter your vega-lite config here"
            ></textarea>
        </label>
    </fieldset>
    <button type="submit">Execute Query</button>
</form>

<section>
    {#if results instanceof Error}
        {results.message}
    {:else if results.length > 0 && results.length <= 1000}
        <table>
            <thead>
                <tr>
                    {#each Object.keys(results[0]) as header}
                        <th scope="col">{header}</th>
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
    {:else if results.length > 1000}
        <p>
            Table size is {results.length} which exceeds the maximum length of 1000.
            Please select a smaller table to visualize it
        </p>
    {:else}
        <p>No results to display. Execute a query to see results.</p>
    {/if}
</section>

<style>
    form > fieldset {
        display: flex;
        gap: 1rem; /* Controls the spacing between the text areas */
        justify-content: space-between; /* Ensure the text areas are evenly spaced */
        align-items: flex-start; /* Align the text areas at the top */
        width: 100%; /* Make sure the fieldset takes up the full width */
    }

    form > fieldset > label {
        flex: 1; /* Allow each textarea to take up equal space */
    }

    section:has(table) {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    textarea {
        font-family: monospace;
    }
</style>
