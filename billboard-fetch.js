/**
 * Billboard/Charts Page Fetch Integration
 */

class BillboardPageHandler {
    constructor() {
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMore = true;
        this.chartType = 'hot100'; // Default chart
        this.refreshInterval = 30 * 60 * 1000; // 30 minutes
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialContent();
        this.setupAutoRefresh();
    }

    setupEventListeners() {
        // Chart type selector
        this.setupChartSelector();
        
        // Refresh button
        const refreshButton = document.querySelector('.refresh-charts');
        refreshButton?.addEventListener('click', () => this.refreshCharts());

        // Time period selector
        this.setupTimePeriodSelector();

        // Export functionality
        this.setupExportOptions();

        // Infinite scroll for longer charts
        this.setupInfiniteScroll();
    }

    async loadInitialContent() {
        await this.loadCharts(false);
    }

    async loadCharts(clearExisting = false) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState(true);
        
        try {
            const data = await popFusionFetch.fetchBillboardCharts(this.currentPage);
            this.renderCharts(data, clearExisting);
            
            this.hasMore = data.tracks.length === 10; // Assuming 10 tracks per page
            if (data.tracks.length > 0) {
                this.currentPage++;
            }

            // Update last refresh time
            this.updateLastRefreshTime(data.lastUpdated);
            
        } catch (error) {
            console.error('Failed to load billboard charts:', error);
            this.showErrorMessage('Failed to load charts. Please try again.');
        } finally {
            this.isLoading = false;
            this.showLoadingState(false);
        }
    }

    renderCharts(data, clearExisting = false) {
        const container = document.querySelector('.billboard-grid') || 
                         document.querySelector('.charts-container') ||
                         this.createChartsContainer();

        if (clearExisting) {
            container.innerHTML = '';
        }

        data.tracks.forEach((track, index) => {
            const position = clearExisting ? index + 1 : container.children.length + 1;
            const card = this.createChartCard(track, position);
            container.appendChild(card);
        });

        // Update chart statistics
        this.updateChartStats(data);
    }

    createChartCard(track, position) {
        const card = document.createElement('article');
        card.className = 'billboard-card chart-item';
        
        const imageUrl = track.album?.images?.[0]?.url || 
                        track.image || 
                        'https://images.pexels.com/photos/96380/pexels-photo-96380.jpeg';
        
        const title = track.name || track.title || 'Unknown Track';
        const artist = track.artists?.[0]?.name || track.artist || 'Unknown Artist';
        const album = track.album?.name || 'Unknown Album';
        const previousPosition = track.previous_position || position;
        const weeksOnChart = track.weeks_on_chart || 1;
        const peakPosition = track.peak_position || position;

        // Calculate position change
        const positionChange = previousPosition - position;
        const changeIcon = positionChange > 0 ? '↑' : positionChange < 0 ? '↓' : '−';
        const changeClass = positionChange > 0 ? 'up' : positionChange < 0 ? 'down' : 'same';

        card.innerHTML = `
            <div class="chart-position">
                <span class="position-number">${position}</span>
                <div class="position-change ${changeClass}">
                    <span class="change-icon">${changeIcon}</span>
                    <span class="change-value">${Math.abs(positionChange)}</span>
                </div>
            </div>
            <div class="track-image">
                <img src="${imageUrl}" alt="${title}" loading="lazy">
                <div class="play-overlay">
                    <button class="play-button" data-id="${track.id}">▶</button>
                </div>
            </div>
            <div class="track-info">
                <h3 class="track-title">${title}</h3>
                <p class="track-artist">${artist}</p>
                <p class="track-album">${album}</p>
                <div class="chart-stats">
                    <span class="weeks-on-chart">${weeksOnChart} weeks</span>
                    <span class="peak-position">Peak: #${peakPosition}</span>
                </div>
            </div>
            <div class="track-actions">
                <button class="like-button" data-id="${track.id}">♡</button>
                <button class="add-playlist" data-id="${track.id}">Add to Playlist</button>
                <button class="share-button" data-id="${track.id}">Share</button>
                <a href="${track.external_urls?.spotify || '#'}" class="listen-now" target="_blank">Listen</a>
            </div>
        `;

        this.setupChartCardEventListeners(card, track, position);
        return card;
    }

    setupChartCardEventListeners(card, track, position) {
        // Play button
        const playButton = card.querySelector('.play-button');
        playButton?.addEventListener('click', () => this.handlePlay(track, position));

        // Like button
        const likeButton = card.querySelector('.like-button');
        likeButton?.addEventListener('click', (e) => this.handleLike(track, e.target));

        // Add to playlist
        const addPlaylistButton = card.querySelector('.add-playlist');
        addPlaylistButton?.addEventListener('click', () => this.handleAddToPlaylist(track));

        // Share button
        const shareButton = card.querySelector('.share-button');
        shareButton?.addEventListener('click', () => this.handleShare(track, position));

        // Listen now tracking
        const listenButton = card.querySelector('.listen-now');
        listenButton?.addEventListener('click', () => {
            if (window.trackEvent) {
                trackEvent('chart_listen', { 
                    trackId: track.id, 
                    position: position,
                    chartType: this.chartType
                });
            }
        });
    }

    handlePlay(track, position) {
        console.log('Playing chart track:', track, 'at position:', position);
        
        // Update play button states
        const playButtons = document.querySelectorAll('.play-button');
        playButtons.forEach(btn => btn.textContent = '▶');
        event.target.textContent = '⏸';
        
        if (window.trackEvent) {
            trackEvent('chart_play', { 
                trackId: track.id, 
                position: position,
                chartType: this.chartType,
                artist: track.artists?.[0]?.name
            });
        }
    }

    handleLike(track, button) {
        const isLiked = button.textContent === '♥';
        button.textContent = isLiked ? '♡' : '♥';
        button.classList.toggle('liked', !isLiked);
        
        if (window.trackEvent) {
            trackEvent(isLiked ? 'chart_unlike' : 'chart_like', { 
                trackId: track.id,
                chartType: this.chartType
            });
        }
        
        this.showMessage(isLiked ? 'Removed from favorites' : 'Added to favorites');
    }

    handleAddToPlaylist(track) {
        console.log('Adding chart track to playlist:', track);
        
        if (window.trackEvent) {
            trackEvent('chart_add_playlist', { 
                trackId: track.id,
                chartType: this.chartType
            });
        }
        
        this.showMessage('Added to playlist');
    }

    handleShare(track, position) {
        const shareData = {
            title: `#${position} ${track.name} by ${track.artists?.[0]?.name}`,
            text: `Check out this chart-topping track on PopFusion!`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(shareData.url);
            this.showMessage('Link copied to clipboard!');
        }
        
        if (window.trackEvent) {
            trackEvent('chart_share', { 
                trackId: track.id, 
                position: position,
                chartType: this.chartType,
                method: navigator.share ? 'native' : 'clipboard'
            });
        }
    }

    setupChartSelector() {
        let selectorContainer = document.querySelector('.chart-selector');
        if (!selectorContainer) {
            selectorContainer = document.createElement('div');
            selectorContainer.className = 'chart-selector';
            
            const main = document.querySelector('main');
            const chartsContainer = document.querySelector('.billboard-grid');
            if (main && chartsContainer) {
                main.insertBefore(selectorContainer, chartsContainer);
            }
        }

        const chartTypes = [
            { value: 'hot100', label: 'Hot 100' },
            { value: 'billboard200', label: 'Billboard 200' },
            { value: 'artist100', label: 'Artist 100' },
            { value: 'streaming', label: 'Streaming Songs' },
            { value: 'radio', label: 'Radio Songs' },
            { value: 'digital', label: 'Digital Songs' }
        ];

        selectorContainer.innerHTML = `
            <h3>Select Chart</h3>
            <div class="chart-buttons">
                ${chartTypes.map(chart => 
                    `<button class="chart-btn ${chart.value === this.chartType ? 'active' : ''}" 
                             data-chart="${chart.value}">${chart.label}</button>`
                ).join('')}
            </div>
        `;

        // Add event listeners
        selectorContainer.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleChartChange(btn));
        });
    }

    async handleChartChange(button) {
        // Update active state
        document.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        this.chartType = button.dataset.chart;
        this.currentPage = 1;
        this.hasMore = true;
        
        await this.loadCharts(true);
        
        if (window.trackEvent) {
            trackEvent('chart_change', { 
                chartType: this.chartType 
            });
        }
    }

    setupTimePeriodSelector() {
        let periodContainer = document.querySelector('.time-period-selector');
        if (!periodContainer) {
            periodContainer = document.createElement('div');
            periodContainer.className = 'time-period-selector';
            
            const chartSelector = document.querySelector('.chart-selector');
            if (chartSelector) {
                chartSelector.appendChild(periodContainer);
            }
        }

        periodContainer.innerHTML = `
            <label for="time-period">Time Period:</label>
            <select id="time-period" class="period-select">
                <option value="current">Current Week</option>
                <option value="last-week">Last Week</option>
                <option value="month">This Month</option>
                <option value="year">Year-End</option>
            </select>
        `;

        const periodSelect = periodContainer.querySelector('#time-period');
        periodSelect?.addEventListener('change', () => this.handleTimePeriodChange(periodSelect.value));
    }

    async handleTimePeriodChange(period) {
        this.currentPage = 1;
        this.hasMore = true;
        
        await this.loadCharts(true);
        
        if (window.trackEvent) {
            trackEvent('chart_period_change', { 
                period: period,
                chartType: this.chartType
            });
        }
    }

    setupExportOptions() {
        let exportContainer = document.querySelector('.export-options');
        if (!exportContainer) {
            exportContainer = document.createElement('div');
            exportContainer.className = 'export-options';
            
            const chartSelector = document.querySelector('.chart-selector');
            if (chartSelector) {
                chartSelector.appendChild(exportContainer);
            }
        }

        exportContainer.innerHTML = `
            <button class="export-btn" data-format="csv">Export CSV</button>
            <button class="export-btn" data-format="json">Export JSON</button>
            <button class="export-btn" data-format="playlist">Create Playlist</button>
        `;

        exportContainer.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleExport(btn.dataset.format));
        });
    }

    handleExport(format) {
        const tracks = Array.from(document.querySelectorAll('.billboard-card')).map((card, index) => {
            const title = card.querySelector('.track-title')?.textContent || '';
            const artist = card.querySelector('.track-artist')?.textContent || '';
            const album = card.querySelector('.track-album')?.textContent || '';
            
            return {
                position: index + 1,
                title,
                artist,
                album
            };
        });

        switch (format) {
            case 'csv':
                this.exportCSV(tracks);
                break;
            case 'json':
                this.exportJSON(tracks);
                break;
            case 'playlist':
                this.createPlaylist(tracks);
                break;
        }

        if (window.trackEvent) {
            trackEvent('chart_export', { 
                format: format,
                chartType: this.chartType,
                trackCount: tracks.length
            });
        }
    }

    exportCSV(tracks) {
        const csv = [
            'Position,Title,Artist,Album',
            ...tracks.map(track => 
                `${track.position},"${track.title}","${track.artist}","${track.album}"`
            )
        ].join('\n');

        this.downloadFile(csv, `${this.chartType}-chart.csv`, 'text/csv');
    }

    exportJSON(tracks) {
        const json = JSON.stringify({
            chartType: this.chartType,
            exportDate: new Date().toISOString(),
            tracks: tracks
        }, null, 2);

        this.downloadFile(json, `${this.chartType}-chart.json`, 'application/json');
    }

    createPlaylist(tracks) {
        // This would integrate with a playlist service
        console.log('Creating playlist with tracks:', tracks);
        this.showMessage('Playlist creation feature coming soon!');
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage(`Downloaded ${filename}`);
    }

    setupInfiniteScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.hasMore && !this.isLoading) {
                    this.loadCharts(false);
                }
            });
        }, {
            rootMargin: '100px'
        });

        const sentinel = document.createElement('div');
        sentinel.className = 'scroll-sentinel';
        sentinel.style.height = '1px';
        
        const container = document.querySelector('.billboard-grid') || 
                         this.createChartsContainer();
        
        container.parentNode.appendChild(sentinel);
        observer.observe(sentinel);
    }

    setupAutoRefresh() {
        setInterval(() => {
            this.refreshCharts();
        }, this.refreshInterval);
    }

    async refreshCharts() {
        console.log('Refreshing charts...');
        this.currentPage = 1;
        this.hasMore = true;
        
        // Clear cache for fresh data
        popFusionFetch.clearCache();
        
        await this.loadCharts(true);
        
        if (window.trackEvent) {
            trackEvent('chart_refresh', { 
                chartType: this.chartType 
            });
        }
        
        this.showMessage('Charts refreshed!');
    }

    updateLastRefreshTime(timestamp) {
        let refreshElement = document.querySelector('.last-refresh');
        
        if (!refreshElement) {
            refreshElement = document.createElement('div');
            refreshElement.className = 'last-refresh';
            
            const container = document.querySelector('.billboard-grid');
            if (container) {
                container.parentNode.insertBefore(refreshElement, container);
            }
        }
        
        const date = new Date(timestamp);
        refreshElement.textContent = `Last updated: ${date.toLocaleString()}`;
    }

    updateChartStats(data) {
        let statsElement = document.querySelector('.chart-stats-summary');
        
        if (!statsElement) {
            statsElement = document.createElement('div');
            statsElement.className = 'chart-stats-summary';
            
            const container = document.querySelector('.billboard-grid');
            if (container) {
                container.parentNode.insertBefore(statsElement, container);
            }
        }
        
        statsElement.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-value">${data.tracks.length}</span>
                    <span class="stat-label">Tracks</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${this.chartType.toUpperCase()}</span>
                    <span class="stat-label">Chart</span>
                </div>
            </div>
        `;
    }

    createChartsContainer() {
        const container = document.createElement('div');
        container.className = 'billboard-grid charts-container';
        
        const main = document.querySelector('main') || document.body;
        main.appendChild(container);
        
        return container;
    }

    showLoadingState(show) {
        const container = document.querySelector('.billboard-grid');
        if (container) {
            container.classList.toggle('loading', show);
        }
        
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
    if (document.body.classList.contains('billboard-page') || 
        window.location.pathname.includes('billboard')) {
        new BillboardPageHandler();
    }
});

// Export for external use
window.BillboardPageHandler = BillboardPageHandler;