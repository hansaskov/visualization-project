<script lang="ts">
	import { queries, type QuerySelection } from '../queries/queries';
	import embed, { type VisualizationSpec } from 'vega-embed';
	import CodeMirror from './CodeMirror.svelte';
	import { onMount } from 'svelte';
	import { queryStringStore } from '../store/store.ts';
	import { duckDBStore } from '../store/duckdbstore.ts';

	let isLoading = true;
	let lastSelected: QuerySelection | undefined = queries.find(
		(query) => query.name === sessionStorage.getItem('selectedQuery'),
	);
	let selected: QuerySelection =
		lastSelected !== undefined ? lastSelected : queries[0];

	let queryString = sessionStorage.getItem('workingQuerySQL')
		? sessionStorage.getItem('workingQuerySQL')
		: selected.duckdbQuery;
	let configString = sessionStorage.getItem('workingConfigString')
		? sessionStorage.getItem('workingConfigString')
		: selected.vegaLiteQuery;

	let results: Record<string, any>[] | Error = [];
	let showTable = false;

	// Subscribe to both stores
	queryStringStore.subscribe((value) => {
		queryString = value;
	});

	let dbState: any;
	duckDBStore.subscribe((state) => {
		dbState = state;
		isLoading = !state.isInitialized;
	});

	async function runQueryAndVisualize() {
		if (!dbState.isInitialized) {
			results = new Error('DuckDB is not initialized');
			return;
		}

		results = await duckDBStore.executeQuery(queryString!);
		showTable = results instanceof Error || (results && results.length > 0);

		if (results && !(results instanceof Error) && configString) {
			try {
				const spec: VisualizationSpec = JSON.parse(configString);
				spec.data = { values: results };
				embed('#vis', spec, { width: 800, height: 400 });
			} catch (error) {
				console.error('Error parsing Vega-Lite config:', error);
				results = error as Error;
			}
		}
	}

	async function cache(query: string | null, cacheName: string) {
		if (!query) {
			sessionStorage.removeItem(cacheName);
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

	onMount(async () => {
		try {
			await duckDBStore.initialize();
			if (sessionStorage.getItem('workingQuerySQL')) {
				queryString = sessionStorage.getItem('workingQuerySQL');
			}
			if (sessionStorage.getItem('workingConfigString')) {
				configString = sessionStorage.getItem('workingConfigString');
			}
		} catch (error) {
			console.error('Error initializing DuckDB:', error);
			results = error as Error;
			showTable = true;
		}
	});
</script>

<section>
	<h1>Visualization Playground</h1>
	{#if isLoading}
		<p aria-busy="true">Loading DuckDB...</p>
	{/if}
	<form on:submit|preventDefault={runQueryAndVisualize}>
		<select
			bind:value={selected}
			name="Quick select a predefined query"
			on:change={updateForm}
		>
			{#each queries as query}
				<option value={query}>{query.name}</option>
			{/each}
		</select>
		<fieldset class="grid grid-cols-1 md:grid-cols-2 gap-2">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label
				>DuckDB Query:
				<CodeMirror
					bind:value={queryString}
					on:change={() => cache(queryString, 'workingQuerySQL')}
				/>
			</label>

			<label for="config"
				>Vega-Lite Config:
				<textarea
					class="h-full p-4"
					rows="15"
					bind:value={configString}
					on:change={() => cache(configString, 'workingConfigString')}
				></textarea>
			</label>
		</fieldset>
		<div class="mt-4">
			<button class="mt-4" disabled={isLoading}>Run & Visualize</button>
		</div>
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
						Table size is {results.length} which exceeds the maximum length of 1000.
						Please select a smaller table to visualize it.
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
		height: auto;
		max-height: 40rem;
		-webkit-overflow-scrolling: touch;
	}

	textarea {
		width: 100%;
		font-family: monospace;
		font-size: medium;
	}
</style>
