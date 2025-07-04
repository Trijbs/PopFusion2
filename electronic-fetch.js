/**
 * Electronic Page Fetch Integration
 */

class ElectronicPageHandler {
    constructor() {
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMore = true;
        this.genre = 'electronic';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialContent();
    }

    setupEventListeners() {
        // Search within electronic genre
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

        // Sub-genre filters
        this.setupSubGenreFilters();

        // Sort options
        this.setupSortOptions();
    }

    async handleSearch() {
        const searchInput = document.querySelector('#search-input');
        const query = searchInput?.value.trim() || '';
        
        this.currentPage = 1;
        this.hasMore = true;
        
        await this.loadContent(true, { search: query });
        
        if (window.trackEvent) {
            trackEvent('search', { query: query, genre: this.genre });
        }
    }

    async loadInitialContent() {
        await this.loadContent(false);
    }

    async loadContent(clearExisting = false, filters = {}) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        try {
            const data = await popFusionFetch.fetchElectronicTracks(this.currentPage);
            this.renderTracks(data, clearExisting);
            
            this.hasMore = data.items.length === 8; // Assuming 8 items per page
            if (data.items.length > 0) {
                this.currentPage++;
            }
        } catch (error) {
            console.error('Failed to load electronic tracks:', error);
            this.showErrorMessage('Failed to load electronic tracks. Please try again.');
        } finally {
            this.isLoading = false;
        }
    }

    renderTracks(data, clearExisting = false) {
        const container = document.querySelector('.genre-grid') || 
                         document.querySelector('.electronic-grid') ||
                         this.createTrackContainer();

        if (clearExisting) {
            container.innerHTML = '';
        }

        data.items.forEach(track => {
            const card = this.createTrackCard(track);
            container.appendChild(card);
        });

        // Update track count
        this.updateTrackCount(data.total || data.items.length);
    }

    createTrackCard(track) {
        const card = document.createElement('article');
        card.className = 'genre-card electronic-card';
        
        const imageUrl = track.images?.[0]?.url || 
                        track.album?.images?.[0]?.url || 
                        'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg';
        
        const title = track.name || track.title || 'Unknown Track';
        const artist = track.artists?.[0]?.name || track.artist || 'Unknown Artist';
        const duration = this.formatDuration(track.duration_ms);
        const popularity = track.popularity || 0;

        card.innerHTML = `
            <div class="card-image">
                <img src="${imageUrl}" alt="${title}" loading="lazy">
                <div class="card-overlay">
                    <button class="play-button" data-id="${track.id}">▶</button>
                    <div class="track-info">
                        <span class="duration">${duration}</span>
                        <span class="popularity">${popularity}%</span>
                    </div>
                </div>
            </div>
            <div class="card-content">
                <h3 class="track-title">${title}</h3>
                <p class="track-artist">${artist}</p>
                <div class="track-details">
                    <span class="genre-tag">Electronic</span>
                    ${track.explicit ? '<span class="explicit-tag">E</span>' : ''}
                </div>
                <div class="card-actions">
                    <button class="like-button" data-id="${track.id}">♡</button>
                    <button class="add-queue" data-id="${track.id}">Add to Queue</button>
                    <button class="share-button" data-id="${track.id}">Share</button>
                    <a href="${track.external_urls?.spotify || '#'}" class="listen-now" target="_blank">Listen on Spotify</a>
                </div>
            </div>
        `;

        this.setupTrackEventListeners(card, track);
        return card;
    }

    setupTrackEventListeners(card, track) {
        // Play button
        const playButton = card.querySelector('.play-button');
        playButton?.addEventListener('click', () => this.handlePlay(track));

        // Like button
        const likeButton = card.querySelector('.like-button');
        likeButton?.addEventListener('click', (e) => this.handleLike(track, e.target));

        // Add to queue
        const addQueueButton = card.querySelector('.add-queue');
        addQueueButton?.addEventListener('click', () => this.handleAddToQueue(track));

        // Share button
        const shareButton = card.querySelector('.share-button');
        shareButton?.addEventListener('click', () => this.handleShare(track));

        // Listen now tracking
        const listenButton = card.querySelector('.listen-now');
        listenButton?.addEventListener('click', () => {
            if (window.trackEvent) {
                trackEvent('external_link', { 
                    platform: 'spotify', 
                    trackId: track.id, 
                    genre: 'electronic' 
                });
            }
        });
    }

    handlePlay(track) {
        console.log('Playing electronic track:', track);
        
        // Visual feedback
        const playButtons = document.querySelectorAll('.play-button');
        playButtons.forEach(btn => btn.textContent = '▶');
        
        event.target.textContent = '⏸';
        
        if (window.trackEvent) {
            trackEvent('play', { 
                trackId: track.id, 
                genre: 'electronic',
                artist: track.artists?.[0]?.name 
            });
        }
    }

    handleLike(track, button) {
        const isLiked = button.textContent === '♥';
        button.textContent = isLiked ? '♡' : '♥';
        button.classList.toggle('liked', !isLiked);
        
        if (window.trackEvent) {
            trackEvent(isLiked ? 'unlike' : 'like', { 
                trackId: track.id, 
                genre: 'electronic' 
            });
        }
        
        this.showMessage(isLiked ? 'Removed from favorites' : 'Added to favorites');
    }

    handleAddToQueue(track) {
        console.log('Adding to queue:', track);
        
        if (window.trackEvent) {
            trackEvent('add_to_queue', { 
                trackId: track.id, 
                genre: 'electronic' 
            });
        }
        
        this.showMessage('Added to queue');
    }

    handleShare(track) {
        const shareData = {
            title: `${track.name} by ${track.artists?.[0]?.name}`,
            text: 'Check out this electronic track on PopFusion!',
            url: track.external_urls?.spotify || window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(shareData.url);
            this.showMessage('Link copied to clipboard!');
        }
        
        if (window.trackEvent) {
            trackEvent('share', { 
                trackId: track.id, 
                genre: 'electronic',
                method: navigator.share ? 'native' : 'clipboard'
            });
        }
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

        const sentinel = document.createElement('div');
        sentinel.className = 'scroll-sentinel';
        sentinel.style.height = '1px';
        
        const container = document.querySelector('.genre-grid') || 
                         this.createTrackContainer();
        
        container.parentNode.appendChild(sentinel);
        observer.observe(sentinel);
    }

    setupSubGenreFilters() {
        const subGenres = ['House', 'Techno', 'Dubstep', 'Trance', 'Ambient', 'Drum & Bass'];
        
        let filterContainer = document.querySelector('.subgenre-filters');
        if (!filterContainer) {
            filterContainer = document.createElement('div');
            filterContainer.className = 'subgenre-filters';
            
            const main = document.querySelector('main');
            const genreGrid = document.querySelector('.genre-grid');
            if (main && genreGrid) {
                main.insertBefore(filterContainer, genreGrid);
            }
        }

        filterContainer.innerHTML = `
            <h3>Electronic Sub-genres</h3>
            <div class="filter-buttons">
                <button class="filter-btn active" data-subgenre="all">All</button>
                ${subGenres.map(genre => 
                    `<button class="filter-btn" data-subgenre="${genre.toLowerCase()}">${genre}</button>`
                ).join('')}
            </div>
        `;

        // Add event listeners
        filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleSubGenreFilter(btn));
        });
    }

    async handleSubGenreFilter(button) {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const subGenre = button.dataset.subgenre;
        this.currentPage = 1;
        this.hasMore = true;
        
        await this.loadContent(true, { subgenre: subGenre });
        
        if (window.trackEvent) {
            trackEvent('filter', { 
                genre: 'electronic', 
                subgenre: subGenre 
            });
        }
    }

    setupSortOptions() {
        let sortContainer = document.querySelector('.sort-options');
        if (!sortContainer) {
            sortContainer = document.createElement('div');
            sortContainer.className = 'sort-options';
            
            const filterContainer = document.querySelector('.subgenre-filters');
            if (filterContainer) {
                filterContainer.appendChild(sortContainer);
            }
        }

        sortContainer.innerHTML = `
            <label for="sort-select">Sort by:</label>
            <select id="sort-select" class="sort-select">
                <option value="popularity">Popularity</option>
                <option value="name">Name</option>
                <option value="artist">Artist</option>
                <option value="duration">Duration</option>
                <option value="release_date">Release Date</option>
            </select>
        `;

        const sortSelect = sortContainer.querySelector('#sort-select');
        sortSelect?.addEventListener('change', () => this.handleSort(sortSelect.value));
    }

    async handleSort(sortBy) {
        this.currentPage = 1;
        this.hasMore = true;
        
        await this.loadContent(true, { sort: sortBy });
        
        if (window.trackEvent) {
            trackEvent('sort', { 
                genre: 'electronic', 
                sortBy: sortBy 
            });
        }
    }

    formatDuration(durationMs) {
        if (!durationMs) return '0:00';
        
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    createTrackContainer() {
        const container = document.createElement('div');
        container.className = 'genre-grid electronic-grid';
        
        const main = document.querySelector('main') || document.body;
        main.appendChild(container);
        
        return container;
    }

    updateTrackCount(count) {
        let countElement = document.querySelector('.track-count');
        
        if (!countElement) {
            countElement = document.createElement('div');
            countElement.className = 'track-count';
            
            const container = document.querySelector('.genre-grid');
            if (container) {
                container.parentNode.insertBefore(countElement, container);
            }
        }
        
        countElement.textContent = `${count} electronic tracks`;
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
    if (document.body.classList.contains('electronic-page') || 
        window.location.pathname.includes('electronic')) {
        new ElectronicPageHandler();
    }
});

// Export for external use
window.ElectronicPageHandler = ElectronicPageHandler;