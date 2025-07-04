/**
 * PopFusion2 Fetch Integration Manager
 * Automatically loads appropriate fetch handlers for each page
 */

class FetchIntegrationManager {
    constructor() {
        this.loadedHandlers = new Set();
        this.pageHandlers = {
            'discover': 'discover-fetch.js',
            'electronic': 'electronic-fetch.js',
            'billboard': 'billboard-fetch.js',
            'artist': 'artist-fetch.js',
            'contact': 'contact-fetch.js',
            'article': 'article-fetch.js',
            'advertenties': 'advertenties-fetch.js'
        };
        
        this.init();
    }

    init() {
        this.detectPageType();
        this.loadRequiredHandlers();
        this.setupGlobalFetchInterceptor();
    }

    detectPageType() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().split('.')[0];
        
        // Detect page type from URL or body classes
        this.currentPageType = filename;
        
        // Also check body classes for additional context
        const bodyClasses = document.body.className.split(' ');
        bodyClasses.forEach(className => {
            if (className.endsWith('-page')) {
                const pageType = className.replace('-page', '');
                if (this.pageHandlers[pageType]) {
                    this.currentPageType = pageType;
                }
            }
        });
        
        console.log('Detected page type:', this.currentPageType);
    }

    async loadRequiredHandlers() {
        // Always load the main fetch handler first
        await this.loadScript('fetch-handler.js');
        
        // Load Spotify integration if needed
        if (this.needsSpotifyIntegration()) {
            await this.loadScript('spotify.min.js');
        }
        
        // Load page-specific handler
        if (this.pageHandlers[this.currentPageType]) {
            await this.loadScript(this.pageHandlers[this.currentPageType]);
        }
        
        // Load common handlers that might be needed on multiple pages
        await this.loadCommonHandlers();
    }

    needsSpotifyIntegration() {
        const spotifyPages = ['discover', 'electronic', 'billboard', 'artist'];
        return spotifyPages.includes(this.currentPageType) || 
               document.querySelector('[data-spotify]') !== null;
    }

    async loadCommonHandlers() {
        // Load search handler if search functionality is present
        if (document.querySelector('#search-input, .search-bar')) {
            await this.loadScript('search-fetch.js');
        }
        
        // Load playlist handler if playlist functionality is present
        if (document.querySelector('[data-playlist]')) {
            await this.loadScript('playlist-fetch.js');
        }
    }

    async loadScript(src) {
        if (this.loadedHandlers.has(src)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            
            script.onload = () => {
                this.loadedHandlers.add(src);
                console.log(`Loaded fetch handler: ${src}`);
                resolve();
            };
            
            script.onerror = () => {
                console.warn(`Failed to load fetch handler: ${src}`);
                resolve(); // Don't reject to prevent blocking other handlers
            };
            
            document.head.appendChild(script);
        });
    }

    setupGlobalFetchInterceptor() {
        // Intercept all fetch requests to add common headers and error handling
        const originalFetch = window.fetch;
        
        window.fetch = async (url, options = {}) => {
            // Add common headers
            const defaultHeaders = {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Page-Type': this.currentPageType
            };
            
            const mergedOptions = {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...options.headers
                }
            };
            
            try {
                const response = await originalFetch(url, mergedOptions);
                
                // Log successful requests for analytics
                if (window.trackEvent) {
                    trackEvent('fetch_request', {
                        url: url,
                        method: mergedOptions.method || 'GET',
                        status: response.status,
                        pageType: this.currentPageType
                    });
                }
                
                return response;
            } catch (error) {
                // Log failed requests
                if (window.trackEvent) {
                    trackEvent('fetch_error', {
                        url: url,
                        error: error.message,
                        pageType: this.currentPageType
                    });
                }
                
                throw error;
            }
        };
    }

    // Utility methods for other scripts to use
    static async loadHandler(handlerName) {
        const manager = window.fetchIntegrationManager;
        if (manager && manager.pageHandlers[handlerName]) {
            await manager.loadScript(manager.pageHandlers[handlerName]);
        }
    }

    static isHandlerLoaded(handlerName) {
        const manager = window.fetchIntegrationManager;
        return manager ? manager.loadedHandlers.has(handlerName) : false;
    }

    static getCurrentPageType() {
        const manager = window.fetchIntegrationManager;
        return manager ? manager.currentPageType : 'unknown';
    }
}

// Create additional fetch handlers for remaining pages
class ArticleFetchHandler {
    constructor() {
        this.articleId = this.getArticleIdFromURL();
        this.init();
    }

    getArticleIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || '1';
    }

    init() {
        this.loadArticleContent();
        this.setupEventListeners();
    }

    async loadArticleContent() {
        try {
            const data = await popFusionFetch.fetchArticleContent(this.articleId);
            this.renderArticle(data);
        } catch (error) {
            console.error('Failed to load article:', error);
            this.showErrorMessage('Failed to load article content.');
        }
    }

    renderArticle(data) {
        let articleContainer = document.querySelector('.article-content');
        if (!articleContainer) {
            articleContainer = document.createElement('article');
            articleContainer.className = 'article-content';
            document.querySelector('main')?.appendChild(articleContainer);
        }

        articleContainer.innerHTML = `
            <header class="article-header">
                <h1>${data.title}</h1>
                <div class="article-meta">
                    <span class="author">By ${data.author}</span>
                    <span class="date">${new Date(data.publishDate).toLocaleDateString()}</span>
                </div>
                <div class="article-tags">
                    ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </header>
            <div class="article-body">
                ${data.content}
            </div>
        `;
    }

    setupEventListeners() {
        // Share article functionality
        document.addEventListener('click', (e) => {
            if (e.target.matches('.share-article')) {
                this.shareArticle();
            }
        });
    }

    shareArticle() {
        const title = document.querySelector('.article-content h1')?.textContent || 'Article';
        const shareData = {
            title: title,
            text: 'Check out this article on PopFusion!',
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(shareData.url);
            this.showMessage('Link copied to clipboard!');
        }
    }

    showErrorMessage(message) {
        popFusionFetch.showErrorMessage(message);
    }

    showMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'success-message';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
        `;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
}

class AdvertentiesFetchHandler {
    constructor() {
        this.init();
    }

    init() {
        this.loadAdvertisements();
        this.setupEventListeners();
    }

    async loadAdvertisements() {
        try {
            const ads = await this.fetchAdvertisements();
            this.renderAdvertisements(ads);
        } catch (error) {
            console.error('Failed to load advertisements:', error);
            this.renderFallbackAds();
        }
    }

    async fetchAdvertisements() {
        // Mock advertisement data
        return [
            {
                id: 1,
                title: 'Premium Music Streaming',
                description: 'Unlimited access to millions of songs',
                image: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg',
                link: '#premium',
                type: 'banner'
            },
            {
                id: 2,
                title: 'Concert Tickets',
                description: 'Get tickets to the hottest shows',
                image: 'https://images.pexels.com/photos/96380/pexels-photo-96380.jpeg',
                link: '#concerts',
                type: 'card'
            }
        ];
    }

    renderAdvertisements(ads) {
        let adsContainer = document.querySelector('.advertisements-container');
        if (!adsContainer) {
            adsContainer = document.createElement('div');
            adsContainer.className = 'advertisements-container';
            document.querySelector('main')?.appendChild(adsContainer);
        }

        adsContainer.innerHTML = `
            <h2>Sponsored Content</h2>
            <div class="ads-grid">
                ${ads.map(ad => `
                    <div class="ad-card ${ad.type}" data-ad-id="${ad.id}">
                        <img src="${ad.image}" alt="${ad.title}" loading="lazy">
                        <div class="ad-content">
                            <h3>${ad.title}</h3>
                            <p>${ad.description}</p>
                            <a href="${ad.link}" class="ad-link">Learn More</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderFallbackAds() {
        const fallbackAds = [
            {
                id: 'fallback-1',
                title: 'Discover New Music',
                description: 'Explore trending tracks and artists',
                image: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg',
                link: 'discover.html',
                type: 'banner'
            }
        ];
        
        this.renderAdvertisements(fallbackAds);
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.ad-link')) {
                const adCard = e.target.closest('.ad-card');
                const adId = adCard?.dataset.adId;
                
                if (window.trackEvent) {
                    trackEvent('ad_click', {
                        adId: adId,
                        page: 'advertenties'
                    });
                }
            }
        });
    }
}

// Initialize the fetch integration manager
document.addEventListener('DOMContentLoaded', () => {
    window.fetchIntegrationManager = new FetchIntegrationManager();
    
    // Initialize page-specific handlers
    if (window.location.pathname.includes('article')) {
        new ArticleFetchHandler();
    }
    
    if (window.location.pathname.includes('advertenties')) {
        new AdvertentiesFetchHandler();
    }
});

// Export for external use
window.FetchIntegrationManager = FetchIntegrationManager;
window.ArticleFetchHandler = ArticleFetchHandler;
window.AdvertentiesFetchHandler = AdvertentiesFetchHandler;