// PopFusion 2025 - Modern Interactions & Animations

class PopFusionApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupScrollEffects();
        this.setupSearchFunctionality();
        this.setupFloatingActionButton();
        this.setupTrendingFilters();
        this.setupAnimations();
        this.setupIntersectionObserver();
        this.setupParticleSystem();
    }

    // Loading Screen
    setupLoadingScreen() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }
            }, 1500);
        });
    }

    // Scroll Effects
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.glass-header');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Header hide/show on scroll
            if (header) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            }

            // Parallax effect for hero section
            const heroVisual = document.querySelector('.hero-visual');
            if (heroVisual && currentScrollY < window.innerHeight) {
                const parallaxSpeed = currentScrollY * 0.5;
                heroVisual.style.transform = `translateY(${parallaxSpeed}px)`;
            }

            lastScrollY = currentScrollY;
        });
    }

    // Neural Search Functionality
    setupSearchFunctionality() {
        const searchInput = document.querySelector('.search-input');
        const suggestions = document.querySelector('.ai-suggestions');

        if (searchInput && suggestions) {
            const mockSuggestions = [
                { icon: '🎵', text: 'Trending electronic beats', type: 'genre' },
                { icon: '🎤', text: 'Luna Eclipse - Neon Dreams', type: 'artist' },
                { icon: '🔥', text: 'Top charts this week', type: 'playlist' },
                { icon: '🎧', text: 'Spatial audio tracks', type: 'feature' },
                { icon: '🌙', text: 'Late night vibes', type: 'mood' }
            ];

            searchInput.addEventListener('focus', () => {
                this.showSuggestions(suggestions, mockSuggestions);
            });

            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    suggestions.style.display = 'none';
                }, 200);
            });

            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                if (query.length > 0) {
                    const filtered = mockSuggestions.filter(item => 
                        item.text.toLowerCase().includes(query)
                    );
                    this.showSuggestions(suggestions, filtered);
                } else {
                    this.showSuggestions(suggestions, mockSuggestions);
                }
            });
        }
    }

    showSuggestions(container, suggestions) {
        container.innerHTML = suggestions.map(item => `
            <div class="suggestion-item" data-type="${item.type}">
                <span class="suggestion-icon">${item.icon}</span>
                <span class="suggestion-text">${item.text}</span>
            </div>
        `).join('');
        
        container.style.display = 'block';

        // Add click handlers
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const text = item.querySelector('.suggestion-text').textContent;
                document.querySelector('.search-input').value = text;
                container.style.display = 'none';
                this.handleSearch(text, item.dataset.type);
            });
        });
    }

    handleSearch(query, type) {
        console.log(`Searching for: ${query} (Type: ${type})`);
        // Implement actual search functionality here
        this.showSearchResults(query, type);
    }

    showSearchResults(query, type) {
        // Create a simple notification for demo
        this.showNotification(`Searching for "${query}" in ${type}...`, 'info');
    }

    // Floating Action Button
    setupFloatingActionButton() {
        const fabMain = document.querySelector('.fab-main');
        const fabItems = document.querySelectorAll('.fab-item');

        if (fabMain) {
            fabItems.forEach(item => {
                item.addEventListener('click', () => {
                    const action = item.dataset.action;
                    this.handleFabAction(action);
                });
            });
        }
    }

    handleFabAction(action) {
        switch (action) {
            case 'play':
                this.showNotification('🎵 Starting your personalized mix...', 'success');
                break;
            case 'search':
                document.querySelector('.search-input')?.focus();
                break;
            case 'share':
                this.shareCurrentPage();
                break;
            default:
                console.log(`FAB action: ${action}`);
        }
    }

    shareCurrentPage() {
        if (navigator.share) {
            navigator.share({
                title: 'PopFusion 2025',
                text: 'Check out the future of music discovery!',
                url: window.location.href
            });
        } else {
            // Fallback for browsers without Web Share API
            navigator.clipboard.writeText(window.location.href);
            this.showNotification('🔗 Link copied to clipboard!', 'success');
        }
    }

    // Trending Filters
    setupTrendingFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const trendingCards = document.querySelectorAll('.trending-card');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                this.filterTrendingContent(filter, trendingCards);
            });
        });
    }

    filterTrendingContent(filter, cards) {
        cards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                // Simple demo filtering - in real app, cards would have data attributes
                const shouldShow = Math.random() > 0.3; // Random for demo
                card.style.display = shouldShow ? 'block' : 'none';
                if (shouldShow) {
                    card.style.animation = 'fadeInUp 0.5s ease-out';
                }
            }
        });

        this.showNotification(`Filtered by: ${filter}`, 'info');
    }

    // Animations
    setupAnimations() {
        // Play button hover effects
        document.querySelectorAll('.play-button').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translate(-50%, -50%) scale(1.1)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(-50%, -50%) scale(1)';
            });

            btn.addEventListener('click', () => {
                this.playTrack(btn);
            });
        });

        // Feature card interactions
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateFeatureCard(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateFeatureCard(card, false);
            });
        });

        // Artist follow buttons
        document.querySelectorAll('.follow-btn, .follow-mini').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleFollow(btn);
            });
        });
    }

    playTrack(button) {
        const card = button.closest('.trending-card');
        const title = card?.querySelector('.track-title')?.textContent || 'Unknown Track';
        
        // Visual feedback
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
        `;
        
        setTimeout(() => {
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        }, 2000);

        this.showNotification(`🎵 Now playing: ${title}`, 'success');
    }

    animateFeatureCard(card, isHover) {
        const icon = card.querySelector('.feature-icon');
        const demo = card.querySelector('.feature-demo');
        
        if (isHover) {
            if (icon) icon.style.transform = 'scale(1.1) rotate(5deg)';
            if (demo) demo.style.opacity = '1';
        } else {
            if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
            if (demo) demo.style.opacity = '0.8';
        }
    }

    toggleFollow(button) {
        const isFollowing = button.textContent.includes('Following');
        
        if (isFollowing) {
            button.textContent = button.textContent.replace('Following', 'Follow');
            button.style.background = 'var(--bg-glass)';
            this.showNotification('Unfollowed artist', 'info');
        } else {
            button.textContent = button.textContent.replace('Follow', 'Following');
            button.style.background = 'var(--primary-gradient)';
            this.showNotification('✨ Following artist!', 'success');
        }
    }

    // Intersection Observer for scroll animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Stagger animations for grid items
                    if (entry.target.classList.contains('trending-card') || 
                        entry.target.classList.contains('feature-card') ||
                        entry.target.classList.contains('artist-card')) {
                        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                        entry.target.style.animationDelay = `${delay}ms`;
                    }
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.feature-card, .trending-card, .artist-card, .section-header').forEach(el => {
            observer.observe(el);
        });
    }

    // Particle System
    setupParticleSystem() {
        const particleContainer = document.querySelector('.floating-particles');
        if (!particleContainer) return;

        // Create additional particles dynamically
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${15 + Math.random() * 10}s`;
            particleContainer.appendChild(particle);
        }
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' :
                       type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                       'var(--bg-glass)',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid var(--border-glass)',
            backdropFilter: 'blur(20px)',
            boxShadow: 'var(--shadow-glow)',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease-out',
            maxWidth: '300px'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.closeNotification(notification);
        });

        // Auto close
        setTimeout(() => {
            this.closeNotification(notification);
        }, 4000);
    }

    closeNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Utility Methods
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

// Additional CSS for animations (injected via JavaScript)
const additionalStyles = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }

    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    /* Enhanced hover effects */
    .trending-card:hover .card-image::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2));
        opacity: 0;
        animation: overlayFade 0.3s ease-out forwards;
    }

    @keyframes overlayFade {
        to { opacity: 1; }
    }

    /* Improved spatial audio visualization */
    .spatial-visualizer:hover .spatial-dot {
        animation-duration: 1s;
    }

    .spatial-visualizer:hover .spatial-wave {
        animation-duration: 1s;
    }

    /* Enhanced button interactions */
    .hero-btn:active {
        transform: translateY(-1px) scale(0.98);
    }

    .action-btn:active {
        transform: translateY(-1px) scale(0.98);
    }

    /* Smooth transitions for all interactive elements */
    .trending-card,
    .feature-card,
    .artist-card,
    .hero-btn,
    .action-btn,
    .fab-main,
    .fab-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopFusionApp();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PopFusionApp;
}