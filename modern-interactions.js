// PopFusion 2025 - Community Platform Interactions
// Modern 2025/2026 Design Implementation

class PopFusionCommunity {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupScrollEffects();
        this.setupSearchFunctionality();
        this.setupFloatingActionButton();
        this.setupTrendingFilters();
        this.setupCommunityAnimations();
        this.setupIntersectionObserver();
        this.setupParticleSystem();
        this.setupCommunityFeatures();
        this.setupNotificationSystem();
    }

    // Enhanced Loading Screen
    setupLoadingScreen() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        this.showWelcomeNotification();
                    }, 500);
                }
            }, 2000); // Slightly longer for community feel
        });
    }

    showWelcomeNotification() {
        this.showNotification('🌟 Welcome to the PopFusion Community!', 'success');
    }

    // Advanced Scroll Effects
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.glass-header');
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            if (header) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            }

            // Parallax effect for community showcase
            const showcase = document.querySelector('.community-showcase');
            if (showcase && currentScrollY < window.innerHeight) {
                const parallaxSpeed = currentScrollY * 0.3;
                showcase.style.transform = `translateY(${parallaxSpeed}px)`;
            }

            // Update floating particles based on scroll
            this.updateParticlesOnScroll(currentScrollY);

            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    updateParticlesOnScroll(scrollY) {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.1;
            const yPos = scrollY * speed;
            particle.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Enhanced Neural Search with Community Focus
    setupSearchFunctionality() {
        const searchInput = document.querySelector('.search-input');
        const suggestions = document.querySelector('.ai-suggestions');

        if (searchInput && suggestions) {
            const communitySearchSuggestions = [
                { icon: '👥', text: 'Find music communities near you', type: 'community' },
                { icon: '🎵', text: 'Trending community playlists', type: 'playlist' },
                { icon: '🎤', text: 'Local artists and creators', type: 'artist' },
                { icon: '🎉', text: 'Upcoming community events', type: 'event' },
                { icon: '💬', text: 'Join music discussions', type: 'discussion' },
                { icon: '🎧', text: 'Collaborative listening sessions', type: 'session' },
                { icon: '🌟', text: 'Community favorites this week', type: 'trending' },
                { icon: '🎼', text: 'Genre-specific communities', type: 'genre' }
            ];

            searchInput.addEventListener('focus', () => {
                this.showSuggestions(suggestions, communitySearchSuggestions);
                this.trackEvent('search_focus');
            });

            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    suggestions.style.display = 'none';
                }, 200);
            });

            searchInput.addEventListener('input', this.debounce((e) => {
                const query = e.target.value.toLowerCase();
                if (query.length > 0) {
                    const filtered = communitySearchSuggestions.filter(item => 
                        item.text.toLowerCase().includes(query)
                    );
                    this.showSuggestions(suggestions, filtered);
                } else {
                    this.showSuggestions(suggestions, communitySearchSuggestions);
                }
            }, 300));
        }
    }

    showSuggestions(container, suggestions) {
        container.innerHTML = suggestions.map(item => `
            <div class="suggestion-item" data-type="${item.type}">
                <span class="suggestion-icon">${item.icon}</span>
                <span class="suggestion-text">${item.text}</span>
                <span class="suggestion-category">${item.type}</span>
            </div>
        `).join('');
        
        container.style.display = 'block';

        // Add click handlers with enhanced feedback
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const text = item.querySelector('.suggestion-text').textContent;
                const type = item.dataset.type;
                document.querySelector('.search-input').value = text;
                container.style.display = 'none';
                this.handleCommunitySearch(text, type);
            });
        });
    }

    handleCommunitySearch(query, type) {
        this.trackEvent('community_search', { query, type });
        
        const searchMessages = {
            community: `🔍 Finding communities for "${query}"...`,
            playlist: `🎵 Searching community playlists...`,
            artist: `🎤 Looking for artists in your area...`,
            event: `🎉 Finding upcoming events...`,
            discussion: `💬 Searching discussions...`,
            session: `🎧 Finding listening sessions...`,
            trending: `🌟 Loading trending content...`,
            genre: `🎼 Exploring genre communities...`
        };

        const message = searchMessages[type] || `Searching for "${query}"...`;
        this.showNotification(message, 'info');
        
        // Simulate search results after delay
        setTimeout(() => {
            this.showSearchResults(query, type);
        }, 1500);
    }

    showSearchResults(query, type) {
        const resultMessages = {
            community: `Found 12 communities matching "${query}"`,
            playlist: `Discovered 45 community playlists`,
            artist: `Found 8 local artists`,
            event: `3 events happening this week`,
            discussion: `15 active discussions found`,
            session: `2 live sessions available now`,
            trending: `Loaded this week's trending content`,
            genre: `Found 6 active genre communities`
        };

        const message = resultMessages[type] || `Search completed for "${query}"`;
        this.showNotification(message, 'success');
    }

    // Enhanced Floating Action Button
    setupFloatingActionButton() {
        const fabMain = document.querySelector('.fab-main');
        const fabItems = document.querySelectorAll('.fab-item');

        if (fabMain) {
            // Add rotation animation on hover
            fabMain.addEventListener('mouseenter', () => {
                fabMain.style.transform = 'scale(1.1) rotate(45deg)';
            });

            fabMain.addEventListener('mouseleave', () => {
                fabMain.style.transform = 'scale(1) rotate(0deg)';
            });

            fabItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = item.dataset.action;
                    this.handleFabAction(action);
                    
                    // Visual feedback
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.transform = 'scale(1)';
                    }, 150);
                });
            });
        }
    }

    handleFabAction(action) {
        this.trackEvent('fab_action', { action });
        
        switch (action) {
            case 'play':
                this.startCommunityPlaylist();
                break;
            case 'search':
                document.querySelector('.search-input')?.focus();
                this.showNotification('🔍 Search the community...', 'info');
                break;
            case 'share':
                this.shareCommunityPage();
                break;
            default:
                console.log(`FAB action: ${action}`);
        }
    }

    startCommunityPlaylist() {
        this.showNotification('🎵 Starting Community Mix...', 'success');
        // Simulate playlist start
        setTimeout(() => {
            this.showNotification('♪ Now playing: Community Favorites', 'info');
        }, 1000);
    }

    shareCommunityPage() {
        if (navigator.share) {
            navigator.share({
                title: 'PopFusion 2025 - Music Community',
                text: 'Join the ultimate music community! Discover, share, and connect.',
                url: window.location.href
            }).then(() => {
                this.showNotification('✨ Thanks for sharing!', 'success');
            });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('🔗 Community link copied!', 'success');
            });
        }
    }

    // Community-Specific Trending Filters
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
                this.filterCommunityContent(filter, trendingCards);
                this.trackEvent('filter_change', { filter });
            });
        });
    }

    filterCommunityContent(filter, cards) {
        cards.forEach((card, index) => {
            // Hide all cards first
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    // Enhanced filtering logic based on card classes
                    const shouldShow = card.classList.contains(`${filter}-card`) || Math.random() > 0.4;
                    card.style.display = shouldShow ? 'block' : 'none';
                }
                
                if (card.style.display !== 'none') {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            }, 200);
        });

        const filterMessages = {
            all: 'Showing all community content',
            playlists: 'Filtered by community playlists',
            artists: 'Showing featured artists',
            discussions: 'Displaying active discussions'
        };

        this.showNotification(filterMessages[filter] || `Filtered by: ${filter}`, 'info');
    }

    // Enhanced Community Animations
    setupCommunityAnimations() {
        // Play button interactions
        document.querySelectorAll('.play-button').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translate(-50%, -50%) scale(1.1)';
                btn.style.background = 'rgba(255, 255, 255, 1)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(-50%, -50%) scale(1)';
                btn.style.background = 'rgba(255, 255, 255, 0.9)';
            });

            btn.addEventListener('click', () => {
                this.playTrack(btn);
            });
        });

        // Community card interactions
        document.querySelectorAll('.trending-card, .feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCard(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCard(card, false);
            });
        });

        // Action button interactions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleActionButton(btn);
            });
        });

        // Community stats animation
        this.animateCommunityStats();
    }

    playTrack(button) {
        const card = button.closest('.trending-card');
        const title = card?.querySelector('.track-title')?.textContent || 'Community Track';
        
        // Enhanced visual feedback
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
        `;
        
        button.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
            button.style.background = 'rgba(255, 255, 255, 0.9)';
            button.style.color = 'var(--bg-primary)';
        }, 3000);

        this.showNotification(`🎵 Playing: ${title}`, 'success');
        this.trackEvent('track_play', { title });
    }

    animateCard(card, isHover) {
        if (isHover) {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.2)';
            
            // Animate any icons inside
            const icon = card.querySelector('.feature-icon, .activity-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        } else {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
            
            const icon = card.querySelector('.feature-icon, .activity-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        }
    }

    handleActionButton(button) {
        const action = button.textContent.trim();
        
        // Visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Handle different actions
        if (action.includes('❤️')) {
            this.handleLike(button);
        } else if (action.includes('🔄')) {
            this.handleShare(button);
        } else if (action.includes('💬')) {
            this.handleComment(button);
        } else if (action.includes('🎵')) {
            this.handlePlay(button);
        }
    }

    handleLike(button) {
        const currentCount = parseInt(button.textContent.match(/\d+/)?.[0] || '0');
        const newCount = currentCount + 1;
        button.textContent = button.textContent.replace(/\d+/, newCount);
        button.style.color = '#ec4899';
        this.showNotification('❤️ Liked!', 'success');
    }

    handleShare(button) {
        const currentCount = parseInt(button.textContent.match(/\d+/)?.[0] || '0');
        const newCount = currentCount + 1;
        button.textContent = button.textContent.replace(/\d+/, newCount);
        this.showNotification('🔄 Shared to your community!', 'success');
    }

    handleComment(button) {
        this.showNotification('💬 Opening comments...', 'info');
    }

    handlePlay(button) {
        this.showNotification('🎵 Added to your queue!', 'success');
    }

    animateCommunityStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
            
            if (numericValue) {
                let currentValue = 0;
                const increment = numericValue / 50;
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        stat.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        const displayValue = Math.floor(currentValue);
                        if (finalValue.includes('M')) {
                            stat.textContent = `${(displayValue / 1000000).toFixed(1)}M+`;
                        } else if (finalValue.includes('K')) {
                            stat.textContent = `${(displayValue / 1000).toFixed(0)}K+`;
                        } else {
                            stat.textContent = displayValue.toString();
                        }
                    }
                }, 50);
            }
        });
    }

    // Enhanced Intersection Observer
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
                        entry.target.classList.contains('highlight-card')) {
                        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                        entry.target.style.animationDelay = `${delay}ms`;
                    }

                    // Special animations for community elements
                    if (entry.target.classList.contains('community-stats')) {
                        setTimeout(() => this.animateCommunityStats(), 500);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.feature-card, .trending-card, .highlight-card, .section-header, .community-stats').forEach(el => {
            observer.observe(el);
        });
    }

    // Enhanced Particle System
    setupParticleSystem() {
        const particleContainer = document.querySelector('.floating-particles');
        if (!particleContainer) return;

        // Create additional dynamic particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${15 + Math.random() * 15}s`;
            
            // Vary particle sizes
            const size = 2 + Math.random() * 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particleContainer.appendChild(particle);
        }

        // Add interactive particles on user actions
        this.setupInteractiveParticles();
    }

    setupInteractiveParticles() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.primary-btn, .secondary-btn, .action-btn')) {
                this.createClickParticles(e.clientX, e.clientY);
            }
        });
    }

    createClickParticles(x, y) {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = 'linear-gradient(45deg, #6366f1, #8b5cf6)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10000';
            
            const angle = (i / 6) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            document.body.appendChild(particle);
            
            let posX = x;
            let posY = y;
            let opacity = 1;
            
            const animate = () => {
                posX += vx * 0.02;
                posY += vy * 0.02;
                opacity -= 0.02;
                
                particle.style.left = `${posX}px`;
                particle.style.top = `${posY}px`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    document.body.removeChild(particle);
                }
            };
            
            requestAnimationFrame(animate);
        }
    }

    // Community Features Setup
    setupCommunityFeatures() {
        // Setup community showcase cards animation
        this.setupShowcaseCards();
        
        // Setup live indicators
        this.setupLiveIndicators();
        
        // Setup audio visualizers
        this.setupAudioVisualizers();
    }

    setupShowcaseCards() {
        const showcaseCards = document.querySelectorAll('.showcase-card');
        
        showcaseCards.forEach((card, index) => {
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
                card.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.3)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
            
            // Add click interaction
            card.addEventListener('click', () => {
                this.handleShowcaseCardClick(card);
            });
        });
    }

    handleShowcaseCardClick(card) {
        const username = card.querySelector('.username')?.textContent;
        const activity = card.querySelector('.activity')?.textContent;
        
        this.showNotification(`👋 ${username}: ${activity}`, 'info');
        this.trackEvent('showcase_card_click', { username, activity });
    }

    setupLiveIndicators() {
        const liveIndicators = document.querySelectorAll('.live-dot, .live-indicator');
        
        liveIndicators.forEach(indicator => {
            // Enhanced pulsing animation
            indicator.style.animation = 'pulse 2s infinite, glow 3s infinite alternate';
        });
    }

    setupAudioVisualizers() {
        const waveforms = document.querySelectorAll('.waveform');
        
        waveforms.forEach(waveform => {
            const bars = waveform.querySelectorAll('.wave-bar');
            
            // Animate bars continuously
            bars.forEach((bar, index) => {
                bar.style.animationDelay = `${index * 0.1}s`;
                bar.style.animationDuration = `${1 + Math.random()}s`;
            });
        });
    }

    // Enhanced Notification System
    setupNotificationSystem() {
        // Create notification container if it doesn't exist
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info', duration = 4000) {
        const container = document.querySelector('.notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
            info: 'rgba(255, 255, 255, 0.1)'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Enhanced styles
        Object.assign(notification.style, {
            background: colors[type],
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transform: 'translateX(400px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            maxWidth: '350px',
            pointerEvents: 'all',
            fontSize: '14px',
            fontWeight: '500'
        });

        container.appendChild(notification);

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
        }, duration);

        return notification;
    }

    closeNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Analytics and Tracking
    trackEvent(eventName, data = {}) {
        // Enhanced event tracking for community features
        console.log(`[PopFusion Community] ${eventName}:`, data);
        
        // Send to analytics service (placeholder)
        if (window.gtag) {
            window.gtag('event', eventName, {
                event_category: 'community_interaction',
                ...data
            });
        }
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

    // Public API for external integrations
    joinCommunity(userId) {
        this.showNotification('🎉 Welcome to the community!', 'success');
        this.trackEvent('community_join', { userId });
    }

    leaveCommunity(userId) {
        this.showNotification('👋 Thanks for being part of our community!', 'info');
        this.trackEvent('community_leave', { userId });
    }

    shareToSocial(platform, content) {
        this.showNotification(`📱 Sharing to ${platform}...`, 'info');
        this.trackEvent('social_share', { platform, content });
    }
}

// Enhanced CSS Injection for Additional Animations
const enhancedStyles = `
    @keyframes glow {
        0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
        100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8); }
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
        opacity: 0.7;
    }

    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
        opacity: 1;
    }

    .suggestion-category {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-left: auto;
    }

    /* Enhanced hover effects for community elements */
    .showcase-card:hover {
        animation-play-state: paused;
    }

    .feature-card:hover .feature-icon {
        animation: iconBounce 0.6s ease-in-out;
    }

    @keyframes iconBounce {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.2) rotate(10deg); }
    }

    /* Improved mobile responsiveness */
    @media (max-width: 768px) {
        .notification-container {
            right: 10px;
            left: 10px;
        }
        
        .notification {
            max-width: none;
        }
        
        .fab-container {
            bottom: 20px;
            right: 20px;
        }
    }

    /* Enhanced accessibility */
    @media (prefers-reduced-motion: reduce) {
        .particle,
        .showcase-card,
        .live-dot {
            animation: none !important;
        }
    }

    /* High contrast mode improvements */
    @media (prefers-contrast: high) {
        .notification {
            border: 2px solid white;
        }
        
        .suggestion-item:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    }
`;

// Inject enhanced styles
const styleSheet = document.createElement('style');
styleSheet.textContent = enhancedStyles;
document.head.appendChild(styleSheet);

// Initialize the community platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.popFusionCommunity = new PopFusionCommunity();
    
    // Global event listeners for community features
    window.addEventListener('beforeunload', () => {
        window.popFusionCommunity.trackEvent('page_unload');
    });
    
    // Keyboard shortcuts for power users
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    document.querySelector('.search-input')?.focus();
                    break;
                case '/':
                    e.preventDefault();
                    document.querySelector('.search-input')?.focus();
                    break;
            }
        }
    });
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PopFusionCommunity;
}

// Global API for external integrations
window.PopFusionAPI = {
    showNotification: (message, type) => {
        if (window.popFusionCommunity) {
            window.popFusionCommunity.showNotification(message, type);
        }
    },
    trackEvent: (event, data) => {
        if (window.popFusionCommunity) {
            window.popFusionCommunity.trackEvent(event, data);
        }
    }
};