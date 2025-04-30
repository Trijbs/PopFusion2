document.addEventListener('DOMContentLoaded', () => {
    const spotifyGrid = document.getElementById('spotify-grid');
    const loadMoreButton = document.getElementById('load-more');
    const genreFilter = document.getElementById('genre-filter');

    // Spotify API configuration
    const CLIENT_ID = 'de5942f7fb5c4c93b882761f388f6cbb'; // Replace with your Spotify Client ID
    const CLIENT_SECRET = '460de8a6335a413297aee7ed19bc68bd'; // Replace with your Spotify Client Secret
    const PLAYLIST_ID = '37i9dQZF1DXb5BKLTO7ULa'; // Example: Today's Top Hits
    const ITEMS_PER_PAGE = 6;
    let currentPage = 0;
    let allTracks = [];
    let filteredTracks = [];

    // Fallback static data (from previous spotify.html)
    const fallbackTracks = [
        {
            name: 'New Song 1',
            artist: 'New Artist 1',
            genre: 'Pop',
            image: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg',
            url: '#'
        },
        {
            name: 'New Song 2',
            artist: 'New Artist 2',
            genre: 'Hip-Hop',
            image: 'https://images.pexels.com/photos/96380/pexels-photo-96380.jpeg',
            url: '#'
        },
        {
            name: 'New Song 3',
            artist: 'New Artist 3',
            genre: 'Electronic',
            image: 'https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg',
            url: '#'
        }
    ];

    // Get Spotify access token
    async function getSpotifyToken() {
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
                },
                body: 'grant_type=client_credentials'
            });
            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error('Error fetching Spotify token:', error);
            return null;
        }
    }

    // Fetch playlist tracks from Spotify
    async function fetchPlaylistTracks() {
        const token = await getSpotifyToken();
        if (!token) {
            console.warn('Using fallback data due to Spotify API failure');
            return fallbackTracks;
        }

        try {
            const response = await fetch(
                `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks?limit=50`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            const data = await response.json();
            return data.items.map(item => {
                const track = item.track;
                return {
                    name: track.name,
                    artist: track.artists[0].name,
                    genre: track.genres ? track.genres[0] : getGenreFromTrack(track), // Simplified genre detection
                    image: track.album.images[0]?.url || 'https://via.placeholder.com/200',
                    url: track.external_urls.spotify
                };
            });
        } catch (error) {
            console.error('Error fetching Spotify tracks:', error);
            return fallbackTracks;
        }
    }

    // Simplified genre detection (placeholder, as Spotify API doesn't always provide genres)
    function getGenreFromTrack(track) {
        const genres = ['Pop', 'Hip-Hop', 'Electronic', 'Rock'];
        return genres[Math.floor(Math.random() * genres.length)]; // Random for demo
    }

    // Render tracks to DOM
    function renderTracks(tracks, append = false) {
        if (!append) spotifyGrid.innerHTML = '';
        tracks.forEach(track => {
            const card = document.createElement('div');
            card.className = 'spotify-card';
            card.setAttribute('role', 'article');
            card.setAttribute('data-genre', track.genre);
            card.innerHTML = `
                <img src="${track.image}" alt="${track.name} cover" loading="lazy">
                <div class="card-details">
                    <h3>${track.name}</h3>
                    <p>Artist: ${track.artist}</p>
                    <p>Genre: ${track.genre}</p>
                    <a href="${track.url}" target="_blank" class="listen-now" aria-label="Listen to ${track.name}">Listen Now</a>
                </div>
            `;
            spotifyGrid.appendChild(card);
        });
    }

    // Load tracks for the current page
    function loadPage() {
        const start = currentPage * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const tracksToShow = filteredTracks.slice(start, end);
        renderTracks(tracksToShow, currentPage > 0);
        currentPage++;
        if (end >= filteredTracks.length) {
            loadMoreButton.disabled = true;
        }
    }

    // Filter tracks by genre
    function filterTracks(genre) {
        filteredTracks = genre === 'all' ? allTracks : allTracks.filter(track => track.genre === genre);
        currentPage = 0;
        loadMoreButton.disabled = false;
        loadPage();
    }

    // Initialize
    async function init() {
        allTracks = await fetchPlaylistTracks();
        filteredTracks = allTracks;
        loadPage();

        // Event listeners
        genreFilter.addEventListener('change', (e) => {
            filterTracks(e.target.value);
        });

        loadMoreButton.addEventListener('click', () => {
            loadPage();
        });
    }

    init();
});