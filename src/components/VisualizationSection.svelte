<script lang="ts">
	import VegaLiteChart from './VegaLiteChart.svelte';
	import VisTitle from './visualization/VisTitle.svelte';
	import VisDescription from './visualization/VisDescription.svelte';
	import { queries, type QueryNames } from '../queries/queries';

	// This will provide type suggestions for all available queries
	export let queryName: QueryNames;

	// Get the query using our type guard
	$: query = queries.find(query => query.name === queryName);

	function sanitizeData(data: any) {
		try {
			return JSON.parse(JSON.stringify(data));
		} catch (err) {
			console.error('Error sanitizing data:', err);
			return [];
		}
	}
</script>

<section class="visualization-section">
	<slot name="title">
		{#if query}
			<VisTitle title={query.name} />
		{/if}
	</slot>
	
	<div class="chart-container">
		{#if query}
				<VegaLiteChart
					queryString={query.duckdbQuery}
					configString={sanitizeData(query.vegaLiteQuery)}
				/>
		{:else}
			<p class="error">Query not found: {queryName}</p>
		{/if}
	</div>
	
	<slot name="description">
		{#if query}
			<VisDescription />
		{/if}
	</slot>
	
	<slot />
</section>

<style>
	.visualization-section {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.chart-container {
		display: flex;
		width: auto;
		overflow: hidden;

	}

	.error {
		color: #ef4444;
		padding: 1rem;
		text-align: center;
	}
</style> 