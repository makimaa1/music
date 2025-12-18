// js/data.js

const allSongs = [
  {
    id: 1,
    title: "MIDNIGHT",
    artist: "Nanteki",
    album: "Brazilian Phonk",
    url: "music/MIDNIGHT.mp3",
    cover: "images/cover1.jpg",
    genre: "Phonk"
  },
  {
    id: 2,
    title: "MURDER IN MY MIND",
    artist: "Kordhell",
    album: "Brazilian Phonk",
    url: "music/MUDERINMYMIND.mp3",
    cover: "images/cover2.jpg",
    genre: "Phonk"
  },
  {
    id: 3,
    title: "Dangerous Woman",
    artist: "Ariana Grande",
    album: "Single",
    url: "music/Ariana Grande - Dangerous Woman.mp3", // Pastikan nama file di folder music benar
    cover: "images/Ariana Grande - Dangerous Woman.jpg",
    genre: "Pop" // <-- FIXED (Tadinya Phonk)
  },
  {
    id: 4,
    title: "LAND OF FIRE",
    artist: "Kordhell",
    album: "Single",
    url: "music/LAND OF FIRE.mp3",
    cover: "images/cover4.jpg",
    genre: "Phonk"
  },
  {
    id: 5,
    title: "MONTAGEM",
    artist: "Andromeda",
    album: "Single",
    url: "music/MONTAGEM.mp3",
    cover: "images/cover5.jpg",
    genre: "Brazilian Funk"
  },
  {
    id: 6,
    title: "THE BEST PHONK PLAYLIST 2025",
    artist: "Various Artists",
    album: "Compilation",
    url: "music/THEBESTPHONKPLAYLIST2025.mp3",
    cover: "images/cover6.jpg",
    genre: "Phonk"
  },
  {
    id: 7,
    title: "we can t be friends",
    artist: "Ariana Grande",
    album: "Single",
    url: "music/Ariana Grande - we can t be friends.mp3",
    cover: "images/grande1.jpg",
    genre: "Pop"
  },
  {
    id: 8,
    title: "Bloodline",
    artist: "Ariana Grande",
    album: "Single",
    url: "music/Ariana Grande - bloodline.mp3",
    cover: "images/grande2.jpg",
    genre: "Pop"
  },
  {
    id: 9,
    title: "BERTAHAN ATAU MENYERAH DEVAKI",
    artist: "ANGGIS DEVAKI",
    album: "Single",
    url: "music/ANGGIS DEVAKI - BERTAHAN ATAU MENYERAH DEVAKI.mp3",
    cover: "images/anggis1.jpg",
    genre: "Pop" // <-- FIXED (Tadinya Electronic)
  },
  {
    id: 10,
    title: "DIRIMU YANG DULU",
    artist: "ANGGIS DEVAKI",
    album: "Single",
    url: "music/ANGGIS DEVAKI - DIRIMU YANG DULU.mp3",
    cover: "images/anggis2.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 11,
    title: "Masih Hatiku",
    artist: "Arsy Widianto, Tiara Andini",
    album: "Single",
    url: "music/Arsy Widianto, Tiara Andini - Masih Hatiku.mp3",
    cover: "images/cover13.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 12,
    title: "BERTAHAN ATAU MENYERAH DEVAKI",
    artist: "ANGGIS DEVAKI",
    album: "Single",
    url: "music/ANGGIS DEVAKI - BERTAHAN ATAU MENYERAH DEVAKI.mp3",
    cover: "images/cover14.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 13,
    title: "Heaven",
    artist: "Calum Scott feat. Lyodra",
    album: "Single",
    url: "music/Calum Scott feat. Lyodra - Heaven.mp3",
    cover: "images/cover15.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 14,
    title: "Abadi",
    artist: "Dendi Nata",
    album: "Single",
    url: "music/Dendi Nata - Abadi.mp3",
    cover: "images/cover16.jpg",
    genre: "Pop" // <-- FIXED (Indie Pop)
  },
  {
    id: 15,
    title: "Tak Ingin Usai",
    artist: "Keisya Levronka",
    album: "Single",
    url: "music/Keisya Levronka - Tak Ingin Usai.mp3",
    cover: "images/keysa1.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 16,
    title: "Merindumu lagi",
    artist: "Khifnu",
    album: "Single",
    url: "music/Khifnu - Merindumu lagi.mp3",
    cover: "images/cover18.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 17,
    title: "Ego",
    artist: "Lyodra",
    album: "Single",
    url: "music/Lyodra - Ego.mp3",
    cover: "images/lyodra1.png",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 18,
    title: "Kalau Bosan",
    artist: "Lyodra",
    album: "Single",
    url: "music/Lyodra - Kalau Bosan.mp3",
    cover: "images/lyodra2.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 19,
    title: "Pesan Terakhir",
    artist: "Lyodra",
    album: "Single",
    url: "music/Lyodra - Pesan Terakhir.mp3",
    cover: "images/lyodra3.png",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 20,
    title: "Sang Dewi",
    artist: "Lyodra, Andi Rianto",
    album: "Single",
    url: "music/Lyodra, Andi Rianto - Sang Dewi.mp3",
    cover: "images/lyodra4.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 21,
    title: "BOHONGI HATI",
    artist: "MAHALINI",
    album: "Single",
    url: "music/MAHALINI - BOHONGI HATI.mp3",
    cover: "images/mahalini5.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 22,
    title: "KISAH SEMPURNA",
    artist: "MAHALINI",
    album: "Single",
    url: "music/MAHALINI - KISAH SEMPURNA.mp3",
    cover: "images/mahalini1.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 23,
    title: "MELAWAN RESTU",
    artist: "MAHALINI",
    album: "Single",
    url: "music/MAHALINI - MELAWAN RESTU.mp3",
    cover: "images/mahalini2.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 24,
    title: "SIAL",
    artist: "MAHALINI",
    album: "Single",
    url: "music/MAHALINI - SIAL.mp3",
    cover: "images/mahalini3.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 25,
    title: "SISA RASA",
    artist: "MAHALINI",
    album: "Single",
    url: "music/MAHALINI - SISA RASA.mp3",
    cover: "images/mahalini4.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 26,
    title: "Terlukis Indah",
    artist: "Rizky Febian, Ziva Magnolya",
    album: "Single",
    url: "music/Rizky Febian Ziva Magnolya - Terlukis Indah.mp3",
    cover: "images/rizky1.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 27,
    title: "Janji Setia",
    artist: "Tiara Andini",
    album: "Single",
    url: "music/Tiara Andini - Janji Setia.mp3",
    cover: "images/cover29.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 28,
    title: "Menjadi Dia",
    artist: "Tiara Andini",
    album: "Single",
    url: "music/Tiara Andini - Menjadi Dia.mp3",
    cover: "images/cover30.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 29,
    title: "Merasa Indah",
    artist: "Tiara Andini",
    album: "Single",
    url: "music/Tiara Andini - Merasa Indah.mp3",
    cover: "images/cover31.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 30,
    title: "Lagu Pernikahan Kita",
    artist: "Tiara Andini, Arsy Widianto",
    album: "Single",
    url: "music/Tiara Andini, Arsy Widianto - Lagu Pernikahan Kita.mp3",
    cover: "images/arsy1.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 31,
    title: "Munafik",
    artist: "Ziva Magnolya",
    album: "Single",
    url: "music/Ziva Magnolya - Munafik.mp3",
    cover: "images/ziva1.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 32,
    title: "Peri Cintaku",
    artist: "Ziva Magnolya",
    album: "Single",
    url: "music/Ziva Magnolya - Peri Cintaku.mp3",
    cover: "images/ziva2.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 33,
    title: "Pilihan Yang Terbaik",
    artist: "Ziva Magnolya",
    album: "Single",
    url: "music/Ziva Magnolya - Pilihan Yang Terbaik.mp3",
    cover: "images/ziva3.jpg",
    genre: "Pop" // <-- FIXED
  },
  {
    id: 34,
    title: "Kelingan Mantan",
    artist: "NDX A.K.A",
    album: "Single", 
    url: "music/NDX A K A Kelingan Mantan.mp3",
    cover: "images/ndx1.jpg", 
    genre: "Hip Hop Dangdut", // <-- FIXED
  },
  {
    id: 35,
    title: "Nemen HipHop Dangdut Version",
    artist: "NDX A.K.A",
    album: "Single", 
    url: "music/NDX AKA - Nemen HipHop Dangdut Version ( Official Lyric Video ).mp3",
    cover: "images/ndx2.jpg", 
    genre: "Hip Hop Dangdut", // <-- FIXED
  },
  {
    id: 36,
    title: "Ngertenono Ati",
    artist: "NDX A.K.A",
    album: "Single", 
    url: "music/NDX AKA - Ngertenono Ati ( NDX Version ).mp3",
    cover: "images/ndx3.jpg", 
    genre: "Hip Hop Dangdut", // <-- FIXED
  },
  {
    id: 37, 
    title: "The Lazy Song",
    artist: "Bruno Mars",
    album: "Single", 
    url: "music/Bruno Mars - The Lazy Song.mp3", 
    cover: "images/bruno2.jpg", 
    genre: "Pop",
  },
  {
    id: 38,
    title: "That's What I Like",
    artist: "Bruno Mars",
    album: "Single", 
    url: "music/Bruno Mars - That’s What I Like [Official Music Video].mp3", 
    cover: "images/bruno1.jpg", 
    genre: "Pop", 
  },
  {
    id: 39,
    title: "Curi Curi Pandangan",
    artist: "Tenxi", 
    album: "Single",
    url: "music/(Bintang 5) Curi Curi pandangan.mp3", 
    cover: "images/tenxi1.jpg", 
    genre: "Pop", 
  },
  {
    id: 40,
    title: "Mejikuhibiniu",
    artist: "Tenxi", 
    album: "Single",
    url: "music/Tenxi, suisei & Jemsii - mejikuhibiniu.mp3", 
    cover: "images/tenxi2.jpg", 
    genre: "Pop", 
  },
];