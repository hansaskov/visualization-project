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

{#each results as result}
    {result.Name}
{/each}

