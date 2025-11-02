// js/script.js (VERSI FINAL + FIX DATA KOSONG)

import { allSongs } from './data.js'; // <-- BARIS INI YANG HILANG DAN KITA KEMBALIKAN!

document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. AMBIL ELEMEN PENTING ===
    const homeView = document.getElementById('home-view');
    const searchView = document.getElementById('search-view');

    // Link Navigasi (Desktop)
    const homeLinkDesktop = document.getElementById('home-link-desktop');
    const searchLinkDesktop = document.getElementById('search-link-desktop');

    // Link Navigasi (Mobile)
    const homeLinkMobile = document.getElementById('home-link-mobile');
    const searchLinkMobile = document.getElementById('search-link-mobile');

    // (Sisa elemen... semua sama)
    const songListContainer = document.getElementById('song-list-container');
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results-container'); // Tambah ini
    const audioPlayer = document.getElementById('audio-player');
    const playerCover = document.getElementById('player-cover');
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

    // === (Fungsi 2 s/d 7 tetap sama: renderSongList, ... playPreviousSong) ===
    function renderSongList(){
        songListContainer.innerHTML = ''; 
        allSongs.forEach(song => {
            songListContainer.innerHTML += createSongCardHTML(song);
        });
        addEventListenersToCards(songListContainer); 
    }
    function renderSearchResults(filteredSongs){
        searchResultsContainer.innerHTML = ''; 
        if (filteredSongs.length === 0) {
            searchResultsContainer.innerHTML = '<p class="text-white">No results found.</p>';
            return;
        }
        filteredSongs.forEach(song => {
            searchResultsContainer.innerHTML += createSongCardHTML(song);
        });
        addEventListenersToCards(searchResultsContainer);
    }
    function createSongCardHTML(song){
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
    function playSong(songId){
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
    function addEventListenersToCards(container){
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
    function updateProgressBar(){
        if (audioPlayer.duration) {
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = percent + '%';
        }
    }
    function updateVolume(){
        audioPlayer.volume = volumeControl.value;
    }
    function playNextSong(){
        if (!currentSong) return;
        let nextIndex = currentSongIndex + 1;
        if (nextIndex >= allSongs.length) nextIndex = 0;
        const nextSongId = allSongs[nextIndex].id;
        playSong(nextSongId);
    }
    function playPreviousSong(){
        if (!currentSong) return;
        let prevIndex = currentSongIndex - 1;
        if (prevIndex < 0) prevIndex = allSongs.length - 1;
        const prevSongId = allSongs[prevIndex].id;
        playSong(prevSongId);
    }
    function loadInitialSongInfo(){
        if (!allSongs || allSongs.length === 0) return;
        const firstSong = allSongs[0];
        if (firstSong) {
            playerCover.src = firstSong.cover;
            playerTitle.innerText = firstSong.title;
            playerArtist.innerText = firstSong.artist;
            currentSong = firstSong;
            currentSongIndex = 0;
            audioPlayer.src = firstSong.url;
        }
    }

    // === 9. EVENT LISTENERS AUDIO PLAYER ===
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('ended', playNextSong);
    volumeControl.addEventListener('input', updateVolume);
    nextSongBtn.addEventListener('click', playNextSong);
    prevSongBtn.addEventListener('click', playPreviousSong);
    
    
    // === 10. UBAH: FUNGSI NAVIGASI (SPA) ===
    function showHome() {
        homeView.style.display = 'block';
        searchView.style.display = 'none';
        
        // desktop links
        if (homeLinkDesktop) homeLinkDesktop.classList.add('active');
        if (searchLinkDesktop) searchLinkDesktop.classList.remove('active');
        // mobile links
        if (homeLinkMobile) homeLinkMobile.classList.add('active');
        if (searchLinkMobile) searchLinkMobile.classList.remove('active');
    }
    
    function showSearch() {
        homeView.style.display = 'none';
        searchView.style.display = 'block';

        // desktop links
        if (homeLinkDesktop) homeLinkDesktop.classList.remove('active');
        if (searchLinkDesktop) searchLinkDesktop.classList.add('active');
        // mobile links
        if (homeLinkMobile) homeLinkMobile.classList.remove('active');
        if (searchLinkMobile) searchLinkMobile.classList.add('active');
    }
    
    // Pasang event listener ke KEDUA set link (dengan cek null)
    if (homeLinkDesktop) homeLinkDesktop.addEventListener('click', (e) => { e.preventDefault(); showHome(); });
    if (searchLinkDesktop) searchLinkDesktop.addEventListener('click', (e) => { e.preventDefault(); showSearch(); });
    if (homeLinkMobile) homeLinkMobile.addEventListener('click', (e) => { e.preventDefault(); showHome(); });
    if (searchLinkMobile) searchLinkMobile.addEventListener('click', (e) => { e.preventDefault(); showSearch(); });
    
    
    // === 11. EVENT LISTENER UNTUK SEARCH INPUT ===
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.trim() === '') {
            searchResultsContainer.innerHTML = '';
            return;
        }
        const filteredSongs = allSongs.filter(song => {
            const titleMatch = song.title.toLowerCase().includes(searchTerm);
            const artistMatch = song.artist.toLowerCase().includes(searchTerm);
            return titleMatch || artistMatch;
        });
        renderSearchResults(filteredSongs);
    });

    // === PANGGIL FUNGSI UTAMA SAAT HALAMAN DILOAD ===
    updateVolume(); 
    renderSongList(); 
    loadInitialSongInfo();
    showHome(); // Panggil ini agar 'active' class-nya benar saat awal
});