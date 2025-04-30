document.addEventListener('DOMContentLoaded', () => {
    // Infinite Scroll
    function initInfiniteScroll(gridSelector, fetchFunction, renderFunction) {
        const grid = document.querySelector(gridSelector);
        if (!grid) return;
        const spinner = document.querySelector('.infinite-spinner');
        let page = 1;
        let isLoading = false;
        let totalItems = Infinity;

        async function loadMore() {
            if (isLoading || page * 8 >= totalItems) return;
            isLoading = true;
            spinner.classList.add('active');
            const { items, total } = await fetchFunction(page + 1);
            renderFunction(items, grid, true);
            page++;
            totalItems = total;
            isLoading = false;
            spinner.classList.remove('active');
        }

        window.addEventListener('scroll', () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
                loadMore();
            }
        });
    }

    // User Authentication
    function initAuth() {
        const user = JSON.parse(localStorage.getItem('user'));
        const authButtons = document.querySelector('.auth-buttons');
        const userProfile = document.createElement('div');
        userProfile.classList.add('user-profile');
        if (user) {
            authButtons.style.display = 'none';
            userProfile.innerHTML = `
                <button>${user.username}</button>
                <div class="dropdown-menu">
                    <a href="#" class="logout">Log Out</a>
                </div>
            `;
            document.querySelector('nav').appendChild(userProfile);
            userProfile.querySelector('button').addEventListener('click', () => {
                userProfile.querySelector('.dropdown-menu').classList.toggle('active');
            });
            userProfile.querySelector('.logout').addEventListener('click', () => {
                localStorage.removeItem('user');
                location.reload();
            });
        }
    }

    // Form Handling
    function initForms() {
        const contactForm = document.querySelector('.contact-form');
        const authForm = document.querySelector('.auth-form');
        if (contactForm) {
            contactForm.addEventListener('submit', e => {
                e.preventDefault();
                const message = document.createElement('p');
                message.classList.add('form-message', 'success');
                message.textContent = 'Message sent successfully!';
                contactForm.appendChild(message);
                contactForm.reset();
            });
        }
        if (authForm) {
            authForm.addEventListener('submit', e => {
                e.preventDefault();
                const email = authForm.querySelector('input[type="email"]').value;
                const password = authForm.querySelector('input[type="password"]').value;
                const username = authForm.querySelector('input[type="text"]')?.value;
                const message = document.createElement('p');
                message.classList.add('form-message');
                if (authForm.querySelector('.login-button')) {
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (user && user.email === email && user.password === password) {
                        message.classList.add('success');
                        message.textContent = 'Login successful!';
                        location.href = 'index.html';
                    } else {
                        message.classList.add('error');
                        message.textContent = 'Invalid credentials.';
                    }
                } else {
                    localStorage.setItem('user', JSON.stringify({ username, email, password }));
                    message.classList.add('success');
                    message.textContent = 'Registration successful!';
                    location.href = 'login.html';
                }
                authForm.appendChild(message);
            });
        }
    }

    // Social Sharing
    function initSocialSharing() {
        document.addEventListener('click', e => {
            if (e.target.matches('.share-button')) {
                const title = e.target.dataset.title;
                const platform = e.target.dataset.share;
                const url = encodeURIComponent(window.location.href);
                let shareUrl;
                if (platform === 'twitter') {
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${url}`;
                } else if (platform === 'tiktok') {
                    shareUrl = `https://www.tiktok.com/upload?source=web&url=${url}`;
                }
                window.open(shareUrl, '_blank');
                trackEvent('share', { platform, title });
            }
        });
    }

    // Initialize features
    initAuth();
    initForms();
    initSocialSharing();
});