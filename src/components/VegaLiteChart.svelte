<script lang="ts">
	import { onMount } from 'svelte';
	import vegaEmbed from 'vega-embed';
	import { duckDBStore } from '../store/duckdbstore';

	// Props
	let { queryString, configString, title = '' } = $props();

	// Local state
	let chartContainer: HTMLElement;
	let error = $state<string | null>(null);
	let isLoading = $state(true);
	let currentSpec: any = $state(null);
	let dbInitialized = $state(false);

	// Subscribe to duckDB store changes
	duckDBStore.subscribe((state) => {
		dbInitialized = state.isInitialized;
	});

	async function renderChart() {
		isLoading = true;
		error = null;

		try {
			const results = await duckDBStore.executeQuery(queryString);

			if (results instanceof Error) {
				throw results;
			}

			const sanitizedResults = JSON.parse(JSON.stringify(results));
			const sanitizedSpec = JSON.parse(JSON.stringify(currentSpec));

			const spec = {
				...sanitizedSpec,
				data: {
					values: sanitizedResults,
				},
			};

			await vegaEmbed(chartContainer, spec, {
				actions: true,
				renderer: 'canvas',
				downloadFileName: 'visualization',
				theme: 'vox',
			});
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
			console.error('Chart error:', err);
		} finally {
			isLoading = false;
		}
	}

	// Parse config when it changes
	$effect(() => {
		try {
			currentSpec = JSON.parse(configString);
			error = null;
		} catch (err) {
			console.error('Error parsing config:', err);
			error = 'Invalid configuration';
		}
	});

	// Trigger chart render when dependencies change
	$effect(() => {
		if (chartContainer && currentSpec && dbInitialized) {
			renderChart();
		}
	});
</script>

<div bind:this={chartContainer} class="chart-wrapper"></div>

<style>
	.chart-wrapper {
		width: 100%;
		height: 100%;
	}
</style>