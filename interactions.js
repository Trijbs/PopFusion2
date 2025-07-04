/**
 * PopFusion Interactions - Enhanced UI interactions for styles.min.css
 * Provides modern 2025 interactions while maintaining compatibility with existing structure
 */

class PopFusionInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupScrollEffects();
        this.setupSearchEnhancements();
        this.setupFloatingActionButton();
        this.setupCardAnimations();
        this.setupParticleSystem();
        this.setupIntersectionObserver();
        this.setupModernInteractions();
        this.setupNotificationSystem();
    }

    // Loading Screen
    setupLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-logo">
                    <svg class="loading-svg" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="45" stroke="url(#gradient)" stroke-width="8" stroke-linecap="round" stroke-dasharray="283" stroke-dashoffset="75"/>
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#6366f1"/>
                                <stop offset="50%" style="stop-color:#8b5cf6"/>
                                <stop offset="100%" style="stop-color:#ec4899"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div class="loading-text">PopFusion</div>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
            </div>
        `;
        document.body.appendChild(loadingScreen);

        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => loadingScreen.remove(), 500);
            }, 1500);
        });
    }

    // Enhanced Scroll Effects
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.sticky-header');
        
        if (header) {
            header.classList.add('glass-header');
            
            window.addEventListener('scroll', this.throttle(() => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100) {
                    if (currentScrollY > lastScrollY) {
                        header.style.transform = 'translateY(-100%)';
                    } else {
                        header.style.transform = 'translateY(0)';
                    }
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollY = currentScrollY;
            }, 100));
        }

        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero-carousel');
        if (heroSection) {
            window.addEventListener('scroll', this.throttle(() => {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.5;
                heroSection.style.transform = `translateY(${parallax}px)`;
            }, 16));
        }
    }

    // Enhanced Search Functionality
    setupSearchEnhancements() {
        const searchInput = document.querySelector('.search-bar input');
        const searchContainer = document.querySelector('.search-bar');
        
        if (searchInput && searchContainer) {
            searchContainer.classList.add('neural-search', 'search-container');
            
            // Create AI suggestions container
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'ai-suggestions';
            searchContainer.appendChild(suggestionsContainer);

            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                if (query.length > 2) {
                    searchTimeout = setTimeout(() => {
                        this.showAISuggestions(suggestionsContainer, query);
                    }, 300);
                } else {
                    suggestionsContainer.style.display = 'none';
                }
            });

            // Hide suggestions when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchContainer.contains(e.target)) {
                    suggestionsContainer.style.display = 'none';
                }
            });
        }
    }

    showAISuggestions(container, query) {
        const suggestions = [
            { icon: '🎵', text: `"${query}" in songs`, type: 'song' },
            { icon: '👤', text: `"${query}" artists`, type: 'artist' },
            { icon: '💿', text: `"${query}" albums`, type: 'album' },
            { icon: '🎧', text: `"${query}" playlists`, type: 'playlist' }
        ];

        container.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" data-type="${suggestion.type}" data-query="${query}">
                <span>${suggestion.icon}</span>
                <span>${suggestion.text}</span>
            </div>
        `).join('');

        container.style.display = 'block';

        // Add click handlers
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                const searchQuery = item.dataset.query;
                this.handleSearch(searchQuery, type);
                container.style.display = 'none';
            });
        });
    }

    handleSearch(query, type) {
        this.showNotification(`Searching for ${type}: "${query}"`, 'info');
        // Integrate with existing search functionality
        if (window.searchMusic) {
            window.searchMusic(query);
        }
    }

    // Floating Action Button
    setupFloatingActionButton() {
        const fabContainer = document.createElement('div');
        fabContainer.className = 'fab-container';
        fabContainer.innerHTML = `
            <button class="fab-main" aria-label="Quick Actions">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            </button>
            <div class="fab-menu">
                <button class="fab-item" data-action="share" aria-label="Share">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                    </svg>
                </button>
                <button class="fab-item" data-action="theme" aria-label="Toggle Theme">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                    </svg>
                </button>
                <button class="fab-item" data-action="playlist" aria-label="Create Playlist">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                    </svg>
                </button>
            </div>
        `;
        document.body.appendChild(fabContainer);

        // Add event listeners
        fabContainer.querySelectorAll('.fab-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleFabAction(action);
            });
        });
    }

    handleFabAction(action) {
        switch (action) {
            case 'share':
                this.shareCurrentPage();
                break;
            case 'theme':
                this.toggleTheme();
                break;
            case 'playlist':
                this.showNotification('Create Playlist feature coming soon!', 'info');
                break;
        }
    }

    shareCurrentPage() {
        if (navigator.share) {
            navigator.share({
                title: 'PopFusion - Unite Your Music Journey',
                text: 'Discover amazing music on PopFusion!',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            this.showNotification('Link copied to clipboard!', 'success');
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.showNotification(`Switched to ${newTheme} theme`, 'success');
    }

    // Enhanced Card Animations
    setupCardAnimations() {
        const cards = document.querySelectorAll('.chart-card, .artist-card, .news-card, .social-card, .genre-card, .billboard-card, .discover-card, .spotify-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCard(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCard(card, false);
            });

            // Add play button animations
            const playButton = card.querySelector('.listen-now, .play-preview');
            if (playButton) {
                playButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.animatePlayButton(playButton);
                });
            }
        });
    }

    animateCard(card, isHover) {
        if (isHover) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.3)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        }
    }

    animatePlayButton(button) {
        button.style.transform = 'scale(0.95)';
        button.innerHTML = '⏸️ Playing...';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            setTimeout(() => {
                button.innerHTML = '▶️ Play';
            }, 2000);
        }, 150);
        
        this.showNotification('Playing track...', 'success');
    }

    // Particle System
    setupParticleSystem() {
        const ambientBg = document.createElement('div');
        ambientBg.className = 'ambient-bg';
        ambientBg.innerHTML = `
            <div class="bg-gradient"></div>
            <div class="floating-particles">
                ${Array.from({length: 8}, (_, i) => `<div class="particle"></div>`).join('')}
            </div>
        `;
        document.body.appendChild(ambientBg);
    }

    // Intersection Observer for Scroll Animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe sections and cards
        const elementsToObserve = document.querySelectorAll('.trending-charts, .featured-artists, .news-feed, .social-trending, .chart-card, .artist-card, .news-card');
        elementsToObserve.forEach(el => observer.observe(el));
    }

    // Modern Interactions
    setupModernInteractions() {
        // Enhanced button interactions
        const buttons = document.querySelectorAll('button, .cta-button, .listen-now, .read-more, .follow-button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });

        // Form enhancements
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = 'scale(1)';
            });
        });
    }

    // Notification System
    setupNotificationSystem() {
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(notificationContainer);
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        
        const colors = {
            success: 'var(--success-color)',
            error: '#ef4444',
            info: 'var(--primary-color)',
            warning: '#f59e0b'
        };

        notification.style.cssText = `
            background: var(--bg-glass);
            border: 1px solid var(--border-glass);
            border-left: 4px solid ${colors[type]};
            color: var(--text-primary);
            padding: 16px 20px;
            border-radius: 12px;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: var(--shadow-lg);
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            max-width: 300px;
            cursor: pointer;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                <span>${message}</span>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // Utility Functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopFusionInteractions();
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PopFusionInteractions();
    });
} else {
    new PopFusionInteractions();
}