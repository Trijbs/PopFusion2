/**
 * PopFusion2 Fetch Configuration
 * Central configuration for all fetch handlers
 */

window.POPFUSION_FETCH_CONFIG = {
    // API Configuration
    api: {
        baseURL: window.location.origin,
        timeout: 10000,
        retryAttempts: 3,
        retryDelay: 1000
    },
    
    // Cache Configuration
    cache: {
        enabled: true,
        timeout: 5 * 60 * 1000, // 5 minutes
        maxSize: 100 // Maximum number of cached items
    },
    
    // Page-specific configurations
    pages: {
        discover: {
            itemsPerPage: 12,
            infiniteScroll: true,
            searchEnabled: true,
            filters: ['genre', 'popularity', 'date']
        },
        electronic: {
            itemsPerPage: 8,
            infiniteScroll: true,
            subGenres: ['House', 'Techno', 'Dubstep', 'Trance', 'Ambient', 'Drum & Bass'],
            sortOptions: ['popularity', 'name', 'artist', 'duration', 'release_date']
        },
        billboard: {
            itemsPerPage: 10,
            autoRefresh: true,
            refreshInterval: 30 * 60 * 1000, // 30 minutes
            chartTypes: ['hot100', 'billboard200', 'artist100', 'streaming', 'radio', 'digital'],
            exportFormats: ['csv', 'json', 'playlist']
        },
        artist: {
            tabs: ['overview', 'tracks', 'albums', 'related', 'about'],
            loadMoreThreshold: 10,
            relatedArtistsCount: 12
        },
        contact: {
            maxFileSize: 5 * 1024 * 1024, // 5MB
            allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 
                              'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            maxMessageLength: 1000,
            requiredFields: ['name', 'email', 'subject', 'message', 'privacy']
        }
    },
    
    // Error messages
    errorMessages: {
        network: 'Network error occurred. Please check your connection and try again.',
        timeout: 'Request timed out. Please try again.',
        server: 'Server error occurred. Please try again later.',
        notFound: 'The requested content was not found.',
        validation: 'Please check your input and try again.',
        fileSize: 'File size exceeds the maximum limit.',
        fileType: 'File type is not supported.'
    },
    
    // Success messages
    successMessages: {
        formSubmit: 'Your message has been sent successfully!',
        like: 'Added to favorites',
        unlike: 'Removed from favorites',
        follow: 'Now following artist',
        unfollow: 'Unfollowed artist',
        playlist: 'Added to playlist',
        share: 'Link copied to clipboard!'
    },
    
    // Analytics configuration
    analytics: {
        enabled: true,
        trackPageViews: true,
        trackClicks: true,
        trackErrors: true,
        trackPerformance: true
    },
    
    // Feature flags
    features: {
        infiniteScroll: true,
        realTimeSearch: true,
        fileUpload: true,
        socialSharing: true,
        darkMode: true,
        notifications: true,
        offline: false
    },
    
    // UI Configuration
    ui: {
        loadingSpinnerDelay: 300, // ms
        messageDisplayTime: 5000, // ms
        animationDuration: 300, // ms
        debounceDelay: 300 // ms for search
    },
    
    // Spotify Integration (if available)
    spotify: {
        clientId: window.APP_CONFIG?.SPOTIFY_CLIENT_ID || '',
        clientSecret: window.APP_CONFIG?.SPOTIFY_CLIENT_SECRET || '',
        scopes: ['user-read-private', 'user-read-email', 'playlist-read-private'],
        redirectUri: window.location.origin + '/callback'
    },
    
    // Social Media Configuration
    social: {
        platforms: {
            twitter: {
                enabled: true,
                shareText: 'Check this out on PopFusion!'
            },
            facebook: {
                enabled: true,
                appId: ''
            },
            instagram: {
                enabled: true
            },
            tiktok: {
                enabled: true
            }
        }
    },
    
    // Development settings
    development: {
        debug: window.location.hostname === 'localhost',
        mockData: true,
        logRequests: window.location.hostname === 'localhost',
        showPerformanceMetrics: false
    }
};

// Utility functions for configuration access
window.getConfig = function(path, defaultValue = null) {
    const keys = path.split('.');
    let current = window.POPFUSION_FETCH_CONFIG;
    
    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return defaultValue;
        }
    }
    
    return current;
};

window.setConfig = function(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = window.POPFUSION_FETCH_CONFIG;
    
    for (const key of keys) {
        if (!(key in current)) {
            current[key] = {};
        }
        current = current[key];
    }
    
    current[lastKey] = value;
};

// Initialize configuration based on environment
document.addEventListener('DOMContentLoaded', () => {
    // Set development mode based on hostname
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('dev');
    
    setConfig('development.debug', isDevelopment);
    setConfig('development.logRequests', isDevelopment);
    
    // Disable analytics in development
    if (isDevelopment) {
        setConfig('analytics.enabled', false);
    }
    
    // Log configuration in development
    if (getConfig('development.debug')) {
        console.log('PopFusion Fetch Configuration:', window.POPFUSION_FETCH_CONFIG);
    }
});

console.log('PopFusion Fetch Configuration loaded');