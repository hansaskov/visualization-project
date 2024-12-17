<script lang="ts">
	import { onMount } from "svelte";
	import { duckDBStore } from "../store/duckdbstore";
	import VisualizationSection from "./VisualizationSection.svelte";
	import VisTitle from "./visualization/VisTitle.svelte";
	import VisDescription from "./visualization/VisDescription.svelte";

	let status = {
		isInitialized: false,
		isNewInstance: true,
		isLoading: true,
		error: null as Error | null,
	};

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
			console.error("Error in Dashboard:", error);
			status.error =
				error instanceof Error ? error : new Error(String(error));
		} finally {
			status.isLoading = false;
		}
	});
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
			<!-- 2. TOP 10 PUBLISHERS -->
			<VisualizationSection queryName="Top 10 publishers">
				<VisTitle
					slot="title"
					title="Top 10 Publishers by Global Sales"
				>
					<p class="subtitle">
						Highlighting the biggest contributors to global video
						game sales
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						This chart showcases the top 10 publishers ranked by
						their total global sales, providing insight into the
						dominance of major companies in the gaming industry.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 3. TOP PLATFORMS BY CRITIC SCORE -->
			<VisualizationSection queryName="Top 10 platforms by Critic Score">
				<VisTitle
					slot="title"
					title="Top Platforms by Average Critic Score"
				>
					<p class="subtitle">
						Platforms with the highest critical acclaim
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						This visualization ranks platforms by average critic
						scores, with circle sizes representing the number of
						games reviewed. It highlights platforms that
						consistently receive high praise.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 4. SALES OVER TIME BY GENRE -->
			<VisualizationSection
				queryName="Sales over time grouped by genre (AI)"
			>
				<VisTitle slot="title" title="Global Sales Over Time by Genre">
					<p class="subtitle">
						Trends of video game sales across genres over the years
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						This chart tracks total global sales over time, grouped
						by genre. It reveals the rise and fall of different
						genres' popularity in the market.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 5. BOX PLOT GLOBAL SALES -->
			<VisualizationSection queryName="boksplot global sales vertical">
				<VisTitle slot="title" title="Distribution of Global Sales">
					<p class="subtitle">
						Exploring the spread and outliers of global sales
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						This boxplot captures the distribution of global sales,
						emphasizing the range, median, and outliers. It
						highlights the dominance of a few top-selling games.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 6. BOX PLOT USER VS CRITIC SCORE -->
			<VisualizationSection
				queryName="Boksplot criticscore and userscore"
			>
				<VisTitle
					slot="title"
					title="User Score vs Critic Score Distribution"
				>
					<p class="subtitle">
						Comparing user and critic score distributions
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						This visualization contrasts critic scores and
						normalized user scores, providing insights into score
						variability and consistency across both metrics.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 7. TOP GENRES PIE CHART -->
			<VisualizationSection
				queryName="Top 5 most popular genres by sales"
			>
				<VisTitle slot="title" title="Top 5 Genres by Global Sales">
					<p class="subtitle">
						A focused view on the most successful video game genres
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						The pie chart highlights the top 5 video game genres
						based on global sales, while grouping the remaining
						genres under 'Others'. It helps identify market-leading
						genres.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 8. SALES BY REGION PIE CHART -->
			<VisualizationSection
				queryName="7. Pie chart of total Games sold by region"
			>
				<VisTitle slot="title" title="Global Market Distribution">
					<p class="subtitle">
						Analysis of video game sales across different regions
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						This visualization breaks down video game sales across
						global regions, highlighting market dominance and
						regional preferences in the gaming industry.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 9. HEATMAP GENRE SALES BY REGION -->
			<VisualizationSection
				queryName="Game Sales Heatmap by Genre and Region"
			>
				<VisTitle slot="title" title="Game Sales by Genre and Region">
					<p class="subtitle">
						A heatmap of regional preferences for video game genres
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						This heatmap displays the percentage of total sales for
						each genre across regions. It highlights regional
						preferences and dominant genres globally.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 10. MARKET SHARE BY GENRE OVER TIME -->
			<VisualizationSection
				queryName="Sales percentage over time grouped by genre"
			>
				<VisTitle slot="title" title="Market Share Over Time by Genre">
					<p class="subtitle">
						Analyzing genre dominance over the years
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						This area chart visualizes the changing market share of
						video game genres over time, revealing trends and shifts
						in player preferences.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 11. MARKET SHARE BY PLATFORM OVER TIME -->
			<VisualizationSection
				queryName="Sales percentage over time grouped by platform"
			>
				<VisTitle
					slot="title"
					title="Market Share Over Time by Platform"
				>
					<p class="subtitle">
						The evolution of gaming platforms’ market dominance
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						This visualization highlights the market share of gaming
						platforms over time, showcasing the rise and decline of
						platforms in the gaming ecosystem.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 12. CRITIC VS USER SCORE OVER TIME -->
			<VisualizationSection
				queryName="Critics vs user score compared by genre over time"
			>
				<VisTitle slot="title" title="Critic vs User Scores Over Time">
					<p class="subtitle">
						Examining agreement between critics and users across
						genres
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						This scatter plot compares average critic and user
						scores by genre, highlighting trends and agreements in
						video game reception over the years.
					</p>
				</VisDescription>
			</VisualizationSection>

			<VisualizationSection
			queryName="10. Critics vs user score difference"
		>
			<VisTitle slot="title" title="Critic vs User Scores Over Time">
				<p class="subtitle">
					Examining agreement between critics and users across
					genres
				</p>
			</VisTitle>
			<VisDescription slot="description">
				<p>
					This scatter plot compares average critic and user
					scores by genre, highlighting trends and agreements in
					video game reception over the years.
				</p>
			</VisDescription>
		</VisualizationSection>
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
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 600px), 1fr));
	}

	.subtitle {
		color: #94a3b8;
		font-size: 0.9rem;
		margin-top: 0.25rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 1.5rem;
		color: #f8fafc;
	}

	h3 {
		color: #f8fafc;
		font-weight: 600;
	}

	p {
		color: #cbd5e1;
	}
</style>
