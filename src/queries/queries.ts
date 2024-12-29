import type { Query } from './types';
import { selectAllQuery } from './individual/selectAll';
import { topGenresBarQuery } from './individual/topGenresBar';
import { topGenresDonutQuery } from './individual/topGenres';
import { topPublishersQuery } from './individual/topPublishers';
import { topPlatformsQuery } from './individual/topPlatforms';
import { salesOverTimeQuery } from './individual/salesOverTime';
import { globalSalesBoxplotQuery } from './individual/globalSalesBoxplot';
import { criticScoreBoxplotQuery } from './individual/criticScoreBoxplot';
import { regionalSalesPieQuery } from './individual/regionalSalesPie';
import { genreRegionHeatmapQuery } from './individual/genreRegionHeatmap';
import { genrePlatformSalesQuery } from './individual/genrePlatformSales';
import { salesPercentageOverTimeGenreQuery } from './individual/salesPercentageOverTimeGenre';
import { salesPercentageOverTimePlatformQuery } from './individual/salesPercentageOverTimePlatform';
import { criticsVsUserScoreQuery } from './individual/criticsVsUserScore';
import { criticUserScoreDifferenceQuery } from './individual/criticUserScoreDifference';
import { evolutionInAgeRatingsQuery } from './individual/evolutionInAgeRatings';

export const queries = [
	selectAllQuery,
	topGenresBarQuery,
	topGenresDonutQuery,
	topPublishersQuery,
	topPlatformsQuery,
	salesOverTimeQuery,
	globalSalesBoxplotQuery,
	criticScoreBoxplotQuery,
	regionalSalesPieQuery,
	genreRegionHeatmapQuery,
	genrePlatformSalesQuery,
	salesPercentageOverTimeGenreQuery,
	salesPercentageOverTimePlatformQuery,
	criticsVsUserScoreQuery,
	criticUserScoreDifferenceQuery,
	evolutionInAgeRatingsQuery
] as const;

export type QueryNames = (typeof queries)[number]['name'];