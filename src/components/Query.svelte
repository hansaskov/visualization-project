<script lang="ts">
    import { getAll } from "../queries/select";
    let results: any[] = [];
    let input: number;
    async function setRes() {
        results = await getAll(input);
    }
</script>

<form on:submit|preventDefault={setRes}>
    <label>
        Select amount
        <!-- svelte-ignore a11y-no-redundant-roles -->
        <fieldset role="group">
            <input
                name="select_amount"
                placeholder="Select Amount"
                type="number"
                bind:value={input}
            />
            <input type="submit" value="Submit" />
        </fieldset>
    </label>
</form>

<section>
    <table>
        <thead>
          <tr>
            {#if results.length > 0}
              {#each Object.keys(results[0]) as header}
                <th scope="col">{header}</th>
              {/each}
            {/if}
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
</section>

<style>
    section:has(table) {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
</style>