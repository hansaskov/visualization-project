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
					The developers of this dashboard are Hans Askov, Michael Pedersen and Sandra Malling-Larsen <br>
					You can find the source code for this dashboard <a href="https://github.com/hansaskov/videogamesales" class="text-blue-500">here</a>.

				</p>
			</div>

			<!-- 2. TOP 10 PUBLISHERS -->
			<VisualizationSection queryName="Top 10 publishers">
				<VisTitle slot="title" title="Top 10 Publishers by Global Sales">
					<p class="subtitle">
						Electronic Arts (EA) and Nintendo firmly control the upper echelons of the industry, each surpassing 800 million units sold worldwide (EA at roughly 850M and Nintendo at nearly 840M). Activision follows as the third major force with about 530M sales, creating a stark sales gulf between the leading duo and the rest. Sony, Ubisoft, and Take-Two occupy middle positions, each noticeably lower than Activision but still significant, while Konami, Sega, and THQ round out the list closer to the 140M mark, illustrating the strong consolidation of market power within just a few top publishers.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						The bar chart is purposefully arranged in descending order, ensuring that even at a glance, viewers immediately grasp the ranking and relative magnitudes of each publisher's total sales. A zero-baseline is employed so that the lengths of the bars accurately mirror true proportional differences. Each bar is spaced to avoid crowding and maintain legibility. Labels are angled to accommodate longer publisher names, preventing overlapping text. The choice of a cool steelblue bar color not only visually unifies the chart but also diminishes distractions, enabling viewers to concentrate on the data itself. Strategic axis scaling and gridlines emphasize the vast gap between the top three and the remaining publishers, highlighting market concentration and the noticeable decline in sales after Activision.
					</p>
				</VisDescription>
			</VisualizationSection>

			<VisualizationSection queryName="Top 10 genres by global sales">
				<VisTitle slot="title" title="Top 10 Genres by Global Sales">
					<p class="subtitle">
						Action games command an impressive lead with more than 1.2 billion units sold globally, dwarfing the second-place Sports and Shooter genres, each hovering around 800 million. Role-Playing and Racing fall in the mid-range with roughly 500 million sales apiece, while titles like Adventure and Puzzle linger toward the bottom of the top-ten list, at around 100 million units, underscoring just how wide the demand gap is among different game genres.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						Bars are sorted top-to-bottom to instantly convey which genres dominate and how far they outdistance the others. The y-axis begins at zero to safeguard a fair representation of relative magnitudes—crucial given the big jump from Action's 1.2B down to Adventure's ~100M. By maintaining consistent bar widths and color (steelblue), viewers remain focused on the variation in length, which is the principal data-carrying element. Light, minimal gridlines are introduced to give numeric context for intermediate values without creating a cluttered backdrop. The labels are sized for easy reading and placed just adjacent to each bar for quick reference, ensuring that the dramatic lead of Action over other genres is neither understated nor lost among visual distractions.
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
						When looking at platforms that have accumulated at least ten critic-reviewed games, Dreamcast emerges as the standout with the highest overall critic scores. PC follows closely behind, which underlines the deeply held sentiment among some professionals that PC gaming—often hailed for its flexibility in hardware choices and modding community—maintains a high bar for quality. Other platforms exhibit respectable averages, suggesting that well-received titles are not exclusive to a single ecosystem, though they may be diluted by a larger total library that includes critically panned games.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						The bar chart uses a truncated y-axis that does not start at zero but is carefully configured so that subtle score differences between platforms remain visible. Each platform label is rotated at an angle conducive to legibility, preventing overlapping text. The chart is sized at 800×400px so that the largest bars (e.g., Dreamcast and PC) remain clearly dominant, but the mid-range variations do not disappear. Tooltips contain supplementary details such as the exact numeric average and the total number of games that informed each platform's score, ensuring transparency about the sample size.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 4. SALES OVER TIME BY GENRE -->
			<VisualizationSection queryName="Sales over time grouped by genre (AI)">
				<VisTitle slot="title" title="Global Sales Over Time by Genre (AI-Generated)">
					<p class="subtitle">
						Spanning 1990 through 2016, this bubble chart reveals both the overarching popularity trajectory of each genre and the fluctuations in sales that occur year to year. Action games usually loom large throughout, signaling unwavering consumer interest, whereas some genres, such as Strategy or Adventure, occasionally see modest spikes in specific timeframes—indicating moments when fresh titles or technological innovations briefly boosted their visibility.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						Created with ChatGPT's assistance, this scatter plot uses bubble size to encode the total sales for each genre per year, layering a second dimension of data over the positional layout (time on the x-axis, genre on the y-axis). Color is assigned to each genre in a way that satisfies perceptual distinctiveness, avoiding color conflicts, and making it easy to differentiate the categories at a glance. The chart's 800×600px space promotes readability of both larger high-sales bubbles and smaller ones. Interactive tooltips provide the specific year and total sales, helping viewers delve deeper into any notable anomalies or trends.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 5. BOX PLOT GLOBAL SALES -->
			<VisualizationSection queryName="boksplot global sales vertical">
				<VisTitle slot="title" title="Distribution of Global Sales">
					<p class="subtitle">
						 A significant portion—roughly half—of all video games cluster between 110k and 755k units sold, illustrating a fairly modest sales level for the majority of titles. Yet a small cohort skyrockets into tens of millions, with Wii Sports reaching over 82 million copies. This disparity underscores the prevailing phenomenon where select blockbuster games dramatically skew the overall distribution and overshadow the medium-performing bulk of the market.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						 A vertical boxplot is used to make quartiles and outlier points immediately visible, focusing on the distribution's shape and concentration. The chart is sized at 600×400px, ensuring space for labeling and whiskers while keeping the main data range readable. The median line is rendered in contrasting white against a steelblue box, making the central tendency easy to spot. Outliers are indicated with specialized symbols or truncated if they exceed a certain threshold ("&lt;1" notation), preventing these extreme cases from compressing the scale and obscuring the distribution of the majority.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 6. BOX PLOT USER VS CRITIC SCORE -->
			<VisualizationSection queryName="Boksplot criticscore and userscore">
				<VisTitle slot="title" title="User Score vs Critic Score Distribution">
					<p class="subtitle">
						 Upon normalizing user scores to a 0-100 scale for direct comparison, we see a tangible drift where the median user score generally hovers slightly above that of critics, yet user ratings exhibit a broader spread from the lower extremes to the highest marks. This variation implies a tendency among consumers to reward personal preference more liberally, or in contrast, harshly penalize certain elements critics might overlook.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						 Two parallel boxplots (User vs. Critic) are placed side by side within a 400×500px layout, providing ample vertical space to emphasize differences in score distributions. Different but complementary color schemes designate each category—warm hues for user scores and cooler ones for critic scores—ensuring immediate distinction. As both scores largely occur in the 6–8 range, a non-zero y-axis (e.g., beginning around 5 or 6) enhances resolution for that tighter band. Median lines are intentionally stark (white) to highlight the central metric in each distribution.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 7. TOP GENRES PIE CHART -->
			<VisualizationSection queryName="Top 5 Genres by Global Sales">
				<VisTitle slot="title" title="Top 5 Genres by Global Sales">
					<p class="subtitle">
						 Together, the top five best-selling genres—headlined by Action games at nearly 30%—capture well over three-quarters of the global sales pie. Sports and Shooter make up substantial slices, followed by Role-Playing and Racing genres. Their collective dominance underscores both the industry's strategic pursuit of mainstream preferences and the potential for emerging developers to explore underrepresented niches outside these dominant categories.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						 A donut chart with a pronounced inner radius improves upon a basic pie chart by minimizing the optical illusion issues that arise when comparing different slices. The central hole is also a space where either a total sum or custom label could be placed. A balanced category10 color scheme is used so each genre slice is visually distinct. Hover interactions reveal both raw sales figures and percentages of the overall total, and a neatly positioned legend clarifies which slice belongs to which genre, offering redundancy in color-coding and textual labeling.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 8. SALES BY REGION PIE CHART -->
			<VisualizationSection queryName="7. Pie chart of total Games sold by region">
				<VisTitle slot="title" title="Global Market Distribution">
					<p class="subtitle">
						 North America and Europe collectively command well beyond half of the global gaming market, signifying a substantial consumer base and robust retail ecosystems. Japan remains an influential player, despite being notably smaller than NA and Europe in raw population terms. Meanwhile, the "Other" category, encompassing multiple continents, suggests room for future market expansions and underscores that demand for video games is neither static nor restricted solely to the most historically active regions.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						 This donut chart is constrained to a 500×400px canvas. The inner and outer radii (100px and 200px) create ample ring thickness to differentiate slices but still leave enough negative space for a clear visual partition between them. Each region is assigned a distinct hue in a category10 palette mapped by geography, such as green shades for North America and Europe, red or pink for Japan, etc. A thin white stroke (2px) separates slices, ensuring each segment's boundary is crisp. Tooltips pop up on hover to display absolute unit sales alongside the percentage for a robust part-to-whole perspective.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 9. HEATMAP GENRE SALES BY REGION -->
			<VisualizationSection queryName="Game Sales Heatmap by Genre and Region">
				<VisTitle slot="title" title="Game Sales by Genre and Region">
					<p class="subtitle">
						While Action games maintain impressive popularity globally, the heatmap highlights a remarkable local phenomenon: Role-Playing games thrive disproportionately well in Japan compared to their performance outside it. Shooter and Sports games, by contrast, experience massive success in North America and Europe but barely register in Japanese charts. Such discrepancies in taste point to the cultural influences and historical evolution of game consumption in each region.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						A 250×500px heatmap is engineered for compactness without sacrificing clarity. The chosen Viridis color palette systematically darkens or lightens with each step, assisting in the identification of even small percentage differences. Regions form the columns (labeled at a -45° tilt so they fit neatly), while genres are kept in a logical order running down the rows. Hovering a cell reveals the exact numeric breakdown or percentage, supporting data-driven comparisons instead of guesswork from shading alone.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 10. HEATMAP GENRE SALES BY PLATFORM -->
			<VisualizationSection queryName="9. Which genres sells the best on different platforms">
				<VisTitle slot="title" title="Comparing Game Sales Between Platforms and Genres">
					<p class="subtitle">
						Across most systems, Action titles remain top-sellers, reflecting their mass appeal. However, each console group still carries a signature genre: Nintendo's success with Platform-style games like Mario, Microsoft's attraction of shooter enthusiasts on Xbox, and Sony's consistent performance across multiple genres, including more niche categories like JRPGs—a testament to their multicultural library and partnerships.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						Once again using the Viridis palette, this heatmap normalizes sales by platform so that smaller or less globally distributed consoles can still be fairly compared to juggernauts. The 700×500px format leaves space for a legend explaining what each color gradient value represents. Platform labels are sorted by manufacturer group—e.g., all Nintendo platforms together, all PlayStation platforms together—while genres are sorted by total popularity, ensuring the viewer can discern cross-platform patterns or anomalies.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 11. MARKET SHARE OVER TIME BY GENRE -->
			<VisualizationSection queryName="Sales percentage over time grouped by genre">
				<VisTitle slot="title" title="Market Share Over Time by Genre">
					<p class="subtitle">
						Beginning in 1996, this line chart demonstrates the ebb and flow of each genre's portion of the industry's overall sales. Certain genres, such as Action, appear to sustain a leading share across decades, whereas others undergo periods of surging relevance—like Shooter games gaining traction in the 2000s. By allowing comparison of multiple lines simultaneously, viewers can see, for instance, how Sports maintain a relatively stable chunk of the market or how Racing games ascend and descend around major franchise releases.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						This interactive line chart is sized at 800×600px so each line's trend is discernible even when multiple genres are toggled. Colors from category10 differentiate each genre. The vertical axis employs percentages rather than raw unit numbers to level the playing field among categories with inherently different volumes. An interactive legend lets viewers focus on fewer lines at a time, clarifying how a genre's share evolves in isolation. The timeline starting from 1996 ensures more robust data and consistency in measurement methods.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 12. MARKET SHARE OVER TIME BY PLATFORM -->
			<VisualizationSection queryName="Sales percentage over time grouped by platform">
				<VisTitle slot="title" title="Market Share Over Time by Platform">
					<p class="subtitle">
						Following console generations through the decades, we observe cyclical rises and falls: early dominance by certain brands that later recede to niche status, and the consistent foothold of PC gaming as a stable alternative. Notable transitions occur with each new console generation from Sony (e.g., PS1 to PS2), Microsoft (Xbox to Xbox 360), and Nintendo (N64 to Wii), revealing how hardware improvements can recalibrate market share.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						By using a custom color scheme grouped by console manufacturer (shades of blue for PlayStation, greens for Xbox, purples for Nintendo, neutrals for PC/others), the chart underscores familial ties among platforms. The 3px stroke width balances visual prominence and prevents overlapping lines from merging into a single mass. Tooltips provide platform-specific data points, and toggles in the legend or an interactive check-box system allow for narrower focus. The uniform time range, starting at 1996, ensures consistency in generational comparisons and data availability.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 13. CRITIC VS USER REVIEWS SCATTER PLOT -->
			<VisualizationSection queryName="Critics vs user score compared by genre over time">
				<VisTitle slot="title" title="Graphing Critic Reviews with User Reviews">
					<p class="subtitle">
						 Placing critic scores on one axis and user scores on the other, this chart for each genre and year cluster suggests most games hover in the mid-to-high range of 6–8 out of 10, but with certain standout titles that garner universal acclaim (above the diagonal) or spark unusual disagreement (far below it). In the early-to-mid 2000s, user enthusiasm often exceeded critic evaluations, reflecting the novelty of certain console leaps or the abundance of crowd-pleasing sequels. However, in later years, critics occasionally outscore the user base, indicating shifts in how professional review criteria vs. fan reception intersect.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						 A scatter plot set at 800×400px provides enough horizontal width to show a timeline slider or genre filter along the bottom. Each point's size corresponds to the number of games being considered for that genre-year combination, offering immediate clues about how representative or niche the data is. A diagonal reference line (y = x) visually encodes perfect agreement. Color is assigned by genre, letting viewers see if certain genres (e.g., RPGs) exhibit consistently higher or lower user vs. critic agreement.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 14. CRITIC VS USER SCORE DIFFERENCE OVER TIME -->
			<VisualizationSection queryName="10. Critics vs user score difference">
				<VisTitle slot="title" title="Showing the Disagreement Between Critics and Users Over Time">
					<p class="subtitle">
						 This bar chart-based deviation approach highlights which years saw larger disparities. The mid-2000s reflect a strong positive deviation, with users awarding higher average scores compared to critics. By contrast, in more recent years, the average critic rating for many titles outpaced user scores, possibly pointing to shifts in user expectations, a changing demographic for critics, or the rise of more niche or experimental titles that resonate differently with professional reviewers than with broad user bases.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						 The visual uses a positive–negative scale on the y-axis, where bars above zero (colored in blue) mean user scores exceed critics, and bars below zero (in red) imply the opposite. Width or shading intensity can encode how many games contributed to that average difference in a given year. An interactive year slider from 1996 to 2016 enables a dynamic update of the chart, letting users pinpoint precisely when these disagreements spike or dissipate. The 800×400px sizing ensures each bar remains visually discernible, and color-coded legends clarify the meaning of positive versus negative bars.
					</p>
				</VisDescription>
			</VisualizationSection>

			<!-- 15. EVOLUTION IN AGE RATINGS -->
			<VisualizationSection queryName="13. evolution in age rating">
				<VisTitle slot="title" title="Evolution in Age Ratings for Released Video Games Over Time">
					<p class="subtitle">
						 Examining ESRB ratings—E, E10+, T, M, and AO—from the mid-1980s through 2016 illustrates a pivot in gaming demographics and content. The surge of T-rated (Teen) and M-rated (Mature) games from the late 1990s onward suggests that as hardware capabilities expanded and larger budgets came into the fold, developers ventured into more complex, potentially adult narratives. Yet, E-rated titles remained a cornerstone, indicating that family-friendly or child-appropriate markets have never ceased to be a profitable segment.
					</p>
				</VisTitle>
				<VisDescription slot="description">
					<p>
						 This 800×400px line chart uses the category10 palette to assign a distinct color to each ESRB rating, ensuring immediate distinction among lines. By using absolute release counts on the y-axis (rather than percentages), viewers can see growth patterns in the industry as well as expansions in each age category. An interactive legend allows toggling specific ratings on or off, clarifying how each rating gained or lost momentum over time. Smooth transitions and tooltips make it easier to follow the precise volume of releases for a given rating and year.
					</p>
				</VisDescription>
			</VisualizationSection>
		</div>
	{/if}
</section>

<style>
	.dashboard {
		padding: 2rem;
	}

	.dashboard-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.alert {
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: 0.5rem;
		background-color: rgba(255, 255, 255, 0.05);
	}

	.alert-success {
		background-color: rgba(0, 255, 0, 0.05);
	}

	.alert-error {
		background-color: rgba(255, 0, 0, 0.05);
	}
</style>
