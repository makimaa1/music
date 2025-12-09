/* ==========================================================================
   WEB MUSIC PLAYER - MAIN SCRIPT
   Author: Agung (Teknik Informatika)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    /* =========================================
       SECTION 1: GLOBAL STATE & DATA
       ========================================= */
    let state = {
        currentSong: null,
        currentIndex: 0,
        playlist: typeof allSongs !== 'undefined' ? allSongs : [], 
        isShuffle: false,
        isRepeat: false,
        favorites: JSON.parse(localStorage.getItem("favorites")) || [],
        myPlaylists: JSON.parse(localStorage.getItem("myPlaylists")) || [],
        tempPlaylistId: null,

        // === FITUR 1: CUSTOM ALBUMS ===
        customAlbums: [
            { id: 101, name: "Phonk Drift King", artist: "Various Artists", cover: "images/phonk.jpg", songIds: [1, 2, 3, 4, 6] },
            { id: 102, name: "Galau Brutal 2025", artist: "Indo Pop Sad", cover: "images/galau.jpg", songIds: [15, 17, 18, 19, 21, 25] },
            { id: 103, name: "Mahalini Special", artist: "Mahalini Raharja", cover: "images/cover3.jpg", songIds: [21, 22, 23, 24, 25] },
            { id: 104, name: "International Hits", artist: "Mix", cover: "images/we cant be friend.jpg", songIds: [7, 8, 13] },
            { id: 105, name: "Best of Idol", artist: "Lyodra, Tiara, Ziva", cover: "images/cover5.jpg", songIds: [11, 27, 28, 31, 32, 33] }
        ],

        // === FITUR 2: FOTO ARTIS MANUAL ===
        artistImages: {
            "Tenxi": "images/tenxip.jpg", 
            "Ariana Grande": "images/ariana.jpg",
            "Kordhell": "images/cover2.jpg",
            "Visxge": "images/cover3.jpg",
            "Lyodra": "images/lyodra.jpg",
            "Tiara Andini": "images/cover4.jpg",
            "Nanteki": "images/cover1.jpg",
            "NDX A.K.A": "images/ndx1.jpg"
        }
    };

    /* =========================================
       SECTION 2: DOM ELEMENTS COLLECTION
       ========================================= */
    const views = {
        home: document.getElementById("home-view"),
        search: document.getElementById("search-view"),
        library: document.getElementById("library-view"),
        detail: document.getElementById("playlist-detail-view")
    };

    const navs = {
        desktop: {
            home: document.getElementById("home-link-desktop"),
            search: document.getElementById("search-link-desktop"),
            library: document.getElementById("library-link-desktop")
        },
        mobile: {
            home: document.getElementById("home-link-mobile"),
            search: document.getElementById("search-link-mobile"),
            library: document.getElementById("library-link-mobile")
        }
    };

    const containers = {
        songList: document.getElementById("song-list-container"),
        libraryGrid: document.getElementById("library-grid-container"),
        searchResults: document.getElementById("search-results-container")
    };

    const player = {
        audio: document.getElementById("audio-player"),
        slider: document.getElementById("progress-bar-slider"), 
        timeCurrent: document.getElementById("current-time"),
        timeTotal: document.getElementById("total-duration"),
        
        // Desktop Controls
        playBtn: document.getElementById("main-play-pause-btn"),
        nextBtn: document.getElementById("next-song-btn"),
        prevBtn: document.getElementById("prev-song-btn"),
        likeBtn: document.getElementById("player-like-btn"),
        shuffleBtn: document.getElementById("shuffle-btn"),
        repeatBtn: document.getElementById("repeat-btn"),
        volControl: document.getElementById("volume-control"),
        
        // Mobile Controls (DITAMBAHKAN TOMBOL BARU)
        playBtnMob: document.getElementById("main-play-pause-btn-mobile"),
        nextBtnMob: document.getElementById("next-song-btn-mobile"), // <--- Baru
        prevBtnMob: document.getElementById("prev-song-btn-mobile"), // <--- Baru
        likeBtnMob: document.getElementById("player-like-btn-mobile"),
        mobProgress: document.getElementById("progress-bar-mobile"),

        // Info Elements
        title: document.getElementById("player-title"),
        titleMob: document.getElementById("player-title-mobile"),
        artist: document.getElementById("player-artist"),
        artistMob: document.getElementById("player-artist-mobile"),
        cover: document.getElementById("player-cover"),
        coverMob: document.getElementById("player-cover-mobile")
    };

    /* =========================================
       SECTION 3: INITIALIZATION
       ========================================= */
    function init() {
        renderHome();
        setupNavigation();
        setupPlayerEvents();
        setupModalEvents();
        setupKeyboardShortcuts();
        
        if(player.volControl) updateRangeBackground(player.volControl);
        if(player.slider) updateRangeBackground(player.slider);

        if (state.playlist.length > 0) {
            loadSong(state.playlist[0], false);
        }
    }

    function updateRangeBackground(input) {
        const min = input.min ? parseFloat(input.min) : 0;
        const max = input.max ? parseFloat(input.max) : 100;
        const val = input.value;
        const percentage = ((val - min) / (max - min)) * 100;
        input.style.background = `linear-gradient(to right, #1db954 0%, #1db954 ${percentage}%, #4d4d4d ${percentage}%, #4d4d4d 100%)`;
    }

    /* =========================================
       SECTION 4: UI RENDERING LOGIC
       ========================================= */
    function renderHome() {
        containers.songList.innerHTML = "";
        
        // 1. Good Evening
        const indexLaguPilihan = [ 2, 14, 19, 20, 25,33]; 
        const selectedSongs = state.playlist.filter((song, index) => indexLaguPilihan.includes(index));
        renderSection("Good Evening", selectedSongs, 'song');

        // 2. Popular Albums
        renderSection("Popular Albums", state.customAlbums, 'album');

        // 3. Genres
        const uniqueGenres = [...new Set(state.playlist.map(s => s.genre || "Pop"))];
        renderSection("Browse by Genre", uniqueGenres.map(g => ({ name: g })), 'genre');

        // 4. Popular Artists
        const uniqueArtists = [...new Set(state.playlist.map(s => s.artist))];
        const artists = uniqueArtists.map(artistName => {
            const manualImage = state.artistImages[artistName];
            const defaultCover = state.playlist.find(s => s.artist === artistName).cover;
            return { name: artistName, cover: manualImage ? manualImage : defaultCover };
        });

        const indexArtisPilihan = [2, 9, 11, 18, 19, 21, 20]; 
        const selectedArtists = artists.filter((artist, index) => indexArtisPilihan.includes(index));
        renderSection("Popular Artists", selectedArtists, 'artist');
    }

    function renderSection(title, items, type) {
        if (!items.length) return;
        containers.songList.innerHTML += `<h2 class="section-title">${title}</h2><div class="row">${items.map(item => createCard(item, type)).join('')}</div>`;
    }

    function createCard(item, type) {
        if (type === 'song') {
            const isFav = state.favorites.includes(item.id);
            const isActive = state.currentSong && state.currentSong.id === item.id;
            return `
            <div class="col-xl-2 col-lg-3 col-md-4 col-6 mb-4">
                <div class="spotify-card" onclick="playFromList(${item.id})">
                    <div class="spotify-img-wrapper">
                        <img src="${item.cover}" onerror="this.src='https://placehold.co/300'">
                        <button class="spotify-play-btn"><i class="bi bi-play-fill ps-1"></i></button>
                        <div class="card-actions">
                            <button class="btn btn-dark bg-black bg-opacity-50 rounded-circle p-1 border-0" style="width:32px; height:32px" onclick="event.stopPropagation(); addToPlaylistModal(${item.id})"><i class="bi bi-plus-lg text-white"></i></button>
                            <button class="btn btn-dark bg-black bg-opacity-50 rounded-circle p-1 border-0" style="width:32px; height:32px" onclick="event.stopPropagation(); toggleLike(${item.id})"><i class="bi ${isFav ? 'bi-heart-fill text-success' : 'bi-heart text-white'}"></i></button>
                        </div>
                    </div>
                    <div class="mt-2"><div class="spotify-card-title ${isActive ? 'song-active' : ''}" id="title-${item.id}">${item.title}</div><p class="spotify-card-desc">${item.artist}</p></div>
                </div>
            </div>`;
        } else if (type === 'album') {
            return `
            <div class="col-xl-2 col-lg-3 col-md-4 col-6 mb-4">
                <div class="spotify-card" onclick="openDetail('album', ${item.id})">
                    <div class="spotify-img-wrapper">
                        <img src="${item.cover}" onerror="this.src='https://placehold.co/300'">
                        <button class="spotify-play-btn"><i class="bi bi-play-fill ps-1"></i></button>
                    </div>
                    <div class="mt-2"><div class="spotify-card-title">${item.name}</div><p class="spotify-card-desc">${item.artist}</p></div>
                </div>
            </div>`;
        } else if (type === 'artist') {
            return `
            <div class="col-xl-2 col-lg-3 col-md-4 col-6 mb-4">
                <div class="artist-card" onclick="openDetail('artist', '${item.name}')">
                    <div class="artist-img-wrapper">
                        <img src="${item.cover}" style="width:100%; height:100%; object-fit:cover;">
                        <button class="artist-play-btn" onclick="event.stopPropagation(); playArtist('${item.name}')"><i class="bi bi-play-fill ps-1"></i></button>
                    </div>
                    <div class="mt-2"><div class="artist-name">${item.name}</div><p class="spotify-card-desc">Artist</p></div>
                </div>
            </div>`;
        } else if (type === 'genre') {
            const colors = ['#E13300', '#7358FF', '#1E3264', '#E8115B', '#148A08', '#BC5900'];
            const bg = colors[item.name.length % colors.length];
            return `
            <div class="col-xl-2 col-lg-3 col-md-4 col-6 mb-4">
                <div class="genre-card" style="background-color: ${bg}" onclick="openDetail('genre', '${item.name}')">
                    <div class="genre-title">${item.name}</div>
                </div>
            </div>`;
        }
    }

    function renderLibrary() {
        containers.libraryGrid.innerHTML = `
        <div class="col-xl-2 col-lg-3 col-md-4 col-6 mb-4">
            <div class="liked-songs-card" onclick="openDetail('liked')">
                <div class="mb-3"><span class="text-white-50">Play</span> • <span class="text-white-50">List</span></div>
                <h4 class="fw-bold mb-1 text-white">Liked Songs</h4>
                <small class="text-white fw-bold">${state.favorites.length} songs</small>
                <button class="spotify-play-btn"><i class="bi bi-play-fill ps-1"></i></button>
            </div>
        </div>`;
        state.myPlaylists.forEach(pl => {
            containers.libraryGrid.innerHTML += `
            <div class="col-xl-2 col-lg-3 col-md-4 col-6 mb-4">
                <div class="spotify-card" onclick="openDetail('playlist', ${pl.id})">
                    <div class="spotify-img-wrapper">
                        <img src="${pl.cover}" onerror="this.src='https://placehold.co/300'">
                        <button class="spotify-play-btn"><i class="bi bi-play-fill ps-1"></i></button>
                    </div>
                    <div class="mt-2"><div class="spotify-card-title">${pl.name}</div><p class="spotify-card-desc">By You</p></div>
                </div>
            </div>`;
        });
    }

    function highlightActiveSong() {
        document.querySelectorAll('.spotify-card-title').forEach(el => el.classList.remove('song-active'));
        if (state.currentSong) {
            document.querySelectorAll(`#title-${state.currentSong.id}`).forEach(el => el.classList.add('song-active'));
        }
    }

    /* =========================================
       SECTION 5: NAVIGATION & DETAIL
       ========================================= */
    function setupNavigation() {
        const switchView = (viewName) => {
            Object.values(views).forEach(el => el.style.display = 'none');
            Object.values(navs.desktop).forEach(el => el.classList.remove('active'));
            Object.values(navs.mobile).forEach(el => { el.classList.remove('active-nav-mobile', 'text-white'); el.classList.add('text-secondary'); });

            if (viewName === 'home') {
                views.home.style.display = 'block'; navs.desktop.home.classList.add('active'); navs.mobile.home.classList.add('active-nav-mobile', 'text-white'); navs.mobile.home.classList.remove('text-secondary'); renderHome();
            } else if (viewName === 'search') {
                views.search.style.display = 'block'; navs.desktop.search.classList.add('active'); navs.mobile.search.classList.add('active-nav-mobile', 'text-white'); navs.mobile.search.classList.remove('text-secondary');
            } else if (viewName === 'library') {
                views.library.style.display = 'block'; navs.desktop.library.classList.add('active'); navs.mobile.library.classList.add('active-nav-mobile', 'text-white'); navs.mobile.library.classList.remove('text-secondary'); renderLibrary();
            } else if (viewName === 'detail') {
                views.detail.style.display = 'block';
            }
        };

        ['home', 'search', 'library'].forEach(key => {
            navs.desktop[key].addEventListener('click', (e) => { e.preventDefault(); switchView(key); });
            navs.mobile[key].addEventListener('click', (e) => { e.preventDefault(); switchView(key); });
        });

        document.getElementById("search-input").addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            if (!term) { containers.searchResults.innerHTML = ""; return; }
            const res = state.playlist.filter(s => s.title.toLowerCase().includes(term) || s.artist.toLowerCase().includes(term));
            containers.searchResults.innerHTML = res.map(s => createCard(s, 'song')).join('');
        });

        window.openDetail = (type, idOrName) => {
            switchView('detail');
            const detailTitle = document.getElementById("detail-title");
            const detailDesc = document.getElementById("detail-desc");
            const detailCover = document.getElementById("detail-cover");
            const detailList = document.getElementById("detail-song-list");
            const detailPlay = document.getElementById("detail-play-btn");
            let songs = [];
            
            if (type === 'liked') {
                detailTitle.innerText = "Liked Songs"; detailDesc.innerText = `${state.favorites.length} Songs`; detailCover.src = "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png";
                songs = state.playlist.filter(s => state.favorites.includes(s.id));
            } else if (type === 'artist') {
                detailTitle.innerText = idOrName; detailDesc.innerText = "Artist"; songs = state.playlist.filter(s => s.artist === idOrName); 
                const manualImg = state.artistImages[idOrName];
                detailCover.src = manualImg ? manualImg : (songs[0]?.cover || "https://placehold.co/300");
            } else if (type === 'genre') {
                detailTitle.innerText = idOrName; detailDesc.innerText = "Genre Mix"; songs = state.playlist.filter(s => (s.genre || "Pop") === idOrName); detailCover.src = songs[0]?.cover || "https://placehold.co/300";
            } else if (type === 'album') {
                const albumData = state.customAlbums.find(a => a.id === idOrName);
                if(albumData) {
                    detailTitle.innerText = albumData.name; detailDesc.innerText = "Album • " + albumData.artist; detailCover.src = albumData.cover;
                    songs = state.playlist.filter(s => albumData.songIds.includes(s.id));
                }
            } else if (type === 'playlist') {
                const pl = state.myPlaylists.find(p => p.id === idOrName); detailTitle.innerText = pl.name; detailDesc.innerText = "Custom Playlist"; detailCover.src = pl.cover; songs = state.playlist.filter(s => pl.songs.includes(s.id));
            }

            if (songs.length) {
                detailList.innerHTML = songs.map(s => createCard(s, 'song')).join('');
                detailPlay.onclick = () => { state.playlist = songs; loadSong(songs[0], true); };
            } else {
                detailList.innerHTML = `<div class="text-center text-secondary mt-5"><h5>Empty List</h5></div>`;
            }
        };
    }

    /* =========================================
       SECTION 6: PLAYER CORE LOGIC (FIXED MOBILE CONTROLS)
       ========================================= */
    window.playFromList = (id) => {
        const song = state.playlist.find(s => s.id === id);
        if (views.detail.style.display === 'none') state.playlist = allSongs;
        loadSong(song, true);
    };

    window.playArtist = (name) => {
        const artistSongs = allSongs.filter(s => s.artist === name);
        if(artistSongs.length > 0) { state.playlist = artistSongs; loadSong(artistSongs[0], true); }
    };

    function loadSong(song, playNow) {
        if (!song) return;
        state.currentSong = song;
        state.currentIndex = state.playlist.findIndex(s => s.id === song.id);
        
        player.audio.src = song.url;
        player.title.innerText = song.title;
        player.artist.innerText = song.artist;
        player.cover.src = song.cover;
        
        // Update Mobile UI juga
        if(player.titleMob) player.titleMob.innerText = song.title;
        if(player.artistMob) player.artistMob.innerText = song.artist;
        if(player.coverMob) player.coverMob.src = song.cover;

        updateLikeUI(); highlightActiveSong();
        if (playNow) { player.audio.play().catch(e => console.warn("Auto-play blocked", e)); setPlayState(true); } else { setPlayState(false); }
    }

    function setPlayState(isPlaying) {
        const icon = isPlaying ? '<i class="bi bi-pause-circle-fill"></i>' : '<i class="bi bi-play-circle-fill"></i>';
        const iconMob = isPlaying ? '<i class="bi bi-pause-fill fs-1"></i>' : '<i class="bi bi-play-fill fs-1"></i>';
        player.playBtn.innerHTML = icon; 
        if(player.playBtnMob) player.playBtnMob.innerHTML = iconMob;
    }

    function togglePlay() {
        if (player.audio.paused) { player.audio.play(); setPlayState(true); } else { player.audio.pause(); setPlayState(false); }
    }

    function setupPlayerEvents() {
        // Desktop Play
        player.playBtn.onclick = togglePlay;
        // Mobile Play
        if(player.playBtnMob) player.playBtnMob.onclick = togglePlay;

        // Logic Next Song
        const handleNext = () => {
            if (state.isShuffle) {
                let r; do { r = Math.floor(Math.random() * state.playlist.length); } while (r === state.currentIndex && state.playlist.length > 1);
                loadSong(state.playlist[r], true);
            } else {
                const nextIdx = (state.currentIndex + 1) % state.playlist.length;
                loadSong(state.playlist[nextIdx], true);
            }
        };

        // Logic Prev Song
        const handlePrev = () => {
            if (player.audio.currentTime > 3) { player.audio.currentTime = 0; return; }
            const prevIdx = (state.currentIndex - 1 + state.playlist.length) % state.playlist.length;
            loadSong(state.playlist[prevIdx], true);
        };

        // Bind Desktop Buttons
        player.nextBtn.onclick = handleNext;
        player.prevBtn.onclick = handlePrev;

        // Bind Mobile Buttons (FIXED: NOW WORKING)
        if(player.nextBtnMob) player.nextBtnMob.onclick = handleNext;
        if(player.prevBtnMob) player.prevBtnMob.onclick = handlePrev;

        // Shuffle & Repeat (Desktop Only usually)
        player.shuffleBtn.onclick = () => {
            state.isShuffle = !state.isShuffle;
            player.shuffleBtn.classList.toggle('btn-active'); player.shuffleBtn.classList.toggle('text-secondary');
        };

        player.repeatBtn.onclick = () => {
            state.isRepeat = !state.isRepeat;
            player.repeatBtn.classList.toggle('btn-active'); player.repeatBtn.classList.toggle('text-secondary');
            player.repeatBtn.innerHTML = state.isRepeat ? '<i class="bi bi-repeat-1"></i>' : '<i class="bi bi-arrow-repeat"></i>';
        };

        player.audio.addEventListener('ended', () => {
            if (state.isRepeat) { player.audio.currentTime = 0; player.audio.play(); } else { handleNext(); }
        });

        player.audio.addEventListener('timeupdate', () => {
            const cur = player.audio.currentTime;
            const dur = player.audio.duration || 1;
            const pct = (cur / dur) * 100;
            
            if(player.slider) {
                player.slider.value = pct;
                updateRangeBackground(player.slider);
            }
            if(player.mobProgress) { player.mobProgress.style.width = `${pct}%`; }
            
            player.timeCurrent.innerText = fmtTime(cur);
            player.timeTotal.innerText = fmtTime(dur);
        });

        if(player.slider) {
            player.slider.addEventListener('input', (e) => {
                const dur = player.audio.duration || 1;
                const val = e.target.value;
                player.audio.currentTime = (val / 100) * dur;
                updateRangeBackground(e.target);
            });
        }

        if(player.volControl) {
            player.volControl.addEventListener('input', (e) => {
                player.audio.volume = e.target.value;
                updateRangeBackground(e.target);
            });
        }
    }

    /* =========================================
       SECTION 7: LIKE & MODAL
       ========================================= */
    window.toggleLike = (id) => {
        if (state.favorites.includes(id)) { state.favorites = state.favorites.filter(x => x !== id); } else { state.favorites.push(id); }
        localStorage.setItem("favorites", JSON.stringify(state.favorites));
        updateLikeUI();
        document.querySelectorAll(`button[onclick*="toggleLike(${id})"] i`).forEach(el => {
            el.className = state.favorites.includes(id) ? 'bi bi-heart-fill text-success' : 'bi bi-heart text-white';
        });
        if(views.library.style.display !== 'none') renderLibrary();
    };

    function updateLikeUI() {
        if (!state.currentSong) return;
        const isFav = state.favorites.includes(state.currentSong.id);
        const cls = isFav ? "bi-heart-fill text-success" : "bi-heart";
        player.likeBtn.innerHTML = `<i class="bi ${cls}"></i>`; 
        if(player.likeBtnMob) player.likeBtnMob.innerHTML = `<i class="bi ${cls} fs-4"></i>`;
    }

    window.addToPlaylistModal = (id) => {
        state.tempPlaylistId = id;
        const listContainer = document.getElementById("modal-playlist-list");
        listContainer.innerHTML = "";
        if (state.myPlaylists.length === 0) {
            listContainer.innerHTML = "<p class='text-center text-secondary'>No playlists yet.</p>";
        } else {
            state.myPlaylists.forEach(pl => {
                const item = document.createElement("div");
                item.className = "d-flex align-items-center gap-3 p-2 rounded mb-2";
                item.style.cssText = "cursor: pointer; background: #333;";
                item.innerHTML = `<img src="${pl.cover}" width="40" height="40" class="rounded"> <span class="fw-bold">${pl.name}</span>`;
                item.onclick = () => {
                    pl.songs.push(state.tempPlaylistId);
                    localStorage.setItem("myPlaylists", JSON.stringify(state.myPlaylists));
                    bootstrap.Modal.getInstance(document.getElementById('addToPlaylistModal')).hide();
                    alert("Added!");
                };
                listContainer.appendChild(item);
            });
        }
        new bootstrap.Modal(document.getElementById('addToPlaylistModal')).show();
    };

    function setupModalEvents() {
        const createBtn = document.getElementById("create-playlist-btn");
        if(createBtn) {
            createBtn.addEventListener("click", () => {
                document.getElementById("new-playlist-name").value = "";
                const coverCont = document.getElementById("cover-selection-container");
                coverCont.innerHTML = "";
                
                const covers = ["images/cover1.jpg", "images/cover2.jpg", "images/cover3.jpg", "images/cover4.jpg", "images/cover5.jpg", "images/playlist1.jpg", "images/playlist2.jpg"];
                let selCover = covers[0];
                covers.forEach(c => {
                    const img = document.createElement("img");
                    img.src = c; img.className = "cover-option";
                    img.onerror = () => { img.style.display = 'none'; }; 
                    img.onclick = () => {
                        document.querySelectorAll(".cover-option").forEach(i => i.classList.remove("selected"));
                        img.classList.add("selected");
                        selCover = c;
                    };
                    coverCont.appendChild(img);
                });
                
                const saveBtn = document.getElementById("save-new-playlist-btn");
                const newSaveBtn = saveBtn.cloneNode(true);
                saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
                newSaveBtn.addEventListener("click", () => {
                    const name = document.getElementById("new-playlist-name").value || "My Playlist";
                    state.myPlaylists.push({ id: Date.now(), name, cover: selCover, songs: [] });
                    localStorage.setItem("myPlaylists", JSON.stringify(state.myPlaylists));
                    bootstrap.Modal.getInstance(document.getElementById('createPlaylistModal')).hide();
                    renderLibrary();
                });
                new bootstrap.Modal(document.getElementById('createPlaylistModal')).show();
            });
        }
    }

    // --- SECTION 8: UTILS ---
    function fmtTime(s) {
        const m = Math.floor(s / 60); const sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? '0'+sec : sec}`;
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === "INPUT") return;
            if (e.code === "Space") { e.preventDefault(); togglePlay(); }
            if (e.code === "ArrowRight") player.audio.currentTime += 5;
            if (e.code === "ArrowLeft") player.audio.currentTime -= 5;
        });
    }

    init();
});