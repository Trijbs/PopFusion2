// PopFusion 2025 - Community Analytics
// Enhanced analytics for community-focused platform

class CommunityAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.startTime = Date.now();
        this.events = [];
        this.init();
    }

    init() {
        this.setupEventTracking();
        this.trackPageView();
        this.setupPerformanceTracking();
        this.setupEngagementTracking();
        this.setupCommunityMetrics();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getUserId() {
        let userId = localStorage.getItem('popfusion_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('popfusion_user_id', userId);
        }
        return userId;
    }

    trackEvent(eventType, details = {}) {
        const event = {
            eventType,
            details,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userId: this.userId,
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        this.events.push(event);
        this.saveToStorage(event);
        this.sendToAnalytics(event);
        
        console.log(`[PopFusion Analytics] ${eventType}:`, details);
    }

    saveToStorage(event) {
        const analytics = JSON.parse(localStorage.getItem('popfusion_analytics') || '[]');
        analytics.push(event);
        
        // Keep only last 1000 events to prevent storage overflow
        if (analytics.length > 1000) {
            analytics.splice(0, analytics.length - 1000);
        }
        
        localStorage.setItem('popfusion_analytics', JSON.stringify(analytics));
    }

    sendToAnalytics(event) {
        // Send to Google Analytics 4 if available
        if (typeof gtag !== 'undefined') {
            gtag('event', event.eventType, {
                event_category: 'community_interaction',
                event_label: event.details.label || '',
                value: event.details.value || 0,
                custom_parameters: event.details
            });
        }

        // Send to custom analytics endpoint (placeholder)
        if (window.ANALYTICS_ENDPOINT) {
            fetch(window.ANALYTICS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event)
            }).catch(err => console.warn('Analytics send failed:', err));
        }
    }

    trackPageView() {
        this.trackEvent('page_view', {
            page: window.location.pathname,
            title: document.title,
            referrer: document.referrer
        });
    }

    setupEventTracking() {
        // Enhanced click tracking for community elements
        document.addEventListener('click', (e) => {
            const target = e.target;
            const closest = target.closest.bind(target);

            // Community-specific tracking
            if (closest('.search-input, .search-button')) {
                const query = document.querySelector('.search-input')?.value || '';
                this.trackEvent('community_search', { 
                    query,
                    hasQuery: query.length > 0,
                    queryLength: query.length
                });
            }
            
            else if (closest('.primary-btn, .secondary-btn')) {
                this.trackEvent('cta_click', {
                    buttonText: target.textContent.trim(),
                    buttonType: target.classList.contains('primary-btn') ? 'primary' : 'secondary',
                    section: this.getSection(target)
                });
            }
            
            else if (closest('.play-button, .play-btn')) {
                const trackTitle = closest('.trending-card')?.querySelector('.track-title')?.textContent || 'Unknown';
                this.trackEvent('track_play', {
                    trackTitle,
                    section: this.getSection(target),
                    playMethod: 'button_click'
                });
            }
            
            else if (closest('.feature-card')) {
                const featureTitle = target.querySelector('h3')?.textContent || 'Unknown Feature';
                this.trackEvent('feature_interaction', {
                    featureTitle,
                    interactionType: 'card_click'
                });
            }
            
            else if (closest('.trending-card')) {
                const trackTitle = target.querySelector('.track-title')?.textContent || 'Unknown';
                this.trackEvent('trending_interaction', {
                    trackTitle,
                    interactionType: 'card_click'
                });
            }
            
            else if (closest('.filter-btn')) {
                const filter = target.dataset.filter || target.textContent.toLowerCase();
                this.trackEvent('filter_change', {
                    filter,
                    section: 'trending'
                });
            }
            
            else if (closest('.action-btn')) {
                const action = this.getActionType(target);
                this.trackEvent('social_action', {
                    action,
                    section: this.getSection(target)
                });
            }
            
            else if (closest('.fab-main, .fab-item')) {
                const action = target.dataset.action || 'main';
                this.trackEvent('fab_interaction', {
                    action,
                    fabType: target.classList.contains('fab-main') ? 'main' : 'item'
                });
            }
            
            else if (closest('.nav-link')) {
                this.trackEvent('navigation', {
                    linkText: target.textContent.trim(),
                    href: target.href || '',
                    section: 'header'
                });
            }
            
            else if (closest('.social-link')) {
                this.trackEvent('social_link_click', {
                    platform: this.getSocialPlatform(target),
                    section: 'footer'
                });
            }
        });

        // Form interactions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form')) {
                this.trackEvent('form_submit', {
                    formId: e.target.id || 'unknown',
                    formClass: e.target.className,
                    section: this.getSection(e.target)
                });
            }
        });

        // Input focus tracking
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.trackEvent('input_focus', {
                    inputType: e.target.type || e.target.tagName.toLowerCase(),
                    inputId: e.target.id || 'unknown',
                    section: this.getSection(e.target)
                });
            }
        }, true);
    }

    setupPerformanceTracking() {
        // Page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.trackEvent('performance', {
                        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        firstPaint: this.getFirstPaint(),
                        connectionType: navigator.connection?.effectiveType || 'unknown'
                    });
                }
            }, 1000);
        });

        // Core Web Vitals
        this.trackCoreWebVitals();
    }

    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    trackCoreWebVitals() {
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.trackEvent('core_web_vitals', {
                        metric: 'LCP',
                        value: lastEntry.startTime,
                        rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs-improvement' : 'poor'
                    });
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP tracking not supported');
            }
        }
    }

    setupEngagementTracking() {
        let scrollDepth = 0;
        let maxScrollDepth = 0;
        let timeOnPage = 0;
        let isActive = true;

        // Scroll depth tracking
        const trackScrollDepth = this.throttle(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollDepth = Math.round((scrollTop / docHeight) * 100);
            
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                
                // Track milestone scroll depths
                if ([25, 50, 75, 90].includes(maxScrollDepth)) {
                    this.trackEvent('scroll_depth', {
                        depth: maxScrollDepth,
                        section: this.getCurrentSection()
                    });
                }
            }
        }, 250);

        window.addEventListener('scroll', trackScrollDepth);

        // Time on page tracking
        const timeTracker = setInterval(() => {
            if (isActive) {
                timeOnPage += 1;
                
                // Track engagement milestones
                if ([30, 60, 120, 300].includes(timeOnPage)) {
                    this.trackEvent('time_on_page', {
                        seconds: timeOnPage,
                        scrollDepth: maxScrollDepth,
                        engagement: this.calculateEngagementScore()
                    });
                }
            }
        }, 1000);

        // Activity tracking
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                isActive = true;
            }, { passive: true });
        });

        // Inactivity detection
        setInterval(() => {
            isActive = false;
        }, 30000);

        // Page visibility
        document.addEventListener('visibilitychange', () => {
            this.trackEvent('visibility_change', {
                hidden: document.hidden,
                timeOnPage,
                scrollDepth: maxScrollDepth
            });
        });

        // Before unload
        window.addEventListener('beforeunload', () => {
            this.trackEvent('page_exit', {
                timeOnPage,
                maxScrollDepth,
                engagementScore: this.calculateEngagementScore()
            });
        });
    }

    setupCommunityMetrics() {
        // Track community-specific interactions
        const communityObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Track dynamic content loading
                    const addedNodes = Array.from(mutation.addedNodes);
                    addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            if (node.classList?.contains('trending-card')) {
                                this.trackEvent('content_loaded', {
                                    contentType: 'trending_card',
                                    section: 'trending'
                                });
                            }
                            else if (node.classList?.contains('notification')) {
                                this.trackEvent('notification_shown', {
                                    notificationType: node.className.includes('success') ? 'success' : 
                                                   node.className.includes('error') ? 'error' : 'info'
                                });
                            }
                        }
                    });
                }
            });
        });

        communityObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    calculateEngagementScore() {
        const timeWeight = Math.min(this.getTimeOnPage() / 60, 5); // Max 5 points for time
        const scrollWeight = (this.getMaxScrollDepth() / 100) * 3; // Max 3 points for scroll
        const interactionWeight = Math.min(this.events.length / 10, 2); // Max 2 points for interactions
        
        return Math.round((timeWeight + scrollWeight + interactionWeight) * 10) / 10;
    }

    getTimeOnPage() {
        return Math.round((Date.now() - this.startTime) / 1000);
    }

    getMaxScrollDepth() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.round((scrollTop / docHeight) * 100);
    }

    getSection(element) {
        const sections = ['hero-community', 'neural-search', 'community-features', 'trending-community', 'community-highlights', 'join-community'];
        for (const section of sections) {
            if (element.closest(`.${section}`)) {
                return section;
            }
        }
        return 'unknown';
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section, .hero-community, .neural-search, .community-features, .trending-community, .community-highlights, .join-community');
        const scrollTop = window.pageYOffset + window.innerHeight / 2;
        
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.pageYOffset;
            const sectionBottom = sectionTop + rect.height;
            
            if (scrollTop >= sectionTop && scrollTop <= sectionBottom) {
                return section.className.split(' ')[0] || section.tagName.toLowerCase();
            }
        }
        
        return 'unknown';
    }

    getActionType(element) {
        const text = element.textContent.toLowerCase();
        if (text.includes('❤️') || text.includes('like')) return 'like';
        if (text.includes('🔄') || text.includes('share')) return 'share';
        if (text.includes('💬') || text.includes('comment')) return 'comment';
        if (text.includes('🎵') || text.includes('play')) return 'play';
        return 'unknown';
    }

    getSocialPlatform(element) {
        const href = element.href || '';
        if (href.includes('twitter.com') || href.includes('x.com')) return 'twitter';
        if (href.includes('facebook.com')) return 'facebook';
        if (href.includes('instagram.com')) return 'instagram';
        if (href.includes('youtube.com')) return 'youtube';
        if (href.includes('spotify.com')) return 'spotify';
        if (href.includes('soundcloud.com')) return 'soundcloud';
        return 'unknown';
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

    // Public API methods
    getAnalyticsData() {
        return {
            sessionId: this.sessionId,
            userId: this.userId,
            events: this.events,
            timeOnPage: this.getTimeOnPage(),
            scrollDepth: this.getMaxScrollDepth(),
            engagementScore: this.calculateEngagementScore()
        };
    }

    exportAnalytics() {
        const data = this.getAnalyticsData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `popfusion-analytics-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    clearAnalytics() {
        localStorage.removeItem('popfusion_analytics');
        this.events = [];
        this.trackEvent('analytics_cleared');
    }
}

// Legacy function for backward compatibility
function trackEvent(eventType, details) {
    if (window.communityAnalytics) {
        window.communityAnalytics.trackEvent(eventType, details);
    } else {
        console.warn('Community Analytics not initialized');
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.communityAnalytics = new CommunityAnalytics();
    
    // Global API
    window.PopFusionAnalytics = {
        track: (event, data) => window.communityAnalytics.trackEvent(event, data),
        getData: () => window.communityAnalytics.getAnalyticsData(),
        export: () => window.communityAnalytics.exportAnalytics(),
        clear: () => window.communityAnalytics.clearAnalytics()
    };
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommunityAnalytics;
}