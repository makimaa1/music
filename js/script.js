// js/script.js - FINAL FULL VERSION

document.addEventListener("DOMContentLoaded", () => {
  // === 1. ELEMEN DOM ===
  const homeView = document.getElementById("home-view");
  const searchView = document.getElementById("search-view");
  const libraryView = document.getElementById("library-view");
  const playlistDetailView = document.getElementById("playlist-detail-view");

  const homeLinkDesktop = document.getElementById("home-link-desktop");
  const searchLinkDesktop = document.getElementById("search-link-desktop");
  const libraryLinkDesktop = document.getElementById("library-link-desktop");
  const homeLinkMobile = document.getElementById("home-link-mobile");
  const searchLinkMobile = document.getElementById("search-link-mobile");
  const libraryLinkMobile = document.getElementById("library-link-mobile");

  const songListContainer = document.getElementById("song-list-container");
  const libraryGridContainer = document.getElementById("library-grid-container");
  const searchResultsContainer = document.getElementById("search-results-container");
  const searchInput = document.getElementById("search-input");

  const detailTitle = document.getElementById("detail-title");
  const detailDesc = document.getElementById("detail-desc");
  const detailCover = document.getElementById("detail-cover");
  const detailSongList = document.getElementById("detail-song-list");
  const detailPlayBtn = document.getElementById("detail-play-btn");

  const audioPlayer = document.getElementById("audio-player");
  const playerTitle = document.getElementById("player-title");
  const playerArtist = document.getElementById("player-artist");
  const playerCover = document.getElementById("player-cover");
  
  // Ambil semua ID kontrol (Desktop dan Mobile)
  const mainPlayPauseBtn = document.getElementById("main-play-pause-btn"); 
  const mainPlayPauseBtnMobile = document.getElementById("main-play-pause-btn-mobile"); 
  
  const playerLikeBtn = document.getElementById("player-like-btn"); 
  const playerLikeBtnMobile = document.getElementById("player-like-btn-mobile"); 

  const prevBtn = document.getElementById("prev-song-btn"); 
  const prevBtnMobile = document.getElementById("prev-song-btn-mobile"); 
  
  const nextBtn = document.getElementById("next-song-btn"); 
  const nextBtnMobile = document.getElementById("next-song-btn-mobile"); 

  const shuffleBtn = document.getElementById("shuffle-btn");
  const repeatBtn = document.getElementById("repeat-btn");
  const progressContainer = document.getElementById("progress-container");
  const progressBar = document.getElementById("progress-bar");
  const currTime = document.getElementById("current-time");
  const totDur = document.getElementById("total-duration");
  const volControl = document.getElementById("volume-control");
  const createPlaylistBtn = document.getElementById("create-playlist-btn");

  const modalList = document.getElementById("modal-playlist-list");
  
  // === 2. DATA STATE ===
  let currentSong = null;
  let currentSongIndex = 0;
  let currentPlaylist = allSongs; 
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let myPlaylists = JSON.parse(localStorage.getItem("myPlaylists")) || [];
  let songIdToAdd = null;

  const localCovers = [
      "images/cover1.jpg", "images/cover2.jpg", "images/cover3.jpg",
      "images/cover4.jpg", "images/cover5.jpg", "images/cover6.jpg",
  ];
  let selectedCoverUrl = localCovers[0];

  // === 3. HELPER FUNCTIONS (CARD CREATORS) ===

  // A. Create Song Card (Kotak Standar)
  function createSongCard(song, showAddBtn = true) {
    const isFav = favorites.includes(song.id);
    return `
      <div class="col-xl-2 col-lg-3 col-md-4 col-6 mb-4">
        <div class="spotify-card" onclick="playSpecificSong(${song.id})">
          <div class="spotify-img-wrapper">
              <img src="${song.cover}" alt="${song.album}" onerror="this.src='https://placehold.co/300x300/222/fff?text=Music'">
              <button class="spotify-play-btn" onclick="event.stopPropagation(); playSpecificSong(${song.id})">
                  <i class="bi bi-play-fill ps-1"></i>
              </button>
              <div class="card-actions">
                 ${showAddBtn ? `
                 <button class="btn btn-dark bg-black bg-opacity-50 rounded-circle p-1 border-0 d-flex align-items-center justify-content-center" 
                         style="width:32px; height:32px;" title="Add to Playlist" onclick="event.stopPropagation(); openAddToModal(${song.id})">
                     <i class="bi bi-plus-lg text-white" style="font-size: 16px;"></i>
                 </button>` : ''}
                 <button class="btn btn-dark bg-black bg-opacity-50 rounded-circle p-1 border-0 d-flex align-items-center justify-content-center"
                         style="width:32px; height:32px;" onclick="event.stopPropagation(); toggleFavorite(${song.id})">
                     <i class="bi ${isFav ? 'bi-heart-fill text-success' : 'bi-heart text-white'}" style="font-size: 14px;"></i>
                 </button>
             </div>
          </div>
          <div class="mt-2">
              <div class="spotify-card-title" title="${song.title}">${song.title}</div>
              <p class="spotify-card-desc">${song.artist}</p>
          </div>
        </div>
      </div>
    `;
  }

  // B. Create Artist Card (Bulat)
  function createArtistCard(artist) {
    return `
      <div class="col-xl-2 col-lg-3 col-md-4 col-6 mb-4">
        <div class="artist-card" onclick="openArtistDetail('${artist.name}')">
          <div class="artist-img-wrapper">
              <img src="${artist.cover}" alt="${artist.name}">
              <button class="spotify-play-btn" style="bottom: 10px; right: 10px;">
                  <i class="bi bi-play-fill ps-1"></i>
              </button>
          </div>
          <div class="mt-2">
              <div class="artist-name">${artist.name}</div>
              <p class="spotify-card-desc">Artist</p>
          </div>
        </div>
      </div>
    `;
  }

  // C. Create Genre Card (Kotak Warna)
  function createGenreCard(genreObj) {
    const colors = ['#E13300', '#7358FF', '#1E3264', '#E8115B', '#148A08', '#BC5900', '#503750', '#0D72EA'];
    const colorIndex = genreObj.name.length % colors.length; 
    const bg = colors[colorIndex];

    return `
      <div class="col-xl-2 col-lg-3 col-md-4 col-6 mb-4">
        <div class="genre-card" style="background-color: ${bg};" onclick="openGenreDetail('${genreObj.name}')">
          <div class="genre-title">${genreObj.name}</div>
        </div>
      </div>
    `;
  }

  // === 4. RENDER FUNCTIONS (HOME SECTIONS) ===

  function renderHome() {
    songListContainer.innerHTML = ""; 

    // Section 1: Good Evening (Top 4 Songs)
    const topPicks = allSongs.slice(0, 4); 
    renderSection("Good Evening", topPicks, 'song');

    // Section 2: Browse by Genre (Categories)
    const uniqueGenres = [...new Set(allSongs.map(s => s.genre || "Unknown"))];
    const genreData = uniqueGenres.map(g => ({ name: g }));
    if(genreData.length > 0) {
        renderSection("Browse by Genre", genreData, 'genre');
    }

    // Section 3: Popular Artists
    const uniqueArtists = [...new Set(allSongs.map(song => song.artist))];
    const artistData = uniqueArtists.map(artistName => {
        const song = allSongs.find(s => s.artist === artistName);
        return { name: artistName, cover: song.cover }; 
    });
    renderSection("Popular Artists", artistData, 'artist');
  }

  function renderSection(title, dataArray, type) {
    if(dataArray.length === 0) return;
    const titleHtml = `<h2 class="section-title">${title}</h2>`;
    let contentHtml = '<div class="row">';
    
    dataArray.forEach(item => {
        if (type === 'song') contentHtml += createSongCard(item); 
        else if (type === 'artist') contentHtml += createArtistCard(item);
        else if (type === 'genre') contentHtml += createGenreCard(item);
    });
    
    contentHtml += '</div>';
    songListContainer.innerHTML += (titleHtml + contentHtml);
  }

  function renderLibrary() {
    libraryGridContainer.innerHTML = "";
    const likedCount = favorites.length;
    const cardSizeClass = "col-xl-2 col-lg-3 col-md-4 col-6 mb-4"; 

    // Liked Songs Card
    libraryGridContainer.innerHTML += `
        <div class="${cardSizeClass}">
            <div class="liked-songs-card" onclick="openLikedSongs()">
                <div class="liked-songs-content">
                    <div class="mb-3"><span class="text-white-50">Play</span> • <span class="text-white-50">List</span></div>
                    <h4 class="fw-bold mb-1 text-white">Liked Songs</h4>
                    <small class="text-white fw-bold">${likedCount} songs</small>
                </div>
                <button class="spotify-play-btn"><i class="bi bi-play-fill ps-1"></i></button>
            </div>
        </div>
    `;

    // User Playlists
    myPlaylists.forEach(pl => {
        const coverSrc = pl.cover ? pl.cover : "https://placehold.co/300x300/333/fff?text=PL";
        libraryGridContainer.innerHTML += `
            <div class="${cardSizeClass}">
                <div class="spotify-card" onclick="openUserPlaylist(${pl.id})">
                    <div class="spotify-img-wrapper">
                        <img src="${coverSrc}" alt="${pl.name}">
                        <button class="spotify-play-btn"><i class="bi bi-play-fill ps-1"></i></button>
                    </div>
                    <div class="mt-2">
                        <div class="spotify-card-title">${pl.name}</div>
                        <p class="spotify-card-desc">By You</p>
                    </div>
                </div>
            </div>
        `;
    });
  }

  // === 5. LOGIKA DETAIL (PLAYLIST, ARTIST, GENRE) ===

  window.openLikedSongs = function() {
      showView('playlist-detail');
      detailTitle.innerText = "Liked Songs";
      detailDesc.innerText = `${favorites.length} songs`;
      detailCover.src = "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png";
      const likedData = allSongs.filter(s => favorites.includes(s.id));
      renderDetailList(likedData);
  };

  window.openUserPlaylist = function(id) {
      const pl = myPlaylists.find(p => p.id === id);
      if(!pl) return;
      showView('playlist-detail');
      detailTitle.innerText = pl.name;
      detailDesc.innerText = `Playlist • ${pl.songs.length} songs`;
      detailCover.src = pl.cover || "https://placehold.co/300x300/222/fff?text=PL";
      const plData = allSongs.filter(s => pl.songs.includes(s.id));
      renderDetailList(plData);
  };

  window.openArtistDetail = function(artistName) {
      showView('playlist-detail');
      detailTitle.innerText = artistName;
      detailDesc.innerText = "Artist • Verified";
      const song = allSongs.find(s => s.artist === artistName);
      detailCover.src = song ? song.cover : "https://placehold.co/300x300";
      const artistSongs = allSongs.filter(s => s.artist === artistName);
      renderDetailList(artistSongs);
  };

  window.openGenreDetail = function(genreName) {
      showView('playlist-detail');
      detailTitle.innerText = genreName;
      detailDesc.innerText = `Top ${genreName} Songs`;
      
      const firstSong = allSongs.find(s => (s.genre || "Unknown") === genreName);
      detailCover.src = firstSong ? firstSong.cover : "https://placehold.co/300x300";

      const genreSongs = allSongs.filter(s => (s.genre || "Unknown") === genreName);
      renderDetailList(genreSongs);
  };

  function renderDetailList(songArray) {
      if(songArray.length > 0) {
          detailSongList.innerHTML = songArray.map(s => createSongCard(s, false)).join('');
          detailPlayBtn.onclick = () => {
              currentPlaylist = songArray;
              playSongObj(songArray[0]);
          };
      } else {
          detailSongList.innerHTML = "<div class='col-12 text-center text-secondary mt-5'><h5>It's empty here</h5></div>";
      }
  }

  // === 6. PLAYER CORE (FIXED ID MAPPING) ===
  
  // Fungsi utama untuk toggle play/pause
  function togglePlayPause() {
    if (!currentSong) return;
    const isPaused = audioPlayer.paused;
    if (isPaused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
    
    // Perbarui ikon untuk KEDUA tombol (Desktop dan Mobile)
    const iconHtml = isPaused 
        ? '<i class="bi bi-pause-circle-fill"></i>' 
        : '<i class="bi bi-play-circle-fill"></i>';

    if (mainPlayPauseBtn) mainPlayPauseBtn.innerHTML = iconHtml;
    if (mainPlayPauseBtnMobile) mainPlayPauseBtnMobile.innerHTML = iconHtml;

  }

  window.playSpecificSong = function(id) {
      const song = allSongs.find(s => s.id === id);
      if(song) {
          if(document.getElementById('playlist-detail-view').style.display === 'none') {
             currentPlaylist = allSongs;
          }
          playSongObj(song);
      }
  };

  function playSongObj(song) {
      currentSong = song;
      currentSongIndex = currentPlaylist.findIndex(s => s.id === song.id);
      audioPlayer.src = song.url;
      audioPlayer.play();
      updatePlayerUI();
  }

  function updatePlayerUI() {
      if(!currentSong) return;
      if(playerTitle) playerTitle.innerText = currentSong.title;
      if(playerArtist) playerArtist.innerText = currentSong.artist;
      if(playerCover) playerCover.src = currentSong.cover;
      
      // Update semua tombol play/pause ke ikon pause
      const iconHtml = '<i class="bi bi-pause-circle-fill"></i>';
      if (mainPlayPauseBtn) mainPlayPauseBtn.innerHTML = iconHtml;
      if (mainPlayPauseBtnMobile) mainPlayPauseBtnMobile.innerHTML = iconHtml;
      
      updateLikeBtnState();
  }

  function updateLikeBtnState() {
      if(!currentSong) return;
      const isFav = favorites.includes(currentSong.id);
      const iconHtml = `<i class="bi ${isFav ? 'bi-heart-fill text-success' : 'bi-heart'}"></i>`;
      
      if(playerLikeBtn) playerLikeBtn.innerHTML = iconHtml;
      if(playerLikeBtnMobile) playerLikeBtnMobile.innerHTML = iconHtml;
  }

  window.toggleFavorite = function(id) {
      if(favorites.includes(id)) favorites = favorites.filter(fid => fid !== id);
      else favorites.push(id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      
      if(document.getElementById('home-view').style.display !== 'none') renderHome();
      if(document.getElementById('library-view').style.display !== 'none') renderLibrary();
      if(currentSong && currentSong.id === id) updateLikeBtnState();
  };
  
  // FUNGSI NEXT/PREV (Gunakan fungsi yang sama untuk mobile dan desktop)
  function playNextSong() {
    if(!currentPlaylist || currentPlaylist.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    playSongObj(currentPlaylist[currentSongIndex]);
  }

  function playPrevSong() {
    if(!currentPlaylist || currentPlaylist.length === 0) return;
    currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    playSongObj(currentPlaylist[currentSongIndex]);
  }

  // --- AUDIO & UI LISTENERS ---
  
  if (mainPlayPauseBtn) mainPlayPauseBtn.addEventListener('click', togglePlayPause);
  if (mainPlayPauseBtnMobile) mainPlayPauseBtnMobile.addEventListener('click', togglePlayPause);
  
  if (playerLikeBtn) playerLikeBtn.addEventListener('click', () => { if(currentSong) toggleFavorite(currentSong.id); });
  if (playerLikeBtnMobile) playerLikeBtnMobile.addEventListener('click', () => { if(currentSong) toggleFavorite(currentSong.id); });

  if (nextBtn) nextBtn.addEventListener('click', playNextSong);
  if (nextBtnMobile) nextBtnMobile.addEventListener('click', playNextSong);

  if (prevBtn) prevBtn.addEventListener('click', playPrevSong);
  if (prevBtnMobile) prevBtnMobile.addEventListener('click', playPrevSong);


  audioPlayer.addEventListener('timeupdate', () => {
      if(audioPlayer.duration) {
          if(progressBar) progressBar.style.width = `${(audioPlayer.currentTime / audioPlayer.duration) * 100}%`;
          if(currTime) currTime.innerText = formatTime(audioPlayer.currentTime);
          if(totDur) totDur.innerText = formatTime(audioPlayer.duration);
      }
  });
  
  if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
        if(!audioPlayer.duration) return;
        audioPlayer.currentTime = (e.offsetX / progressContainer.clientWidth) * audioPlayer.duration;
    });
  }

  function formatTime(seconds) {
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min}:${sec < 10 ? '0'+sec : sec}`;
  }

  if (volControl) volControl.addEventListener('input', (e) => { audioPlayer.volume = e.target.value; });

  // === 8. NAVIGATION & INIT ===
  function showView(viewName) {
      homeView.style.display = 'none'; searchView.style.display = 'none';
      libraryView.style.display = 'none'; playlistDetailView.style.display = 'none';

      [homeLinkDesktop, searchLinkDesktop, libraryLinkDesktop].forEach(l => {if(l) l.classList.remove('active')});
      
      if(viewName === 'home') {
          homeView.style.display = 'block'; if(homeLinkDesktop) homeLinkDesktop.classList.add('active'); renderHome();
      } else if (viewName === 'search') {
          searchView.style.display = 'block'; if(searchLinkDesktop) searchLinkDesktop.classList.add('active');
      } else if (viewName === 'library') {
          libraryView.style.display = 'block'; if(libraryLinkDesktop) libraryLinkDesktop.classList.add('active'); renderLibrary();
      } else if (viewName === 'playlist-detail') {
          playlistDetailView.style.display = 'block'; if(libraryLinkDesktop) libraryLinkDesktop.classList.add('active');
      }
  }

  if (homeLinkDesktop) homeLinkDesktop.onclick = (e) => { e.preventDefault(); showView('home'); };
  if (searchLinkDesktop) searchLinkDesktop.onclick = (e) => { e.preventDefault(); showView('search'); };
  if (libraryLinkDesktop) libraryLinkDesktop.onclick = (e) => { e.preventDefault(); showView('library'); };
  
  if (homeLinkMobile) homeLinkMobile.onclick = (e) => { e.preventDefault(); showView('home'); };
  if (searchLinkMobile) searchLinkMobile.onclick = (e) => { e.preventDefault(); showView('search'); };
  if (libraryLinkMobile) libraryLinkMobile.onclick = (e) => { e.preventDefault(); showView('library'); };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if(term.trim() === '') { searchResultsContainer.innerHTML = ''; return; }
        const filtered = allSongs.filter(s => s.title.toLowerCase().includes(term) || s.artist.toLowerCase().includes(term));
        searchResultsContainer.innerHTML = filtered.map(s => createSongCard(s)).join('');
    });
  }

  renderHome();
  if(allSongs.length > 0) {
      currentSong = allSongs[0]; currentPlaylist = allSongs;
      if(playerTitle) playerTitle.innerText = currentSong.title;
      if(playerArtist) playerArtist.innerText = currentSong.artist;
      if(playerCover) playerCover.src = currentSong.cover;
      audioPlayer.src = currentSong.url;
      updateLikeBtnState();
      audioPlayer.addEventListener('loadedmetadata', () => { if(totDur) totDur.innerText = formatTime(audioPlayer.duration); });
  }
});