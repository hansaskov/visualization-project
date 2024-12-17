<script lang="ts">
	import VegaLiteChart from '../VegaLiteChart.svelte';

	export let query: {
		duckdbQuery: string;
		vegaLiteQuery: string;
	};
	export let title: string;

	function sanitizeData(data: any) {
		try {
			return JSON.parse(JSON.stringify(data));
		} catch (err) {
			console.error('Error sanitizing data:', err);
			return [];
		}
	}
</script>

<div class="chart-wrapper">
	<slot name="pre-chart" />
	<div class="chart-container">
		<VegaLiteChart
			queryString={query.duckdbQuery}
			configString={sanitizeData(query.vegaLiteQuery)}
			{title}
		/>
	</div>
	<slot name="post-chart" />
</div>

<style>
	.chart-wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.chart-container {
		border-radius: 0.5rem;
		overflow: hidden;
	}
</style> 