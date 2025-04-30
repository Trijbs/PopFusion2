document.addEventListener('DOMContentLoaded', () => {
    // Generic Carousel Handler
    function initCarousel(containerSelector) {
        const carousel = document.querySelector(containerSelector);
        if (!carousel) return;
        const items = carousel.querySelectorAll('.carousel-item');
        const prevButton = carousel.parentElement.querySelector('.carousel-prev');
        const nextButton = carousel.parentElement.querySelector('.carousel-next');
        let currentIndex = 0;
        let autoScroll;

        function showSlide(index) {
            items.forEach(item => item.classList.remove('active'));
            items[index].classList.add('active');
            carousel.style.transform = `translateX(-${index * 100}%)`;
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % items.length;
            showSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            showSlide(currentIndex);
        }

        function startAutoScroll() {
            autoScroll = setInterval(nextSlide, 5000);
        }

        function stopAutoScroll() {
            clearInterval(autoScroll);
        }

        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                stopAutoScroll();
                prevSlide();
                startAutoScroll();
            });

            nextButton.addEventListener('click', () => {
                stopAutoScroll();
                nextSlide();
                startAutoScroll();
            });
        }

        // Touch swipe support
        let touchStartX = 0;
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) nextSlide();
            if (touchEndX - touchStartX > 50) prevSlide();
        });

        startAutoScroll();
    }

    // Initialize carousels
    initCarousel('.hero-carousel .carousel-container');

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

    // Music Player (Mock for index.html)
    const playPause = document.querySelector('.play-pause');
    if (playPause) {
        let isPlaying = false;
        playPause.addEventListener('click', () => {
            isPlaying = !isPlaying;
            playPause.textContent = isPlaying ? '⏸' : '▶';
        });
    }

    // Lazy Load Images/Videos
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.tagName === 'IMG') {
                    element.src = element.dataset.src;
                    element.removeAttribute('data-src');
                } else if (element.tagName === 'VIDEO') {
                    element.src = element.dataset.src;
                    element.removeAttribute('data-src');
                    element.play();
                }
                observer.unobserve(element);
            }
        });
    }, { rootMargin: '100px' });

    document.querySelectorAll('img[data-src], video[data-src]').forEach(el => observer.observe(el));
});