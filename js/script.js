// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. AMBIL ELEMEN PENTING ===
    
    // Tampilan (Views)
    const homeView = document.getElementById('home-view');
    const searchView = document.getElementById('search-view');

    // Link Navigasi
    const homeLink = document.getElementById('home-link');
    const searchLink = document.getElementById('search-link');
    const libraryLink = document.getElementById('library-link');

    // Kontainer Lagu
    const songListContainer = document.getElementById('song-list-container');
    
    // BARU: Elemen Search
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results-container');

    // Audio Player & Kontrol
    const audioPlayer = document.getElementById('audio-player');
    const playerCover = document.getElementById('player-cover');
    // ... (sisa elemen player lainnya) ...
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const mainPlayPauseBtn = document.getElementById('main-play-pause-btn');
    const mainPlayIcon = 'bi-play-circle-fill';
    const mainPauseIcon = 'bi-pause-circle-fill';
    const prevSongBtn = document.getElementById('prev-song-btn');
    const nextSongBtn = document.getElementById('next-song-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeControl = document.getElementById('volume-control');
    
    let currentSong = null;
    let currentSongIndex = 0; 

    // === 2. FUNGSI RENDER LAGU (HOME) ===
    function renderSongList() {
        songListContainer.innerHTML = ''; 
        allSongs.forEach(song => {
            songListContainer.innerHTML += createSongCardHTML(song);
        });
        // Pasang event listener ke card yang BARU dibuat
        addEventListenersToCards(songListContainer); 
    }

    // === 3. BARU: FUNGSI RENDER HASIL SEARCH ===
    // (Mirip dengan renderSongList, tapi untuk kontainer search)
    function renderSearchResults(filteredSongs) {
        searchResultsContainer.innerHTML = ''; // Kosongkan hasil lama
        
        if (filteredSongs.length === 0) {
            searchResultsContainer.innerHTML = '<p class="text-white">No results found.</p>';
            return;
        }
        
        filteredSongs.forEach(song => {
            searchResultsContainer.innerHTML += createSongCardHTML(song);
        });
        // Pasang event listener ke card yang BARU dibuat
        addEventListenersToCards(searchResultsContainer);
    }
    
    // === 4. BARU: FUNGSI BANTU UNTUK BUAT KARTU LAGU ===
    // (Kita pisah agar bisa dipakai berulang)
    function createSongCardHTML(song) {
        return `
            <div class="col-md-3 col-sm-6 mb-4">
                <div class="card bg-secondary text-white p-2 song-card" data-song-id="${song.id}">
                    <img src="${song.cover}" class="card-img-top" alt="${song.album}">
                    <div class="card-body">
                        <h5 class="card-title">${song.title}</h5>
                        <p class="card-text">${song.artist}</p>
                        <button class="btn btn-success play-button" data-song-id="${song.id}">
                            <i class="bi bi-play-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // === 5. FUNGSI PLAY LAGU ===
    function playSong(songId) {
        const songIndex = allSongs.findIndex(s => s.id == songId);
        if (songIndex === -1) return;
        
        const song = allSongs[songIndex];
        currentSong = song; 
        currentSongIndex = songIndex; 
        
        audioPlayer.src = song.url;
        audioPlayer.play();
        
        playerCover.src = song.cover;
        playerTitle.innerText = song.title;
        playerArtist.innerText = song.artist;
        mainPlayPauseBtn.innerHTML = `<i class="bi ${mainPauseIcon}"></i>`;
        progressBar.style.width = '0%';
    }

    // === 6. FUNGSI PASANG EVENT LISTENER ===
    // (Sekarang menerima 'container' agar lebih pintar)
    function addEventListenersToCards(container) {
        // Hanya cari tombol di dalam kontainer yang spesifik
        const playButtons = container.querySelectorAll('.play-button');
        playButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); 
                const songId = event.currentTarget.getAttribute('data-song-id');
                playSong(songId);
            });
        });
        
        const songCards = container.querySelectorAll('.song-card');
        songCards.forEach(card => {
            card.addEventListener('click', (event) => {
                const songId = event.currentTarget.getAttribute('data-song-id');
                playSong(songId);
            });
        });
    }

    // === 7. FUNGSI KONTROL PLAYER (play/pause, progress, volume, next, prev) ===
    
    // Tombol Play/Pause
    mainPlayPauseBtn.addEventListener('click', () => {
        if (!currentSong) return;
        if (audioPlayer.paused) {
            audioPlayer.play();
            mainPlayPauseBtn.innerHTML = `<i class="bi ${mainPauseIcon}"></i>`;
        } else {
            audioPlayer.pause();
            mainPlayPauseBtn.innerHTML = `<i class="bi ${mainPlayIcon}"></i>`;
        }
    });

    // Update Progress
    function updateProgressBar() {
        if (audioPlayer.duration) {
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = percent + '%';
        }
    }

    // Update Volume
    function updateVolume() {
        audioPlayer.volume = volumeControl.value;
    }

    // Play Next
    function playNextSong() {
        if (!currentSong) return;
        let nextIndex = currentSongIndex + 1;
        if (nextIndex >= allSongs.length) nextIndex = 0;
        const nextSongId = allSongs[nextIndex].id;
        playSong(nextSongId);
    }

    // Play Previous
    function playPreviousSong() {
        if (!currentSong) return;
        let prevIndex = currentSongIndex - 1;
        if (prevIndex < 0) prevIndex = allSongs.length - 1;
        const prevSongId = allSongs[prevIndex].id;
        playSong(prevSongId);
    }

    // === 8. EVENT LISTENERS AUDIO PLAYER ===
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('ended', playNextSong);
    volumeControl.addEventListener('input', updateVolume);
    nextSongBtn.addEventListener('click', playNextSong);
    prevSongBtn.addEventListener('click', playPreviousSong);
    
    // === 9. EVENT LISTENERS NAVIGASI (SPA) ===
    
    // Tampilkan 'Home'
    homeLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        homeView.style.display = 'block';
        searchView.style.display = 'none';
        homeLink.classList.add('active');
        searchLink.classList.remove('active');
    });

    // Tampilkan 'Search'
    searchLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        homeView.style.display = 'none';
        searchView.style.display = 'block';
        homeLink.classList.remove('active');
        searchLink.classList.add('active');
    });
    
    // === 10. BARU: EVENT LISTENER UNTUK SEARCH INPUT ===
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Jika kotak search kosong, kosongkan hasil
        if (searchTerm.trim() === '') {
            searchResultsContainer.innerHTML = '';
            return;
        }

        // Filter 'allSongs' dari data.js
        const filteredSongs = allSongs.filter(song => {
            const titleMatch = song.title.toLowerCase().includes(searchTerm);
            const artistMatch = song.artist.toLowerCase().includes(searchTerm);
            return titleMatch || artistMatch; // Kembalikan jika judul ATAU artis cocok
        });

        // Tampilkan hasilnya menggunakan fungsi render
        renderSearchResults(filteredSongs);
    });


    // === PANGGIL FUNGSI UTAMA SAAT HALAMAN DILOAD ===
    updateVolume(); 
    renderSongList(); // Render lagu di halaman Home

});