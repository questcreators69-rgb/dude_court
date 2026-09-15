/* ==========================================================================
   THE DUDE COURT: AUXILIARY OFFENSES — APPLICATION LOGIC & PROCEDURAL ENGINE
   ========================================================================== */

(function () {
  'use strict';

  // Fallback Mock Tracks Database (for offline or restricted network environments)
  const MOCK_FALLBACK_TRACKS = [
    {
      id: 901,
      title: 'Fortunate Son',
      artist: 'Creedence Clearwater Revival',
      genre: 'Rock',
      year: 1969,
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4e/d8/78/4ed87858-6927-4a0b-93f4-3d84a7e937d2/00888072044814.rgb.jpg/300x300bb.jpg',
      previewUrl: ''
    },
    {
      id: 902,
      title: 'Hotel California',
      artist: 'Eagles',
      genre: 'Rock',
      year: 1976,
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bf/bc/40/bfbc40c0-67a6-2d33-3171-88a4e320f782/603497876807.jpg/300x300bb.jpg',
      previewUrl: ''
    },
    {
      id: 903,
      title: 'Shake It Off',
      artist: 'Taylor Swift',
      genre: 'Pop',
      year: 2014,
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/7b/4b/32/7b4b3240-3b2d-94c6-6a56-65bf46d7e6f3/14UMGIM53229.rgb.jpg/300x300bb.jpg',
      previewUrl: ''
    },
    {
      id: 904,
      title: 'God\'s Plan',
      artist: 'Drake',
      genre: 'Hip-Hop/Rap',
      year: 2018,
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4a/12/f2/4a12f279-7a54-6e6b-a8e7-dfc52d43e5c9/18UMGIM08226.rgb.jpg/300x300bb.jpg',
      previewUrl: ''
    },
    {
      id: 905,
      title: 'Enter Sandman',
      artist: 'Metallica',
      genre: 'Metal',
      year: 1991,
      artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/21/2e/2e/212e2e4e-0a50-6169-23c3-3882a4726bf6/00602547515152.rgb.jpg/300x300bb.jpg',
      previewUrl: ''
    }
  ];

  // ==========================================================================
  // 1. PROCEDURAL AUDIO SYNTHESIZER (WEB AUDIO API)
  // ==========================================================================
  class AudioManager {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.analyser = null;
      this.isMuted = false;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
      }
      return this.isMuted;
    }

    // Gavel Strike: Sub-sine pulse + Lowpass Noise Snap
    playGavelStrike() {
      this.init(); this.resume();
      if (this.isMuted) return;

      const now = this.ctx.currentTime;
      
      // Sub Sine pulse
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.2);
      oscGain.gain.setValueAtTime(1.0, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.35);

      // Noise Snap (Wood Impact)
      const bufferSize = this.ctx.sampleRate * 0.1;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.1);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.7, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(now);
    }

    // Cassette Mechanical Click
    playCassetteClick() {
      this.init(); this.resume();
      if (this.isMuted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.05);
    }

    // Ice Clink in Tumbler (Twin Sine Frequencies)
    playIceClink() {
      this.init(); this.resume();
      if (this.isMuted) return;

      const now = this.ctx.currentTime;
      [2400, 3150].forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.15);
      });
    }

    // Bowling Pin Strike
    playBowlingStrike() {
      this.init(); this.resume();
      if (this.isMuted) return;

      const now = this.ctx.currentTime;
      [180, 320, 540].forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
      });
    }
  }

  // ==========================================================================
  // 2. ITUNES MUSIC SEARCH & DOCKET ENGINE
  // ==========================================================================
  class SearchEngine {
    constructor(audioMgr, onDocketUpdate) {
      this.audioMgr = audioMgr;
      this.onDocketUpdate = onDocketUpdate;
      this.docket = [];
      this.debounceTimer = null;

      this.searchInput = document.getElementById('searchInput');
      this.btnClearSearch = document.getElementById('btnClearSearch');
      this.dropdown = document.getElementById('searchResults');
      this.resultsList = document.getElementById('resultsList');
      this.resultsLoading = document.getElementById('resultsLoading');
      this.docketSlots = document.getElementById('docketSlots');
      this.emptyDocketMsg = document.getElementById('emptyDocketMsg');
      this.docketCount = document.getElementById('docketCount');

      this.bindEvents();
    }

    bindEvents() {
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(this.debounceTimer);
        const query = e.target.value.trim();
        if (query.length < 2) {
          this.hideDropdown();
          return;
        }
        this.debounceTimer = setTimeout(() => this.searchiTunes(query), 300);
      });

      this.btnClearSearch.addEventListener('click', () => {
        this.searchInput.value = '';
        this.hideDropdown();
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-warrant-box')) {
          this.hideDropdown();
        }
      });
    }

    async searchiTunes(query) {
      this.showDropdown();
      this.resultsLoading.classList.remove('hidden');
      this.resultsList.innerHTML = '';

      let results = [];

      // iTunes API blocks file:// CORS — try several proxy endpoints in order
      const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=6`;
      const proxies = [
        `https://corsproxy.io/?${encodeURIComponent(itunesUrl)}`,
        `https://api.allorigins.win/get?url=${encodeURIComponent(itunesUrl)}`,
        itunesUrl   // direct last-resort (works when served from http:// server)
      ];

      for (const proxyUrl of proxies) {
        try {
          const resp = await fetch(proxyUrl);
          let data;
          if (proxyUrl.includes('allorigins.win')) {
            // allorigins wraps the body in { contents: "..." }
            const wrapper = await resp.json();
            data = JSON.parse(wrapper.contents);
          } else {
            data = await resp.json();
          }
          if (data.results && data.results.length > 0) {
            results = data.results.map(t => ({
              id: t.trackId,
              title: t.trackName,
              artist: t.artistName,
              genre: t.primaryGenreName || 'Pop',
              year: t.releaseDate ? new Date(t.releaseDate).getFullYear() : '1977',
              artwork: (t.artworkUrl100 || '').replace('100x100bb', '300x300bb'),
              previewUrl: t.previewUrl || ''
            }));
            break; // success — stop trying proxies
          }
        } catch (err) {
          console.warn(`iTunes proxy attempt failed (${proxyUrl}):`, err);
        }
      }

      // If online fetch returned empty or failed, filter fallback list
      if (results.length === 0) {
        const qLower = query.toLowerCase();
        results = MOCK_FALLBACK_TRACKS.filter(t => 
          t.artist.toLowerCase().includes(qLower) || 
          t.title.toLowerCase().includes(qLower) || 
          t.genre.toLowerCase().includes(qLower)
        );

        if (results.length === 0) {
          // Dynamic fallback object generator for custom searches
          results.push({
            id: Date.now(),
            title: query,
            artist: 'Unknown Offender',
            genre: 'Auxiliary Pop',
            year: 2024,
            artwork: 'https://via.placeholder.com/300x300/3d1c0e/ffffff?text=EVIDENCE',
            previewUrl: ''
          });
        }
      }

      this.resultsLoading.classList.add('hidden');
      this.renderSearchResults(results);
    }

    renderSearchResults(results) {
      this.resultsList.innerHTML = '';
      results.forEach((track) => {
        const item = document.createElement('div');
        item.className = 'result-item';

        item.innerHTML = `
          <img class="result-thumb" src="${track.artwork}" alt="${track.title}" onerror="this.src='https://via.placeholder.com/60x60/3d1c0e/ffffff?text=AUDIO'">
          <div class="result-info">
            <div class="result-track">${track.title}</div>
            <div class="result-artist">${track.artist}</div>
            <div class="result-meta">${track.genre} • ${track.year}</div>
          </div>
          <button class="btn-add-track"><i data-lucide="plus"></i> SEIZE</button>
        `;

        item.querySelector('.btn-add-track').addEventListener('click', (e) => {
          e.stopPropagation();
          this.addToDocket(track);
          this.hideDropdown();
        });

        this.resultsList.appendChild(item);
      });
      if (window.lucide) lucide.createIcons();
    }

    addToDocket(track) {
      if (this.docket.length >= 5) {
        alert('Evidence Docket full! Maximum 5 songs permitted by court order.');
        return;
      }
      if (this.docket.some(t => t.id === track.id)) {
        return;
      }

      this.audioMgr.playCassetteClick();
      this.docket.push(track);
      this.renderDocket();
      if (this.onDocketUpdate) this.onDocketUpdate(this.docket);
    }

    removeFromDocket(trackId) {
      this.audioMgr.playCassetteClick();
      this.docket = this.docket.filter(t => t.id !== trackId);
      this.renderDocket();
      if (this.onDocketUpdate) this.onDocketUpdate(this.docket);
    }

    resetDocket() {
      this.docket = [];
      this.renderDocket();
      if (this.onDocketUpdate) this.onDocketUpdate(this.docket);
    }

    renderDocket() {
      this.docketCount.textContent = `${this.docket.length} / 5 SONGS SEIZED`;
      this.docketSlots.innerHTML = '';

      if (this.docket.length === 0) {
        this.docketSlots.appendChild(this.emptyDocketMsg);
        if (window.lucide) lucide.createIcons();
        return;
      }

      const exhibits = ['A', 'B', 'C', 'D', 'E'];
      this.docket.forEach((track, idx) => {
        const card = document.createElement('div');
        card.className = 'docket-card';
        card.dataset.id = track.id;

        card.innerHTML = `
          <span class="docket-exhibit-badge">EXHIBIT ${exhibits[idx]}</span>
          <img class="docket-thumb" src="${track.artwork}" alt="${track.title}" onerror="this.src='https://via.placeholder.com/60x60/3d1c0e/ffffff?text=AUDIO'">
          <div class="docket-details">
            <div class="docket-track-title">${track.title}</div>
            <div class="docket-artist">${track.artist}</div>
            <div class="docket-meta">${track.genre} • ${track.year}</div>
          </div>
          <div class="docket-actions">
            <button class="btn-docket-play" title="Play Preview"><i data-lucide="play"></i></button>
            <button class="btn-docket-remove" title="Remove Track"><i data-lucide="trash-2"></i></button>
          </div>
        `;

        card.querySelector('.btn-docket-play').addEventListener('click', () => {
          window.appCassettePlayer.playTrack(track, exhibits[idx]);
        });

        card.querySelector('.btn-docket-remove').addEventListener('click', () => {
          this.removeFromDocket(track.id);
        });

        this.docketSlots.appendChild(card);
      });
      if (window.lucide) lucide.createIcons();
    }

    showDropdown() { this.dropdown.classList.remove('hidden'); }
    hideDropdown() { this.dropdown.classList.add('hidden'); }
  }

  // ==========================================================================
  // 3. CASSETTE PLAYER CONTROLLER & ANALOG VU METER
  // ==========================================================================
  class CassettePlayer {
    constructor(audioMgr) {
      this.audioMgr = audioMgr;
      this.audioEl = new Audio();
      this.audioEl.crossOrigin = 'anonymous';

      this.spoolLeft = document.getElementById('spoolLeft');
      this.spoolRight = document.getElementById('spoolRight');
      this.tapeLabelText = document.getElementById('tapeLabelText');
      this.vuNeedle = document.getElementById('vuNeedle');
      this.deckStatus = document.getElementById('deckStatus');
      
      this.btnPlay = document.getElementById('btnDeckPlay');
      this.btnPause = document.getElementById('btnDeckPause');
      this.btnStop = document.getElementById('btnDeckStop');

      this.counter1 = document.getElementById('counter1');
      this.counter2 = document.getElementById('counter2');
      this.counter3 = document.getElementById('counter3');

      this.isPlaying = false;
      this.animFrame = null;

      this.bindEvents();
    }

    bindEvents() {
      this.btnPlay.addEventListener('click', () => {
        if (this.audioEl.src) {
          this.audioEl.play().catch(() => {});
          this.setPlayingState(true);
        }
      });
      this.btnPause.addEventListener('click', () => {
        this.audioEl.pause();
        this.setPlayingState(false);
      });
      this.btnStop.addEventListener('click', () => {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
        this.setPlayingState(false);
      });

      this.audioEl.addEventListener('ended', () => {
        this.setPlayingState(false);
      });
      this.audioEl.addEventListener('timeupdate', () => {
        this.updateCounter(Math.floor(this.audioEl.currentTime * 10));
      });
    }

    playTrack(track, exhibitLetter) {
      this.audioMgr.playCassetteClick();
      this.tapeLabelText.textContent = `EXHIBIT ${exhibitLetter}: ${track.title} - ${track.artist}`;
      this.deckStatus.textContent = `PLAYING EXHIBIT ${exhibitLetter}...`;
      
      if (track.previewUrl) {
        this.audioEl.src = track.previewUrl;
        this.audioEl.play().then(() => {
          this.setPlayingState(true);
        }).catch(err => {
          console.warn('Audio preview playback restricted:', err);
          this.simulatePlayback(exhibitLetter);
        });
      } else {
        this.simulatePlayback(exhibitLetter);
      }
    }

    simulatePlayback(exhibitLetter) {
      this.setPlayingState(true);
      this.deckStatus.textContent = `PLAYING EXHIBIT ${exhibitLetter} (SYNTH PREVIEW)...`;
      setTimeout(() => {
        if (this.isPlaying) this.setPlayingState(false);
      }, 4000);
    }

    setPlayingState(playing) {
      this.isPlaying = playing;
      if (playing) {
        this.spoolLeft.classList.add('spinning');
        this.spoolRight.classList.add('spinning');
        this.audioMgr.playCassetteClick();
        this.startVUMeter();
      } else {
        this.spoolLeft.classList.remove('spinning');
        this.spoolRight.classList.remove('spinning');
        this.deckStatus.textContent = `STATUS: IDLE`;
        this.stopVUMeter();
      }
    }

    startVUMeter() {
      const update = () => {
        if (!this.isPlaying) return;
        
        let level = 0.3 + Math.random() * 0.45; // Dynamic mechanical bounce
        if (this.audioMgr.analyser && this.audioMgr.ctx) {
          const dataArray = new Uint8Array(this.audioMgr.analyser.frequencyBinCount);
          this.audioMgr.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          if (sum > 0) level = (sum / dataArray.length) / 255;
        }

        const angle = -40 + (level * 75);
        this.vuNeedle.style.transform = `rotate(${angle}deg)`;

        this.animFrame = requestAnimationFrame(update);
      };
      update();
    }

    stopVUMeter() {
      if (this.animFrame) cancelAnimationFrame(this.animFrame);
      this.vuNeedle.style.transform = `rotate(-40deg)`;
    }

    updateCounter(val) {
      const str = String(val).padStart(3, '0');
      this.counter1.textContent = str[0];
      this.counter2.textContent = str[1];
      this.counter3.textContent = str[2];
    }
  }

  // ==========================================================================
  // 4. PROCEDURAL ROAST & DIALOGUE ENGINE
  // ==========================================================================
  class RoastEngine {
    static classify(track) {
      const artist = (track.artist || '').toLowerCase();
      const title = (track.title || '').toLowerCase();
      const genre = (track.genre || '').toLowerCase();

      // 1. CCR (Creedence Clearwater Revival) Special Case
      if (artist.includes('creedence') || artist.includes('ccr')) {
        return {
          category: 'CCR',
          judge: "Pedestrian swamp rock, but formally admissible under California civil code.",
          dude: "Now you're talking! CCR! That really ties the whole room together. You're alright, man. Case dismissed in my book!",
          isAcquitted: true
        };
      }

      // 2. The Eagles Special Case
      if (artist.includes('eagles') || title.includes('hotel california') || artist.includes('don henley')) {
        return {
          category: 'EAGLES',
          judge: "Aggravated soft country rock infraction detected!",
          dude: "Man, come on! I had a rough night and I hate the f***in' Eagles, man! Bailiff, throw this tape right out the window!",
          isAcquitted: false
        };
      }

      // 3. Commercial Pop / Viral / Taylor Swift / Top 40
      if (genre.includes('pop') || artist.includes('swift') || artist.includes('bieber') || artist.includes('sabrina') || artist.includes('dua')) {
        return {
          category: 'POP',
          judge: "Charged with 1st-degree conformism and voluntary surrender to commercial algorithms!",
          dude: "This track is completely un-Dude, man. It's got no groove, no soul. You're living in a consumerist trance, or worse, a TikTok montage. This aggression will not stand.",
          isAcquitted: false
        };
      }

      // 4. Modern Rap / Trap / 808s
      if (genre.includes('hip-hop') || genre.includes('rap') || genre.includes('trap') || artist.includes('drake') || artist.includes('travis')) {
        return {
          category: 'TRAP',
          judge: "Bailiff, confiscate the 808s! This sub-bass violates municipal noise ordinances!",
          dude: "Whoa, careful man, there's a beverage here! The bass is rattling the ice right out of my White Russian. Look, I like a good beat, but where's the soul?",
          isAcquitted: false
        };
      }

      // 5. Indie / Bedroom Pop / Melancholy
      if (genre.includes('indie') || genre.includes('alternative') || title.includes('sad') || title.includes('rain')) {
        return {
          category: 'INDIE',
          judge: "Evidence indicates sustained unauthorized brooding and staring out of rain-streaked windows.",
          dude: "That's a bummer, man. A real heavy bummer. What's with all the existential dread? You gotta go bowl a few frames, relax your mind, get a drink.",
          isAcquitted: false
        };
      }

      // 6. Heavy Metal / Hardcore
      if (genre.includes('metal') || genre.includes('hard rock') || artist.includes('metallica') || artist.includes('slipknot')) {
        return {
          category: 'METAL',
          judge: "Cruel and unusual acoustic punishment inflicted upon civilized eardrums!",
          dude: "Very un-Zen, man. You're throwing rocks at the pins instead of rolling the ball down the lane.",
          isAcquitted: false
        };
      }

      // 7. Electronic / EDM
      if (genre.includes('electronic') || genre.includes('dance') || genre.includes('house')) {
        return {
          category: 'EDM',
          judge: "Electrical disturbance recorded on county evidence spools!",
          dude: "Man, did the tape deck break? Sounds like a bowling alley pinsetter stuck on repeat.",
          isAcquitted: false
        };
      }

      // Fallback / Obscure
      return {
        category: 'GENERAL',
        judge: "The defendant presents audio of questionable artistic value.",
        dude: "Yeah, well, you know, that's just like, uh, your opinion, man.",
        isAcquitted: false
      };
    }

    static generateVerdict(docket) {
      const ccrFound = docket.some(t => t.artist.toLowerCase().includes('creedence') || t.artist.toLowerCase().includes('ccr'));
      const eaglesFound = docket.some(t => t.artist.toLowerCase().includes('eagles') || t.title.toLowerCase().includes('hotel california'));

      if (eaglesFound) {
        return {
          verdictTitle: "GUILTY OF EXTREME AUDIO CONTEMPT",
          dudeQuote: "I had a rough night and I hate the f***in' Eagles, man!",
          penalty: "Sentenced to 30 days of cleaning rental bowling shoes while listening to background elevator music.",
          stampText: "OVER THE LINE - MARK IT ZERO",
          stampColor: "red"
        };
      }

      if (ccrFound) {
        return {
          verdictTitle: "ACQUITTED ON LEBOWSKI GROUNDS",
          dudeQuote: "CCR really ties the whole room together, man. You're alright in my book.",
          penalty: "Sentenced to 1 complimentary White Russian and 2 free games at Hollywood Star Lanes.",
          stampText: "THE DUDE ABIDES",
          stampColor: "green"
        };
      }

      return {
        verdictTitle: "GUILTY OF 2ND-DEGREE UN-DUDE GROOVE",
        dudeQuote: "Yeah, well, you know, that's just like, your opinion, man.",
        penalty: "Sentenced to 14 days of listening exclusively to 1970s Credence Clearwater Revival albums.",
        stampText: "OVER THE LINE",
        stampColor: "red"
      };
    }
  }

  // ==========================================================================
  // 5. TRIAL CONTROLLER & COURTROOM DRAMA
  // ==========================================================================
  class TrialController {
    constructor(audioMgr, searchEngine, cassettePlayer) {
      this.audioMgr = audioMgr;
      this.searchEngine = searchEngine;
      this.cassettePlayer = cassettePlayer;

      this.btnCommence = document.getElementById('btnCommenceTrial');
      this.btnReset = document.getElementById('btnResetDocket');
      
      this.speechBubble = document.getElementById('speechBubble');
      this.speakerName = document.getElementById('speakerName');
      this.speakerRole = document.getElementById('speakerRole');
      this.bubbleText = document.getElementById('bubbleText');
      this.judgeCard = document.getElementById('judgeCharacter');
      this.dudeCard = document.getElementById('dudeCharacter');

      this.bindEvents();
    }

    bindEvents() {
      this.btnCommence.addEventListener('click', () => this.startTrial());
      this.btnReset.addEventListener('click', () => {
        this.searchEngine.resetDocket();
        this.hideBubble();
      });
    }

    async startTrial() {
      const docket = this.searchEngine.docket;
      if (docket.length === 0) return;

      this.btnCommence.disabled = true;
      this.btnReset.disabled = true;

      // Trial Sequence
      for (let i = 0; i < docket.length; i++) {
        const track = docket[i];
        const exhibitLetter = ['A', 'B', 'C', 'D', 'E'][i];
        const roast = RoastEngine.classify(track);

        // Step 1: Slam Gavel
        this.slamGavel();
        await this.delay(600);

        // Step 2: Judge Indictment
        this.setSpeaker('THE HONORABLE JUDGE STERN', 'PRESIDING MAGISTRATE', '#611e06');
        this.judgeCard.classList.add('angry');
        await this.typeWriter(`EXHIBIT ${exhibitLetter}: "${track.title}" by ${track.artist}. ${roast.judge}`);
        
        // Step 3: Autoplay 4s Preview on Cassette Deck
        this.cassettePlayer.playTrack(track, exhibitLetter);
        await this.delay(3500);

        // Step 4: The Dude Responds
        this.audioMgr.playIceClink();
        this.dudeCard.classList.add('sip', 'shake-head');
        this.setSpeaker('THE DUDE', 'CHIEF WITNESS & PHILOSOPHER', '#8b5a2b');
        await this.typeWriter(roast.dude);

        await this.delay(2000);
        this.judgeCard.classList.remove('angry');
        this.dudeCard.classList.remove('sip', 'shake-head');
      }

      // Step 5: Final Verdict
      const finalVerdict = RoastEngine.generateVerdict(docket);
      this.slamGavel();
      this.setSpeaker('COURT CLERK', 'FINAL VERDICT ANNOUNCEMENT', '#111');
      await this.typeWriter(`VERDICT: ${finalVerdict.verdictTitle}! ${finalVerdict.penalty}`);
      
      await this.delay(1500);

      // Open Citation Modal Canvas
      window.appCitationCanvas.renderAndShow(docket, finalVerdict);

      this.btnCommence.disabled = false;
      this.btnReset.disabled = false;
    }

    slamGavel() {
      this.audioMgr.playGavelStrike();
      document.body.classList.add('gavel-shake');
      this.judgeCard.classList.add('slam-gavel');
      setTimeout(() => {
        document.body.classList.remove('gavel-shake');
        this.judgeCard.classList.remove('slam-gavel');
      }, 300);
    }

    setSpeaker(name, role, color) {
      this.speakerName.textContent = name;
      this.speakerName.style.color = color;
      this.speakerRole.textContent = role;
      this.speechBubble.classList.remove('hidden');
    }

    typeWriter(text) {
      return new Promise((resolve) => {
        this.bubbleText.textContent = '';
        let i = 0;
        const timer = setInterval(() => {
          this.bubbleText.textContent += text[i];
          i++;
          if (i >= text.length) {
            clearInterval(timer);
            resolve();
          }
        }, 20);
      });
    }

    hideBubble() {
      this.speechBubble.classList.add('hidden');
    }

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  // ==========================================================================
  // 6. SUBPOENA CITATION CANVAS GENERATOR
  // ==========================================================================
  class CitationCanvas {
    constructor() {
      this.canvas = document.getElementById('subpoenaCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.modal = document.getElementById('citationModal');
      this.btnClose = document.getElementById('btnCloseModal');
      this.btnDownload = document.getElementById('btnDownloadCitation');
      this.btnCopy = document.getElementById('btnCopySummary');
      this.copyFeedback = document.getElementById('copyFeedback');
      this.defendantInput = document.getElementById('defendantAlias');

      this.currentDocket = [];
      this.currentVerdict = null;

      this.bindEvents();
    }

    bindEvents() {
      this.btnClose.addEventListener('click', () => this.hide());
      this.btnDownload.addEventListener('click', () => this.downloadPNG());
      this.btnCopy.addEventListener('click', () => this.copySummary());
      this.defendantInput.addEventListener('input', () => {
        if (this.currentDocket.length && this.currentVerdict) {
          this.drawSubpoena(this.currentDocket, this.currentVerdict);
        }
      });
    }

    async renderAndShow(docket, verdict) {
      this.currentDocket = docket;
      this.currentVerdict = verdict;
      this.modal.classList.remove('hidden');
      await this.drawSubpoena(docket, verdict);
    }

    async drawSubpoena(docket, verdict) {
      const width = 1200;
      const height = 1600;
      this.canvas.width = width;
      this.canvas.height = height;
      const ctx = this.ctx;

      // 1. Aged Paper Background
      ctx.fillStyle = '#f6efe1';
      ctx.fillRect(0, 0, width, height);

      // Paper Grain Texture
      ctx.fillStyle = 'rgba(180, 150, 100, 0.08)';
      for (let i = 0; i < 4000; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillRect(x, y, 2, 2);
      }

      // 2. Vintage Double Border
      ctx.strokeStyle = '#2a140a';
      ctx.lineWidth = 8;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.lineWidth = 2;
      ctx.strokeRect(42, 42, width - 84, height - 84);

      // 3. Header Seal & Title
      ctx.fillStyle = '#2a140a';
      ctx.textAlign = 'center';

      ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
      ctx.fillText('MUNICIPAL COURT OF LOS ANGELES COUNTY', width / 2, 110);

      ctx.font = 'bold 24px "Courier Prime", monospace';
      ctx.fillText('DIVISION 8 — AUXILIARY AUDIO OFFENSES', width / 2, 150);

      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(100, 175);
      ctx.lineTo(width - 100, 175);
      ctx.stroke();

      // Case Metadata Box
      const caseNo = `#DUD-${Math.floor(100000 + Math.random() * 900000)}`;
      const defendant = this.defendantInput.value || 'The Music Offender';
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      ctx.textAlign = 'left';
      ctx.font = 'bold 22px "Special Elite", monospace';
      ctx.fillText(`CASE NO: ${caseNo}`, 80, 230);
      ctx.fillText(`DATE: ${dateStr}`, 80, 265);
      ctx.fillText(`DEFENDANT: ${defendant.toUpperCase()}`, 80, 300);

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 325);
      ctx.lineTo(width - 80, 325);
      ctx.stroke();

      // 4. Seized Contraband / Evidence Section
      ctx.font = 'bold 26px "Playfair Display", Georgia, serif';
      ctx.fillText('SCHEDULE OF SEIZED MUSICAL EVIDENCE:', 80, 370);

      let yPos = 420;
      for (let i = 0; i < docket.length; i++) {
        const track = docket[i];
        const exhibitLetter = ['A', 'B', 'C', 'D', 'E'][i];

        // Draw Album Thumb Image asynchronously
        try {
          const img = await this.loadImage(track.artwork);
          ctx.drawImage(img, 80, yPos, 80, 80);
        } catch (e) {
          ctx.fillStyle = '#3d1c0e';
          ctx.fillRect(80, yPos, 80, 80);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px "Courier Prime", monospace';
          ctx.fillText('EXHIBIT', 88, yPos + 45);
        }

        ctx.fillStyle = '#2a140a';
        ctx.font = 'bold 22px "Special Elite", monospace';
        ctx.fillText(`[EXHIBIT ${exhibitLetter}] "${track.title}"`, 180, yPos + 30);
        
        ctx.font = '20px "Courier Prime", monospace';
        ctx.fillText(`Artist: ${track.artist}  •  Genre: ${track.genre} (${track.year})`, 180, yPos + 60);

        yPos += 110;
      }

      ctx.beginPath();
      ctx.moveTo(80, yPos + 10);
      ctx.lineTo(width - 80, yPos + 10);
      ctx.stroke();

      // 5. Formal Verdict & Dude's Certified Opinion
      yPos += 50;
      ctx.font = 'bold 26px "Playfair Display", Georgia, serif';
      ctx.fillText('FINDING OF THE COURT & TESTIMONY:', 80, yPos);

      yPos += 45;
      ctx.font = 'bold 24px "Special Elite", monospace';
      ctx.fillStyle = '#8b0000';
      ctx.fillText(`VERDICT: ${verdict.verdictTitle}`, 80, yPos);

      yPos += 55;
      ctx.fillStyle = '#2a140a';
      ctx.font = 'italic 22px "Courier Prime", monospace';
      ctx.fillText(`The Dude's Certified Statement:`, 80, yPos);

      yPos += 35;
      ctx.font = 'bold 22px "Special Elite", monospace';
      this.wrapText(ctx, `"${verdict.dudeQuote}"`, 80, yPos, width - 160, 32);

      yPos += 100;
      ctx.font = 'italic 22px "Courier Prime", monospace';
      ctx.fillText(`Prescribed Penalty:`, 80, yPos);

      yPos += 35;
      ctx.font = 'bold 20px "Special Elite", monospace';
      this.wrapText(ctx, verdict.penalty, 80, yPos, width - 160, 30);

      // 6. Crimson Distressed Rubber Stamp
      ctx.save();
      ctx.translate(width - 380, height - 220);
      ctx.rotate(-0.15); // Slightly rotated stamp

      const stampColor = verdict.stampColor === 'green' ? '#007a3d' : '#cc2222';
      ctx.strokeStyle = stampColor;
      ctx.fillStyle = stampColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(0, 0, 380, 100);

      ctx.font = 'bold 26px "Special Elite", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(verdict.stampText, 190, 58);
      ctx.restore();
    }

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      const words = text.split(' ');
      let line = '';
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    }

    loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    }

    downloadPNG() {
      const link = document.createElement('a');
      link.download = `Dude_Court_Citation_${Date.now()}.png`;
      link.href = this.canvas.toDataURL('image/png');
      link.click();
    }

    copySummary() {
      const defendant = this.defendantInput.value || 'The Music Offender';
      const text = `⚖️ THE DUDE COURT VERDICT ⚖️\nDefendant: ${defendant}\nVerdict: ${this.currentVerdict.verdictTitle}\nThe Dude says: "${this.currentVerdict.dudeQuote}"\nPenalty: ${this.currentVerdict.penalty}`;
      
      navigator.clipboard.writeText(text).then(() => {
        this.copyFeedback.classList.remove('hidden');
        setTimeout(() => this.copyFeedback.classList.add('hidden'), 3000);
      }).catch(() => {
        alert('Legal Summary:\n' + text);
      });
    }

    hide() { this.modal.classList.add('hidden'); }
  }

  // ==========================================================================
  // 7. INITIALIZE APPLICATION
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    const audioMgr = new AudioManager();
    const cassettePlayer = new CassettePlayer(audioMgr);
    window.appCassettePlayer = cassettePlayer;

    const btnCommence = document.getElementById('btnCommenceTrial');
    const searchEngine = new SearchEngine(audioMgr, (docket) => {
      btnCommence.disabled = (docket.length === 0);
    });

    const trialController = new TrialController(audioMgr, searchEngine, cassettePlayer);
    window.appCitationCanvas = new CitationCanvas();

    if (window.lucide) lucide.createIcons();

    // Toolbar Controls
    const btnSound = document.getElementById('btnToggleSound');
    const soundIcon = document.getElementById('soundIcon');
    btnSound.addEventListener('click', () => {
      const isMuted = audioMgr.toggleMute();
      soundIcon.innerHTML = isMuted ? '<i data-lucide="volume-x"></i>' : '<i data-lucide="volume-2"></i>';
      btnSound.querySelector('.label').textContent = isMuted ? 'MUTED' : 'AUDIO ON';
      if (window.lucide) lucide.createIcons();
    });

    const btnCRT = document.getElementById('btnToggleCRT');
    btnCRT.addEventListener('click', () => {
      document.body.classList.toggle('crt-enabled');
    });

    const btnGrain = document.getElementById('btnToggleGrain');
    btnGrain.addEventListener('click', () => {
      document.body.classList.toggle('film-grain-enabled');
    });
  });

})();
