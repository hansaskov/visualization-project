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

	// Parse config when it changes
	$effect(() => {
		try {
			currentSpec = JSON.parse(configString);
			error = null; // Clear any previous error
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

	async function renderChart() {
		isLoading = true;
		error = null;

		try {
			const results = await duckDBStore.executeQuery(queryString);

			if (results instanceof Error) {
				throw results;
			}

			// Sanitize results to ensure they are cloneable
			const sanitizedResults = JSON.parse(JSON.stringify(results));

			// Sanitize currentSpec to remove any non-cloneable properties
			const sanitizedSpec = JSON.parse(JSON.stringify(currentSpec));

			const spec = {
				...sanitizedSpec,
				data: {
					values: sanitizedResults,
				},
			};

			console.log('Sanitized Spec:', spec); // Debug log
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

	onMount(() => {
		return () => {
			if (chartContainer) {
				chartContainer.innerHTML = '';
			}
		};
	});
</script>

<section>
	<div class="chart-container">
		{#if title}
			<h3 class="text-xl font-semibold mb-4">{title}</h3>
		{/if}

		{#if isLoading}
			<div class="loading">
				<p aria-busy="true">Loading visualization...</p>
			</div>
		{/if}

		{#if error}
			<div
				class="error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
			>
				<p>{error}</p>
			</div>
		{/if}

		<div bind:this={chartContainer} class="vega-container"></div>
	</div>
</section>

<style>
	.chart-container {
		width: 100%;
		margin: 1rem 0;
	}

	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 200px;
	}

	.vega-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		min-height: 400px;
	}

	.error {
		margin-top: 1rem;
	}
</style>
