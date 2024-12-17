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
			<div
				class="intro bg-[rgba(255,255,255,0.05)] rounded-lg shadow-lg p-8 border-0"
			>
				<h2 class="text-2xl font-bold text-slate-100 mb-4">
					Welcome to the Video Game Sales Analysis Dashboard
				</h2>
				<p class="text-slate-300 mb-4">
					This interactive dashboard provides comprehensive insights
					into video game sales data across different genres,
					publishers, and regions. Our analysis focuses on key metrics
					including global sales figures, regional performance, and
					market trends over time.
				</p>
				<p class="text-slate-300 mb-2">
					The visualizations below will help you explore:
				</p>
				<ul class="list-disc list-inside text-slate-300 mb-4 space-y-1 ml-6">
					<li>Top performing game genres and publishers</li>
					<li>Sales distribution across different regions</li>
					<li>Historical sales trends and patterns</li>
					<li>Market share analysis</li>
				</ul>
				<p class="text-slate-300">
					Use the interactive charts and filters to drill down into
					specific aspects of the video game industry's sales
					performance. Each visualization is accompanied by detailed
					descriptions of the insights and methodology used.
				</p>
				<p class="text-slate-300">
					The developers of this dashboard are Hans Askov, Michael Pedersen and Sandra ... <br>
					You can find the source code for this dashboard <a href="https://github.com/hansaskov/videogamesales" class="text-blue-500">here</a>.

				</p>
			</div>

			<!-- 2. TOP 10 PUBLISHERS -->
			<VisualizationSection queryName="Top 10 publishers">
				<VisTitle
					slot="title"
					title="Top 10 Publishers by Global Sales"
				>
					<p class="subtitle">
						Electronic Arts leads the gaming industry with
						approximately 850 million units in global sales, closely
						followed by Nintendo at around 840 million units.
						There's a significant drop to the third-place Activision
						with roughly 530 million units, while the remaining
						publishers show a gradual decline from Sony's 380
						million to Konami's 140 million units in sales.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						This visualization implements several statistical design
						principles: The bars are arranged in descending order to
						facilitate quick ranking comprehension, while the
						consistent width and spacing maintain visual clarity.
						The y-axis begins at zero to prevent visual distortion
						of the differences between publishers. The steelblue
						color provides sufficient contrast while remaining
						visually comfortable for extended viewing. Subtle
						gridlines aid in accurate value estimation without
						overwhelming the primary data. The aspect ratio allows
						for clear distinction between similar values
						(particularly important for the EA-Nintendo comparison)
						while maintaining readable publisher labels. The chart's
						width-to-height ratio optimizes the visual perception of
						the approximately 6:1 ratio between the highest and
						lowest values.
					</p>
				</VisDescription>
			</VisualizationSection>

			<VisualizationSection queryName="Top 10 genres by global sales">
				<VisTitle slot="title" title="Top 10 Genres by Global Sales">
					<p class="subtitle">
						Action games dominate the gaming market with approximately 1,200 million units in global sales, 
						followed by Sports and Shooter genres each reaching around 800 million units. Role-Playing and 
						Racing genres show moderate performance with about 500 million units each, while Adventure 
						games have the lowest sales at roughly 100 million units.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						This bar chart implements several statistical visualization principles: The bars are arranged 
						in descending order to facilitate immediate comprehension of genre rankings. The y-axis starts 
						at zero to ensure accurate proportional comparisons, particularly important given the large 
						range between Action (1,200M) and Adventure (100M) genres. The consistent steelblue color 
						scheme maintains visual clarity while reducing eye strain. Light horizontal gridlines aid in 
						value estimation without dominating the visualization. The chart's proportions are optimized 
						to clearly show the dramatic drop from the leading Action genre to the subsequent tiers of 
						genres, while maintaining legible labels and comfortable spacing between bars.
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

			<!-- 9. HEATMAP GENRE SALES BY PLATFORM -->
			<VisualizationSection
				queryName="9. Which genres sells the best on different platforms"
			>
				<VisTitle slot="title" title="Comparing game sales between platforms and genres">
					<p class="subtitle">
						missing
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						write here
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
				<VisTitle slot="title" title="Graphing critic reviews with user reviews">
					<p class="subtitle">
						The following graph plots the average critic and user reviews together grouped by game genre for each year. 
						The values can range from 0-10, but most values range from 6-8, which is the default range.
						A line can be seen in the middle of the graph. This is the line of agreement. If you are directly on the line, then the critics and users are in agreement with each other. 
						But if the point is above this line then users are more positive of the genre, and below the line then the critics are more positive. 
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						The points are sized by how many releases there have been for each category this year. This is helpful as it gives the user enough context to allow comparing between the years. 
						The genres do have different colors, but the effectiveness is limited, due to having too many colors. 
					</p>
				</VisDescription>
			</VisualizationSection>

			<VisualizationSection
			queryName="10. Critics vs user score difference"
		>
			<VisTitle slot="title" title="Showing the disagreement between critics and users over time">
				<p class="subtitle">
					In the following graph you are able to use the slider to select the year. 
					In the mid 2000s, it is the users who are more positive in their reviews. Where the reviewers generally give a lower score. 
					Later on, this sentiment flips and the reviewers start to become more positive in their reviews as compared to the users.  
				</p>
			</VisTitle>
			<VisDescription slot="description">
				<p>
					A deviation chart was used to more clearly show the agreement and disagreement between user and reviewers. 
					We color the negative values of our deviation chart, To emphesize the negative values. 
					We also have a Title and subtitle for a clear understanding of the message. 
				</p>
			</VisDescription>
		</VisualizationSection>


		<VisualizationSection
			queryName="13. evolution in age rating"
		>
			<VisTitle slot="title" title="Evolution in Age Ratings for Released Video Games Over Time">
				<p class="subtitle">
					This graph shows the evolution in Age Rating for video games released between 1985 and 2016.   
				</p>
			</VisTitle>
			<VisDescription slot="description">
				<p>
					TBA
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
