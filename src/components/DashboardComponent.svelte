<script lang="ts">
	import { onMount } from 'svelte';
	import { duckDBStore } from '../store/duckdbstore';
	import { queries } from '../queries/queries';
	import VegaLiteChart from './VegaLiteChart.svelte';

	let status = {
		isInitialized: false,
		isNewInstance: true,
		isLoading: true,
		error: null as Error | null,
	};

	// Create references to specific queries up front
	const regionalSalesQuery = queries.find(
		(q) => q.name === '7. Pie chart of total Games sold by region',
	);
	const genreTrendsQuery = queries.find(
		(q) => q.name === 'Sales percentage over time grouped by genre',
	);
	const platformTrendsQuery = queries.find(
		(q) => q.name === 'Sales percentage over time grouped by platform',
	);
	const criticsScoreQuery = queries.find(
		(q) => q.name === 'Critics vs user score compared by genre over time',
	);

	duckDBStore.subscribe((state) => {
		status.isInitialized = state.isInitialized;
		status.isLoading = !state.isInitialized;
		status.error = state.error;
	});

	onMount(async () => {
		try {
			const wasInitialized = status.isInitialized;
			await duckDBStore.initialize();
			status.isNewInstance = !wasInitialized;
		} catch (error) {
			console.error('Error in Dashboard:', error);
			status.error = error instanceof Error ? error : new Error(String(error));
		} finally {
			status.isLoading = false;
		}
	});

	function sanitizeData(data: any) {
		try {
			// Remove problematic properties or non-cloneable structures
			return JSON.parse(JSON.stringify(data));
		} catch (err) {
			console.error('Error sanitizing data:', err);
			return [];
		}
	}
</script>

<section class="dashboard">
	<h1>Video Games Sales Analysis Dashboard</h1>

	{#if status.isLoading}
		<div class="alert">
			<p aria-busy="true">Initializing DuckDB...</p>
		</div>
	{:else if status.error}
		<div class="alert alert-error">
			<p>Error: {status.error.message}</p>
		</div>
	{:else}
		<div class="alert alert-success">
			<h3>DuckDB Status:</h3>
			<p>
				{#if status.isNewInstance}
					✨ New DuckDB instance created and ready
				{:else}
					♻️ Using existing DuckDB instance
				{/if}
			</p>
		</div>

		<div class="dashboard-content">
			{#if regionalSalesQuery}
				<section class="mb-8">
					<h2 class="text-2xl font-bold mb-4">Regional Sales Distribution</h2>
					<VegaLiteChart
						queryString={regionalSalesQuery.duckdbQuery}
						configString={sanitizeData(regionalSalesQuery.vegaLiteQuery)}
						title="Sales Distribution by Region"
					/>
					<p class="mt-4 text-gray-700">
						This visualization shows how video game sales are distributed across
						different regions globally.
					</p>
				</section>
			{/if}

			{#if genreTrendsQuery}
				<section class="mb-8">
					<h2 class="text-2xl font-bold mb-4">Genre Performance Trends</h2>
					<VegaLiteChart
						queryString={genreTrendsQuery.duckdbQuery}
						configString={sanitizeData(genreTrendsQuery.vegaLiteQuery)}
						title="Genre Market Share Evolution"
					/>
					<p class="mt-4 text-gray-700">
						Track how different game genres have performed over time, showing
						market share changes and trends.
					</p>
				</section>
			{/if}

			{#if platformTrendsQuery}
				<section class="mb-8">
					<h2 class="text-2xl font-bold mb-4">Platform Market Analysis</h2>
					<VegaLiteChart
						queryString={platformTrendsQuery.duckdbQuery}
						configString={sanitizeData(platformTrendsQuery.vegaLiteQuery)}
						title="Platform Market Share Evolution"
					/>
					<p class="mt-4 text-gray-700">
						Explore the evolution of gaming platforms and their market share
						over time.
					</p>
				</section>
			{/if}

			{#if criticsScoreQuery}
				<section class="mb-8">
					<h2 class="text-2xl font-bold mb-4">Critical Reception Analysis</h2>
					<VegaLiteChart
						queryString={criticsScoreQuery.duckdbQuery}
						configString={sanitizeData(criticsScoreQuery.vegaLiteQuery)}
						title="Critic vs User Scores Comparison"
					/>
					<p class="mt-4 text-gray-700">
						Compare critic and user scores across different genres and time
						periods.
					</p>
				</section>
			{/if}
		</div>
	{/if}
</section>

<style>
	.dashboard {
		padding: 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.alert {
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

	.alert-success {
		background-color: #4b6959;
		border: 1px solid #34d399;
	}

	.alert-error {
		background-color: #f8fafc;
		border: 1px solid #f87171;
	}

	.dashboard-content {
		margin-top: 2rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 1.5rem;
	}

	h2 {
		color: #f8fafc;
	}

	h3 {
		color: #f8fafc;
		font-weight: 600;
	}

	p {
		color: #cbd5e1;
	}

	section {
		margin-bottom: 2rem;
	}
</style>
