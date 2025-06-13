const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
console.log(TMDB_API_KEY)
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

class TMDBService{
    static async makeRequest(endpoint, params = {}) {
        const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
        url.searchParams.append('api_key', TMDB_API_KEY);

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                url.searchParams.append(key, value);
            }
        });

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('TMDB API Error: ${response.status}${response.statusText}');
            }
            return await response.json();
        } catch (error) {
            console.error('TMDB API Request failed: ', error);
            throw error;
        }
    }

    // Movie Methods
    static async getPopularMovies(page = 1) {
        return this.makeRequest(`/movie/popular`, {page});
    }

    static async getTopRatedMovies(page = 1) {
        return this.makeRequest(`/movie/top_rated`, {page});
    }

    static async getNowPlayingMovies(page = 1) {
        return this.makeRequest(`/movie/now_playing`, {page});
    }

    static async getUpcomingMovies(page = 1) {
        return this.makeRequest(`/movie/upcoming`, {page});
    }

    static async getMovieDetails(movieId) {
        return this.makeRequest(`/movie/${movieId}`);
    }

    static async getMovieCredits(movieId) {
        return this.makeRequest(`/movie/${movieId}/credits`);
    }

    static async getMovieVideos(movieId) {
        return this.makeRequest(`movie/${movieId}/videos`);
    }

    static async getSimilarMovies(movieId, page = 1) {
        return this.makeRequest(`movie/${movieId}/similar`, {page});
    }

    static async getMovieRecommendations(movieId, page = 1) {
        return this.makeRequest(`movie/${movieId}/recommendations`, {page});
    }


    static async getMovieImages(movieId) {
        return this.makeRequest(`movie/${movieId}/images`);
    }

    static async getMovieReviews(movieId, page = 1) {
        return this.makeRequest(`movie/${movieId}/reviews`, {page});
    }

    // TV Show Methods
    static async getPopularTVShows(page = 1) {
        return this.makeRequest(`/tv/popular`, {page});
    }

    static async getTopRatedTVShows(page = 1) {
        return this.makeRequest(`/tv/top_rated`, {page});
    }

    static async getOnTheAirTVShows(page = 1) {
        return this.makeRequest(`/tv/on_the_air`, {page});
    }

    static async getAiringTodayTVShows(page = 1) {
        return this.makeRequest(`/tv/airing_today`, {page});
    }

    static async getTVShowDetails(tvShowId) {
        return this.makeRequest(`/tv/${tvShowId}`);
    }

    static async getTVShowCredits(tvShowId) {
        return this.makeRequest(`/tv/${tvShowId}/credits`);
    }

    static async getTVShowVideos(tvShowId) {
        return this.makeRequest(`tv/${tvShowId}/videos`);
    }

    static async getSimilarTVShows(tvShowId, page = 1) {
        return this.makeRequest(`tv/${tvShowId}/similar`, {page});
    }

    static async getTVShowRecommendations(tvShowId, page = 1) {
        return this.makeRequest(`tv/${tvShowId}/recommendations`, {page});
    }

    static async getTVShowImages(tvShowId) {
        return this.makeRequest(`tv/${tvShowId}/images`);
    }

    static async getTVShowReviews(tvShowId, page = 1) {
        return this.makeRequest(`tv/${tvShowId}/reviews`, {page});
    }

    static async getTVSeasonDetails(tvShowId, seasonNumber) {
        return this.makeRequest(`tv/${tvShowId}/season/${seasonNumber}`);
    }

    static async getTVEpisodeDetails(tvShowId, seasonNumber, episodeNumber) {
        return this.makeRequest(`tv/${tvShowId}/season/${seasonNumber}/episode/${episodeNumber}`);
    }

    //Search Method
    static async searchMulti(query, page = 1) {
        return this.makeRequest('/search/multi', {query, page});
    }

    static async searchMovies(query, page = 1, year = null) {
        const params = {query, page};
        if (year) params.year = year;
        return this.makeRequest('/search/movie', params);
    }

    static async searchTVShows(query, page = 1, year = null) {
        const params = {query, page};
        if (year) params.year = year;
        return this.makeRequest('/search/tv', params);
    }

    static async searchPeople(query, page = 1) {
        return this.makeRequest('/search/person', {query, page});
    }

    static async searchCompanies(query, page = 1) {
        return this.makeRequest('/search/company', {query, page});
    }

    static async searchCollections(query, page = 1) {
        return this.makeRequest('/search/collection', {query, page});
    }

    static async searchKeywords(query, page = 1) {
        return this.makeRequest('/search/keyword', {query, page});
    }

    //Discover Methods
    static async discoverMovies(filters = {}) {
        const {
            page = 1,
            sortBy = 'popularity.desc',
            withGenres,
            year,
            releaseDateGte,
            releaseDateLte,
            voteAverageGte,
            voteAverageLte,
            withOriginalLanguage,
            withKeywords,
            withCast,
            withCrew,
            withPeople,
            withCompanies,
            withoutKeywords,
            includeAdult = false,
            includeVideo = false,
        } = filters;

        return this.makeRequest('/discover/movie', {
            page,
            sort_by: sortBy,
            with_genres: withGenres,
            year,
            'release_date.gte': releaseDateGte,
            'release_date.lte': releaseDateLte,
            'vote_average.gte': voteAverageGte,
            'vote_average.lte': voteAverageLte,
            with_original_language: withOriginalLanguage,
            with_keywords: withKeywords,
            with_cast: withCast,
            with_crew: withCrew,
            with_people: withPeople,
            with_companies: withCompanies,
            without_keywords: withoutKeywords,
            include_adult: includeAdult,
            include_video: includeVideo
        });
    }

    static async discoverTVShows(filters = {}) {
        const {
            page = 1,
            sortBy = 'popularity.desc',
            withGenres,
            year,
            firstAirDateGte,
            firstAirDateLte,
            voteAverageGte,
            voteAverageLte,
            withOriginalLanguage,
            withKeywords,
            withCompanies,
            withoutKeywords,
            includeNullFirstAirDate = false,
        } = filters;

        return this.makeRequest('/discover/tv', {
            page,
            sort_by: sortBy,
            with_genres: withGenres,
            year,
            'first_air_date.gte': firstAirDateGte,
            'first_air_date.lte': firstAirDateLte,
            'vote_average.gte': voteAverageGte,
            'vote_average.lte': voteAverageLte,
            with_original_language: withOriginalLanguage,
            with_keywords: withKeywords,
            with_companies: withCompanies,
            without_keywords: withoutKeywords,
            include_null_first_air_date: includeNullFirstAirDate
        });
    }

    //Trending Methods
    static async getTrending(mediaType = 'all', timeWindow = 'week') {
        return this.makeRequest(`/trending/${mediaType}/${timeWindow}`);
    }

    static async getTrendingMovies(timeWindow = 'week') {
        return this.makeRequest(`/trending/movie/${timeWindow}`);
    }

    static async getTrendingTVShows(timeWindow = 'week') {
        return this.makeRequest(`/trending/tv/${timeWindow}`);
    }

    static async getTrendingPeople(timeWindow = 'week') {
        return this.makeRequest(`/trending/person/${timeWindow}`);
    }

    //Genre Methods
    static async getMovieGenres(mediaType = 'movie') {
        return this.makeRequest(`/genre/${mediaType}/list`);
    }

    static async getTVShowGenres(mediaType = 'tv') {
        return this.makeRequest(`/genre/${mediaType}/list`);
    }

    //Person Methods
    static async getPersonDetails(personId) {
        return this.makeRequest(`/person/${personId}`);
    }

    static async getPersonMovieCredits(personId) {
        return this.makeRequest(`/person/${personId}/movie_credits`);
    }

    static async getPersonTVCredits(personId) {
        return this.makeRequest(`/person/${personId}/tv_credits`);
    }

    static async getPersonCombineCredits(personId) {
        return this.makeRequest(`/person/${personId}/combined_credits`);
    }

    static async getPersonImages(personId) {
        return this.makeRequest(`/person/${personId}/images`);
    }

    static async getPopularPeople(page = 1) {
        return this.makeRequest(`/person/popular`, {page});
    }

    //Collection Methods
    static async getCollectionDetails(collectionId) {
        return this.makeRequest(`/collection/${collectionId}`);
    }

    static async getCollectionImages(collectionId) {
        return this.makeRequest(`/collection/${collectionId}/images`);
    }

    // Company Methods
    static async getCompanyDetails(companyId) {
        return this.makeRequest(`/company/${companyId}`);
    }

    static async getCompanyMovies(companyId, page = 1) {
        return this.makeRequest(`/company/${companyId}/movies`, {page});
    }

    // Configuration Methods
    static async getConfiguration() {
        return this.makeRequest('/configuration');
    }

    static async getCountries() {
        return this.makeRequest('/configuration/countries');
    }

    static async getLanguages() {
        return this.makeRequest('/configuration/languages');
    }

    static async getJobs() {
        return this.makeRequest('/configuration/jobs');
    }

    static async getTimezones() {
        return this.makeRequest('/configuration/timezones');
    }

    // Image URL Helper Methods
    static getImageUrl(imagePath, size = 'w500') {
        if (!imagePath) return null;
        return `${TMDB_IMAGE_BASE_URL}/${size}${imagePath}`;
    }

    static getPosterUrl(posterPath, size = 'w500') {
        return this.getImageUrl(posterPath, size);
    }

    static getBackdropUrl(backdropPath, size = 'w1280') {
        return this.getImageUrl(backdropPath, size);
    }

    static getProfileUrl(profilePath, size = 'w500') {
        return this.getImageUrl(profilePath, size);
    }

    static getLogUrl(logoPath, size = 'w185') {
        return this.getImageUrl(logoPath, size);
    }

    // Utitlity Methods
    static formatRunTime(minutes) {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
    }

    static formatDate(dateString, locale = 'en-US') {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    }

    static formatRating(voteAverage, maxRating = 10) {
        if (!voteAverage) return 'N/A';
        return `${voteAverage.toFixed(1)} / ${maxRating}`;
    }

    static getYearFromDate(dateString) {
        if (!dateString) return 'N/A';
        return new Date(dateString).getFullYear();
    }

    // Error handling wrapper for batch requests
    static async batchRequest(requests) {
        try {
            const results = await Promise.allSettled(requests);
            return results.map((result, index) => ({
                index,
                status: result.status,
                data: result.status === 'fulfilled' ? result.value : null,
                error: result.status === 'rejected' ? result.reason : null,
            }));
        } catch (error) {
            console.error('Batch Request failed: ', error);
            throw error;
        }
    }

    // Cache helper 
    static cache = new Map();
    static cacheTimeout = 5 * 60 * 1000;

    static async getCached(key, fetchFunction, ...args) {
        const cacheKey = `${key}_${JSON.stringify(args)}`;
        const cached = this.cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const data = await fetchFunction.apply(this, args);
            this.cache.set(cacheKey, {data, timestamp: Date.now()});
            return data;
        } catch (error) {
            console.error('Cached request failed: ', error);
            throw error;
        }
    }

    static clearCache() {
        this.cache.clear();
    }
}

export default TMDBService;