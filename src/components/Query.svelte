<script lang="ts">
    import { executeQuery } from "../queries/select";
    let results: Record<string, any>[] | Error = [];
    let queryString: string = `
FROM data
SELECT *
LIMIT 10
    `.trim();

    async function setRes() {
        results = await executeQuery(queryString);
    }
</script>

<form on:submit|preventDefault={setRes}>
    <label for="query-input">Enter your DuckDB query</label>
    <textarea
        id="query-input"
        rows="5"
        bind:value={queryString}
        placeholder="Enter your SQL query here"
    ></textarea>
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
        <p>Table size is {results.length} which exceeds the maximum length of 1000. Please select a smaller table to visualize it</p>
    {:else}
        <p>No results to display. Execute a query to see results.</p>
    {/if}
</section>

<style>
    section:has(table) {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    textarea {
        font-family: monospace;
    }
</style>
