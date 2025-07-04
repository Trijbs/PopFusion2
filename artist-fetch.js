/**
 * Artist Page Fetch Integration
 */

class ArtistPageHandler {
    constructor() {
        this.artistId = this.getArtistIdFromURL();
        this.isLoading = false;
        this.currentTab = 'overview';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadArtistData();
    }

    getArtistIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || urlParams.get('artist') || '1';
    }

    setupEventListeners() {
        // Tab navigation
        this.setupTabNavigation();
        
        // Follow/Unfollow button
        this.setupFollowButton();
        
        // Play all button
        this.setupPlayAllButton();
        
        // Share artist
        this.setupShareButton();
        
        // Load more content buttons
        this.setupLoadMoreButtons();
    }

    async loadArtistData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState(true);
        
        try {
            const data = await popFusionFetch.fetchArtistData(this.artistId);
            this.renderArtistData(data);
        } catch (error) {
            console.error('Failed to load artist data:', error);
            this.showErrorMessage('Failed to load artist information. Please try again.');
        } finally {
            this.isLoading = false;
            this.showLoadingState(false);
        }
    }

    renderArtistData(data) {
        this.renderArtistHeader(data.artist);
        this.renderTopTracks(data.topTracks);
        this.renderAlbums(data.albums);
        this.renderRelatedArtists(data.relatedArtists);
        this.updatePageTitle(data.artist.name);
    }

    renderArtistHeader(artist) {
        let headerContainer = document.querySelector('.artist-header');
        if (!headerContainer) {
            headerContainer = document.createElement('div');
            headerContainer.className = 'artist-header';
            
            const main = document.querySelector('main');
            if (main) {
                main.insertBefore(headerContainer, main.firstChild);
            }
        }

        const imageUrl = artist.images?.[0]?.url || 
                        artist.image || 
                        'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg';
        
        const followers = this.formatNumber(artist.followers?.total || 0);
        const popularity = artist.popularity || 0;
        const genres = artist.genres?.join(', ') || artist.genre || 'Various';

        headerContainer.innerHTML = `
            <div class="artist-hero">
                <div class="artist-image">
                    <img src="${imageUrl}" alt="${artist.name}" loading="lazy">
                </div>
                <div class="artist-info">
                    <h1 class="artist-name">${artist.name || 'Unknown Artist'}</h1>
                    <div class="artist-stats">
                        <span class="followers">${followers} followers</span>
                        <span class="popularity">Popularity: ${popularity}%</span>
                    </div>
                    <div class="artist-genres">
                        <span class="genres-label">Genres:</span>
                        <span class="genres">${genres}</span>
                    </div>
                    <div class="artist-actions">
                        <button class="follow-button" data-artist-id="${artist.id}">
                            Follow
                        </button>
                        <button class="play-all-button" data-artist-id="${artist.id}">
                            Play All
                        </button>
                        <button class="share-artist-button" data-artist-id="${artist.id}">
                            Share
                        </button>
                    </div>
                </div>
            </div>
            <nav class="artist-tabs">
                <button class="tab-button active" data-tab="overview">Overview</button>
                <button class="tab-button" data-tab="tracks">Top Tracks</button>
                <button class="tab-button" data-tab="albums">Albums</button>
                <button class="tab-button" data-tab="related">Related Artists</button>
                <button class="tab-button" data-tab="about">About</button>
            </nav>
        `;

        this.setupHeaderEventListeners();
    }

    renderTopTracks(tracks) {
        let tracksContainer = document.querySelector('.top-tracks-section');
        if (!tracksContainer) {
            tracksContainer = document.createElement('div');
            tracksContainer.className = 'top-tracks-section tab-content';
            tracksContainer.dataset.tab = 'tracks';
            
            const main = document.querySelector('main');
            main?.appendChild(tracksContainer);
        }

        tracksContainer.innerHTML = `
            <h2>Top Tracks</h2>
            <div class="tracks-list">
                ${tracks.map((track, index) => `
                    <div class="track-item" data-track-id="${track.id}">
                        <div class="track-number">${index + 1}</div>
                        <div class="track-image">
                            <img src="${track.album?.images?.[0]?.url || 'https://images.pexels.com/photos/96380/pexels-photo-96380.jpeg'}" 
                                 alt="${track.name}" loading="lazy">
                            <button class="play-track-button" data-track-id="${track.id}">▶</button>
                        </div>
                        <div class="track-info">
                            <h3 class="track-name">${track.name}</h3>
                            <p class="track-album">${track.album?.name || 'Single'}</p>
                            <div class="track-stats">
                                <span class="popularity">${track.popularity || 0}% popularity</span>
                                <span class="duration">${this.formatDuration(track.duration_ms)}</span>
                            </div>
                        </div>
                        <div class="track-actions">
                            <button class="like-track" data-track-id="${track.id}">♡</button>
                            <button class="add-to-playlist" data-track-id="${track.id}">+</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            ${tracks.length > 10 ? '<button class="load-more-tracks">Load More Tracks</button>' : ''}
        `;

        this.setupTracksEventListeners(tracksContainer);
    }

    renderAlbums(albums) {
        let albumsContainer = document.querySelector('.albums-section');
        if (!albumsContainer) {
            albumsContainer = document.createElement('div');
            albumsContainer.className = 'albums-section tab-content';
            albumsContainer.dataset.tab = 'albums';
            albumsContainer.style.display = 'none';
            
            const main = document.querySelector('main');
            main?.appendChild(albumsContainer);
        }

        albumsContainer.innerHTML = `
            <h2>Albums</h2>
            <div class="albums-grid">
                ${albums.map(album => `
                    <div class="album-card" data-album-id="${album.id}">
                        <div class="album-image">
                            <img src="${album.images?.[0]?.url || 'https://images.pexels.com/photos/96380/pexels-photo-96380.jpeg'}" 
                                 alt="${album.name}" loading="lazy">
                            <div class="album-overlay">
                                <button class="play-album-button" data-album-id="${album.id}">▶</button>
                            </div>
                        </div>
                        <div class="album-info">
                            <h3 class="album-name">${album.name}</h3>
                            <p class="album-type">${album.album_type || 'Album'}</p>
                            <p class="album-year">${new Date(album.release_date).getFullYear()}</p>
                            <p class="album-tracks">${album.total_tracks || 0} tracks</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            ${albums.length > 12 ? '<button class="load-more-albums">Load More Albums</button>' : ''}
        `;

        this.setupAlbumsEventListeners(albumsContainer);
    }

    renderRelatedArtists(relatedArtists) {
        let relatedContainer = document.querySelector('.related-artists-section');
        if (!relatedContainer) {
            relatedContainer = document.createElement('div');
            relatedContainer.className = 'related-artists-section tab-content';
            relatedContainer.dataset.tab = 'related';
            relatedContainer.style.display = 'none';
            
            const main = document.querySelector('main');
            main?.appendChild(relatedContainer);
        }

        relatedContainer.innerHTML = `
            <h2>Related Artists</h2>
            <div class="related-artists-grid">
                ${relatedArtists.map(artist => `
                    <div class="related-artist-card" data-artist-id="${artist.id}">
                        <div class="artist-image">
                            <img src="${artist.images?.[0]?.url || 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg'}" 
                                 alt="${artist.name}" loading="lazy">
                        </div>
                        <div class="artist-info">
                            <h3 class="artist-name">${artist.name}</h3>
                            <p class="artist-followers">${this.formatNumber(artist.followers?.total || 0)} followers</p>
                            <div class="artist-actions">
                                <button class="follow-related" data-artist-id="${artist.id}">Follow</button>
                                <a href="artist.html?id=${artist.id}" class="view-artist">View</a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.setupRelatedArtistsEventListeners(relatedContainer);
    }

    setupTabNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tab-button')) {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            }
        });
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        
        // Show/hide tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = content.dataset.tab === tabName ? 'block' : 'none';
        });
        
        // Handle overview tab (show multiple sections)
        if (tabName === 'overview') {
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'block';
            });
        }
        
        this.currentTab = tabName;
        
        if (window.trackEvent) {
            trackEvent('artist_tab_change', { 
                tab: tabName, 
                artistId: this.artistId 
            });
        }
    }

    setupFollowButton() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.follow-button, .follow-related')) {
                this.handleFollow(e.target);
            }
        });
    }

    handleFollow(button) {
        const artistId = button.dataset.artistId;
        const isFollowing = button.textContent === 'Following';
        
        button.textContent = isFollowing ? 'Follow' : 'Following';
        button.classList.toggle('following', !isFollowing);
        
        if (window.trackEvent) {
            trackEvent(isFollowing ? 'unfollow_artist' : 'follow_artist', { 
                artistId: artistId 
            });
        }
        
        this.showMessage(isFollowing ? 'Unfollowed artist' : 'Following artist');
    }

    setupPlayAllButton() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.play-all-button')) {
                this.handlePlayAll();
            }
        });
    }

    handlePlayAll() {
        console.log('Playing all tracks for artist:', this.artistId);
        
        if (window.trackEvent) {
            trackEvent('play_all_artist', { 
                artistId: this.artistId 
            });
        }
        
        this.showMessage('Playing all tracks...');
    }

    setupShareButton() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.share-artist-button')) {
                this.handleShareArtist();
            }
        });
    }

    handleShareArtist() {
        const artistName = document.querySelector('.artist-name')?.textContent || 'Unknown Artist';
        const shareData = {
            title: `${artistName} on PopFusion`,
            text: `Check out ${artistName} on PopFusion!`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(shareData.url);
            this.showMessage('Link copied to clipboard!');
        }
        
        if (window.trackEvent) {
            trackEvent('share_artist', { 
                artistId: this.artistId,
                method: navigator.share ? 'native' : 'clipboard'
            });
        }
    }

    setupHeaderEventListeners() {
        const header = document.querySelector('.artist-header');
        
        // Follow button
        const followButton = header?.querySelector('.follow-button');
        followButton?.addEventListener('click', () => this.handleFollow(followButton));
        
        // Play all button
        const playAllButton = header?.querySelector('.play-all-button');
        playAllButton?.addEventListener('click', () => this.handlePlayAll());
        
        // Share button
        const shareButton = header?.querySelector('.share-artist-button');
        shareButton?.addEventListener('click', () => this.handleShareArtist());
    }

    setupTracksEventListeners(container) {
        // Play track buttons
        container.querySelectorAll('.play-track-button').forEach(btn => {
            btn.addEventListener('click', () => {
                const trackId = btn.dataset.trackId;
                this.handlePlayTrack(trackId, btn);
            });
        });
        
        // Like track buttons
        container.querySelectorAll('.like-track').forEach(btn => {
            btn.addEventListener('click', () => {
                const trackId = btn.dataset.trackId;
                this.handleLikeTrack(trackId, btn);
            });
        });
        
        // Add to playlist buttons
        container.querySelectorAll('.add-to-playlist').forEach(btn => {
            btn.addEventListener('click', () => {
                const trackId = btn.dataset.trackId;
                this.handleAddToPlaylist(trackId);
            });
        });
    }

    handlePlayTrack(trackId, button) {
        // Update play button states
        document.querySelectorAll('.play-track-button').forEach(btn => btn.textContent = '▶');
        button.textContent = '⏸';
        
        if (window.trackEvent) {
            trackEvent('play_artist_track', { 
                trackId: trackId, 
                artistId: this.artistId 
            });
        }
    }

    handleLikeTrack(trackId, button) {
        const isLiked = button.textContent === '♥';
        button.textContent = isLiked ? '♡' : '♥';
        button.classList.toggle('liked', !isLiked);
        
        if (window.trackEvent) {
            trackEvent(isLiked ? 'unlike_artist_track' : 'like_artist_track', { 
                trackId: trackId, 
                artistId: this.artistId 
            });
        }
    }

    handleAddToPlaylist(trackId) {
        if (window.trackEvent) {
            trackEvent('add_artist_track_to_playlist', { 
                trackId: trackId, 
                artistId: this.artistId 
            });
        }
        
        this.showMessage('Added to playlist');
    }

    setupAlbumsEventListeners(container) {
        container.querySelectorAll('.play-album-button').forEach(btn => {
            btn.addEventListener('click', () => {
                const albumId = btn.dataset.albumId;
                this.handlePlayAlbum(albumId);
            });
        });
        
        container.querySelectorAll('.album-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.matches('.play-album-button')) {
                    const albumId = card.dataset.albumId;
                    // Navigate to album page
                    window.location.href = `album.html?id=${albumId}`;
                }
            });
        });
    }

    handlePlayAlbum(albumId) {
        if (window.trackEvent) {
            trackEvent('play_artist_album', { 
                albumId: albumId, 
                artistId: this.artistId 
            });
        }
        
        this.showMessage('Playing album...');
    }

    setupRelatedArtistsEventListeners(container) {
        container.querySelectorAll('.follow-related').forEach(btn => {
            btn.addEventListener('click', () => this.handleFollow(btn));
        });
    }

    setupLoadMoreButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.load-more-tracks')) {
                this.loadMoreTracks();
            } else if (e.target.matches('.load-more-albums')) {
                this.loadMoreAlbums();
            }
        });
    }

    async loadMoreTracks() {
        // Implementation for loading more tracks
        this.showMessage('Loading more tracks...');
    }

    async loadMoreAlbums() {
        // Implementation for loading more albums
        this.showMessage('Loading more albums...');
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    formatDuration(durationMs) {
        if (!durationMs) return '0:00';
        
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updatePageTitle(artistName) {
        document.title = `${artistName} - PopFusion`;
    }

    showLoadingState(show) {
        popFusionFetch.showSpinner(show);
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
    if (document.body.classList.contains('artist-page') || 
        window.location.pathname.includes('artist')) {
        new ArtistPageHandler();
    }
});

// Export for external use
window.ArtistPageHandler = ArtistPageHandler;