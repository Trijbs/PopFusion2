/**
 * Discover Page Fetch Integration
 */

class DiscoverPageHandler {
    constructor() {
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMore = true;
        this.searchQuery = '';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialContent();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('#search-input');
        const searchButton = document.querySelector('.search-button');
        
        if (searchInput && searchButton) {
            searchButton.addEventListener('click', () => this.handleSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
        }

        // Infinite scroll
        this.setupInfiniteScroll();

        // Filter buttons
        this.setupFilterButtons();
    }

    async handleSearch() {
        const searchInput = document.querySelector('#search-input');
        this.searchQuery = searchInput?.value.trim() || '';
        this.currentPage = 1;
        this.hasMore = true;
        
        await this.loadContent(true);
        
        // Track search analytics
        if (window.trackEvent) {
            trackEvent('search', { query: this.searchQuery, page: 'discover' });
        }
    }

    async loadInitialContent() {
        await this.loadContent(false);
    }

    async loadContent(clearExisting = false) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        try {
            const data = await popFusionFetch.fetchDiscoverContent(this.currentPage, this.searchQuery);
            this.renderContent(data, clearExisting);
            
            this.hasMore = data.hasMore;
            if (data.items.length > 0) {
                this.currentPage++;
            }
        } catch (error) {
            console.error('Failed to load discover content:', error);
            this.showErrorMessage('Failed to load content. Please try again.');
        } finally {
            this.isLoading = false;
        }
    }

    renderContent(data, clearExisting = false) {
        const container = document.querySelector('.discover-grid') || 
                         document.querySelector('.content-grid') ||
                         this.createContentContainer();

        if (clearExisting) {
            container.innerHTML = '';
        }

        data.items.forEach(item => {
            const card = this.createContentCard(item);
            container.appendChild(card);
        });

        // Update results count
        this.updateResultsCount(data.total);
    }

    createContentCard(item) {
        const card = document.createElement('article');
        card.className = 'discover-card content-card';
        
        const imageUrl = item.image || 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg';
        const title = item.name || item.title || 'Unknown';
        const subtitle = item.artist || item.description || '';
        const genre = item.genre || '';

        card.innerHTML = `
            <div class="card-image">
                <img src="${imageUrl}" alt="${title}" loading="lazy">
                <div class="card-overlay">
                    <button class="play-button" data-id="${item.id}">▶</button>
                </div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${title}</h3>
                ${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ''}
                ${genre ? `<span class="card-genre">${genre}</span>` : ''}
                <div class="card-actions">
                    <button class="like-button" data-id="${item.id}">♡</button>
                    <button class="share-button" data-id="${item.id}">Share</button>
                    <button class="add-playlist" data-id="${item.id}">Add to Playlist</button>
                </div>
            </div>
        `;

        // Add event listeners to card actions
        this.setupCardEventListeners(card, item);

        return card;
    }

    setupCardEventListeners(card, item) {
        // Play button
        const playButton = card.querySelector('.play-button');
        playButton?.addEventListener('click', () => this.handlePlay(item));

        // Like button
        const likeButton = card.querySelector('.like-button');
        likeButton?.addEventListener('click', () => this.handleLike(item));

        // Share button
        const shareButton = card.querySelector('.share-button');
        shareButton?.addEventListener('click', () => this.handleShare(item));

        // Add to playlist
        const addPlaylistButton = card.querySelector('.add-playlist');
        addPlaylistButton?.addEventListener('click', () => this.handleAddToPlaylist(item));
    }

    handlePlay(item) {
        console.log('Playing:', item);
        if (window.trackEvent) {
            trackEvent('play', { itemId: item.id, type: item.type, page: 'discover' });
        }
        // Implement play functionality
    }

    handleLike(item) {
        console.log('Liked:', item);
        if (window.trackEvent) {
            trackEvent('like', { itemId: item.id, type: item.type, page: 'discover' });
        }
        // Implement like functionality
        this.toggleLikeButton(event.target);
    }

    handleShare(item) {
        console.log('Sharing:', item);
        if (window.trackEvent) {
            trackEvent('share', { itemId: item.id, type: item.type, page: 'discover' });
        }
        
        if (navigator.share) {
            navigator.share({
                title: item.name || item.title,
                text: `Check out this ${item.type} on PopFusion!`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            this.showMessage('Link copied to clipboard!');
        }
    }

    handleAddToPlaylist(item) {
        console.log('Adding to playlist:', item);
        if (window.trackEvent) {
            trackEvent('add_to_playlist', { itemId: item.id, type: item.type, page: 'discover' });
        }
        // Implement add to playlist functionality
        this.showMessage('Added to playlist!');
    }

    toggleLikeButton(button) {
        const isLiked = button.textContent === '♥';
        button.textContent = isLiked ? '♡' : '♥';
        button.classList.toggle('liked', !isLiked);
    }

    setupInfiniteScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.hasMore && !this.isLoading) {
                    this.loadContent(false);
                }
            });
        }, {
            rootMargin: '100px'
        });

        // Create and observe sentinel element
        const sentinel = document.createElement('div');
        sentinel.className = 'scroll-sentinel';
        sentinel.style.height = '1px';
        
        const container = document.querySelector('.discover-grid') || 
                         document.querySelector('.content-grid') ||
                         this.createContentContainer();
        
        container.parentNode.appendChild(sentinel);
        observer.observe(sentinel);
    }

    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-button, .genre-filter');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                // Apply filter
                const filter = button.dataset.filter || button.textContent.toLowerCase();
                this.applyFilter(filter);
            });
        });
    }

    async applyFilter(filter) {
        this.currentPage = 1;
        this.hasMore = true;
        
        // Update search query with filter
        this.searchQuery = filter === 'all' ? '' : filter;
        
        await this.loadContent(true);
        
        if (window.trackEvent) {
            trackEvent('filter', { filter: filter, page: 'discover' });
        }
    }

    createContentContainer() {
        const container = document.createElement('div');
        container.className = 'discover-grid content-grid';
        
        const main = document.querySelector('main') || document.body;
        main.appendChild(container);
        
        return container;
    }

    updateResultsCount(total) {
        let countElement = document.querySelector('.results-count');
        
        if (!countElement) {
            countElement = document.createElement('div');
            countElement.className = 'results-count';
            
            const container = document.querySelector('.discover-grid') || 
                             document.querySelector('.content-grid');
            
            if (container) {
                container.parentNode.insertBefore(countElement, container);
            }
        }
        
        countElement.textContent = `${total} results found`;
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('discover-page') || 
        window.location.pathname.includes('discover')) {
        new DiscoverPageHandler();
    }
});

// Export for external use
window.DiscoverPageHandler = DiscoverPageHandler;