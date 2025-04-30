function trackEvent(eventType, details) {
    const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
    analytics.push({ eventType, details, timestamp: new Date().toISOString() });
    localStorage.setItem('analytics', JSON.stringify(analytics));
    console.log(`Tracked ${eventType}:`, details);
}

document.addEventListener('click', e => {
    if (e.target.matches('.search-button')) {
        const query = document.querySelector('#search-input').value;
        trackEvent('search', { query });
    } else if (e.target.matches('.listen-now, .play-preview, .follow-button, .cta-button, .share-button')) {
        trackEvent('click', { element: e.target.textContent, class: e.target.className });
    }
});