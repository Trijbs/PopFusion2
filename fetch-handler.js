/**
 * PopFusion2 Fetch Handler
 * Centralized fetch management for all pages
 */

class PopFusionFetchHandler {
    constructor() {
        this.baseURL = window.location.origin;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
        
        // Initialize error handling
        this.setupGlobalErrorHandling();
        
        // Track fetch analytics
        this.analytics = {
            requests: 0,
            errors: 0,
            cacheHits: 0
        };
    }

    /**
     * Setup global error handling for fetch operations
     */
    setupGlobalErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled fetch rejection:', event.reason);
            this.analytics.errors++;
            this.showErrorMessage('Network error occurred. Please try again.');
        });
    }

    /**
     * Main fetch method with caching, retry logic, and error handling
     */
    async fetch(url, options = {}) {
        const cacheKey = this.getCacheKey(url, options);
        
        // Check cache first
        if (this.shouldUseCache(cacheKey)) {
            this.analytics.cacheHits++;
            return this.cache.get(cacheKey).data;
        }

        // Perform fetch with retry logic
        let lastError;
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                this.analytics.requests++;
                const response = await this.performFetch(url, options);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await this.parseResponse(response);
                
                // Cache successful responses
                this.cacheResponse(cacheKey, data);
                
                return data;
            } catch (error) {
                lastError = error;
                console.warn(`Fetch attempt ${attempt} failed:`, error.message);
                
                if (attempt < this.retryAttempts) {
                    await this.delay(this.retryDelay * attempt);
                }
            }
        }

        // All attempts failed
        this.analytics.errors++;
        throw new Error(`Failed to fetch after ${this.retryAttempts} attempts: ${lastError.message}`);
    }

    /**
     * Perform the actual fetch operation
     */
    async performFetch(url, options) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 10000 // 10 seconds
        };

        const mergedOptions = { ...defaultOptions, ...options };
        
        // Add timeout support
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), mergedOptions.timeout);
        
        try {
            const response = await fetch(url, {
                ...mergedOptions,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * Parse response based on content type
     */
    async parseResponse(response) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else if (contentType && contentType.includes('text/')) {
            return await response.text();
        } else {
            return await response.blob();
        }
    }

    /**
     * Cache management
     */
    getCacheKey(url, options) {
        return `${url}_${JSON.stringify(options)}`;
    }

    shouldUseCache(cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (!cached) return false;
        
        const now = Date.now();
        return (now - cached.timestamp) < this.cacheTimeout;
    }

    cacheResponse(cacheKey, data) {
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }

    /**
     * Utility methods
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showErrorMessage(message) {
        const errorElement = document.querySelector('.error-message') || this.createErrorElement();
        errorElement.textContent = message;
        errorElement.classList.add('active');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.classList.remove('active');
        }, 5000);
    }

    createErrorElement() {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            display: none;
        `;
        document.body.appendChild(errorElement);
        return errorElement;
    }

    showSpinner(show = true) {
        const spinner = document.querySelector('.spinner, .infinite-spinner');
        if (spinner) {
            spinner.classList.toggle('active', show);
        }
    }

    /**
     * Page-specific fetch handlers
     */

    // Discover page handlers
    async fetchDiscoverContent(page = 1, searchQuery = '') {
        this.showSpinner(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12',
                ...(searchQuery && { search: searchQuery })
            });

            const data = await this.fetch(`/api/discover?${params}`);
            return this.processDiscoverData(data);
        } catch (error) {
            console.error('Failed to fetch discover content:', error);
            return this.getFallbackDiscoverData();
        } finally {
            this.showSpinner(false);
        }
    }

    processDiscoverData(data) {
        return {
            items: data.items || [],
            total: data.total || 0,
            hasMore: data.hasMore || false
        };
    }

    getFallbackDiscoverData() {
        return {
            items: musicData.slice(0, 12),
            total: musicData.length,
            hasMore: false
        };
    }

    // Electronic page handlers
    async fetchElectronicTracks(page = 1) {
        this.showSpinner(true);
        try {
            const data = await this.fetch(`/api/electronic?page=${page}&limit=8`);
            return this.processGenreData(data, 'electronic');
        } catch (error) {
            console.error('Failed to fetch electronic tracks:', error);
            return this.getFallbackGenreData('electronic');
        } finally {
            this.showSpinner(false);
        }
    }

    // Billboard/Charts handlers
    async fetchBillboardCharts(page = 1) {
        this.showSpinner(true);
        try {
            const data = await this.fetch(`/api/charts?page=${page}&limit=10`);
            return this.processChartsData(data);
        } catch (error) {
            console.error('Failed to fetch billboard charts:', error);
            return this.getFallbackChartsData();
        } finally {
            this.showSpinner(false);
        }
    }

    processChartsData(data) {
        return {
            tracks: data.tracks || [],
            total: data.total || 0,
            lastUpdated: data.lastUpdated || new Date().toISOString()
        };
    }

    getFallbackChartsData() {
        const chartTracks = musicData.filter(item => item.type === 'song').slice(0, 10);
        return {
            tracks: chartTracks,
            total: chartTracks.length,
            lastUpdated: new Date().toISOString()
        };
    }

    // Artist page handlers
    async fetchArtistData(artistId) {
        this.showSpinner(true);
        try {
            const data = await this.fetch(`/api/artist/${artistId}`);
            return this.processArtistData(data);
        } catch (error) {
            console.error('Failed to fetch artist data:', error);
            return this.getFallbackArtistData(artistId);
        } finally {
            this.showSpinner(false);
        }
    }

    processArtistData(data) {
        return {
            artist: data.artist || {},
            topTracks: data.topTracks || [],
            albums: data.albums || [],
            relatedArtists: data.relatedArtists || []
        };
    }

    getFallbackArtistData(artistId) {
        const artist = musicData.find(item => item.type === 'artist' && item.id == artistId);
        return {
            artist: artist || {},
            topTracks: [],
            albums: [],
            relatedArtists: []
        };
    }

    // Article page handlers
    async fetchArticleContent(articleId) {
        this.showSpinner(true);
        try {
            const data = await this.fetch(`/api/article/${articleId}`);
            return this.processArticleData(data);
        } catch (error) {
            console.error('Failed to fetch article content:', error);
            return this.getFallbackArticleData();
        } finally {
            this.showSpinner(false);
        }
    }

    processArticleData(data) {
        return {
            title: data.title || 'Music Article',
            content: data.content || '',
            author: data.author || 'PopFusion Team',
            publishDate: data.publishDate || new Date().toISOString(),
            tags: data.tags || []
        };
    }

    getFallbackArticleData() {
        return {
            title: 'Latest Music News',
            content: 'Stay tuned for the latest updates in the music world.',
            author: 'PopFusion Team',
            publishDate: new Date().toISOString(),
            tags: ['music', 'news']
        };
    }

    // Contact form handler
    async submitContactForm(formData) {
        this.showSpinner(true);
        try {
            const data = await this.fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            return { success: true, message: 'Message sent successfully!' };
        } catch (error) {
            console.error('Failed to submit contact form:', error);
            return { success: false, message: 'Failed to send message. Please try again.' };
        } finally {
            this.showSpinner(false);
        }
    }

    // Generic genre data handlers
    processGenreData(data, genre) {
        return {
            items: data.items || [],
            total: data.total || 0,
            genre: genre
        };
    }

    getFallbackGenreData(genre) {
        const genreItems = musicData.filter(item => 
            item.genre && item.genre.toLowerCase() === genre.toLowerCase()
        );
        return {
            items: genreItems,
            total: genreItems.length,
            genre: genre
        };
    }

    // Search functionality
    async performSearch(query, filters = {}) {
        this.showSpinner(true);
        try {
            const params = new URLSearchParams({
                q: query,
                ...filters
            });

            const data = await this.fetch(`/api/search?${params}`);
            return this.processSearchResults(data);
        } catch (error) {
            console.error('Search failed:', error);
            return this.getFallbackSearchResults(query);
        } finally {
            this.showSpinner(false);
        }
    }

    processSearchResults(data) {
        return {
            results: data.results || [],
            total: data.total || 0,
            suggestions: data.suggestions || []
        };
    }

    getFallbackSearchResults(query) {
        const results = musicData.filter(item => 
            item.name?.toLowerCase().includes(query.toLowerCase()) ||
            item.title?.toLowerCase().includes(query.toLowerCase()) ||
            item.artist?.toLowerCase().includes(query.toLowerCase())
        );
        
        return {
            results: results,
            total: results.length,
            suggestions: []
        };
    }

    // Analytics and monitoring
    getAnalytics() {
        return {
            ...this.analytics,
            cacheSize: this.cache.size,
            uptime: Date.now() - this.startTime
        };
    }

    logAnalytics() {
        console.log('PopFusion Fetch Analytics:', this.getAnalytics());
    }
}

// Initialize global fetch handler
const popFusionFetch = new PopFusionFetchHandler();
popFusionFetch.startTime = Date.now();

// Export for use in other scripts
window.popFusionFetch = popFusionFetch;

// Auto-log analytics every 5 minutes
setInterval(() => {
    popFusionFetch.logAnalytics();
}, 5 * 60 * 1000);

// Cleanup cache every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of popFusionFetch.cache.entries()) {
        if (now - value.timestamp > popFusionFetch.cacheTimeout) {
            popFusionFetch.cache.delete(key);
        }
    }
}, 10 * 60 * 1000);

console.log('PopFusion Fetch Handler initialized successfully');