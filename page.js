document.addEventListener('DOMContentLoaded', () => {
    // Dark/Light Mode Toggle
    const modeToggle = document.querySelector('.mode-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    modeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀';

    modeToggle.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        modeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀';
    });

    // Lazy Load Images
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '100px' });

    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
});