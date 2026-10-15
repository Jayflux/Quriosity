// 21 Questions - Main Application Coordinator & UI Controller
// Supports View 1 (Halaman Awal / Home) and View 2 (Gameplay Arena)

import { game } from "./game.js";
import { sounds } from "./audio.js";
import { CardStackController } from "./cards.js";

class App {
  constructor() {
    // Views
    this.homeView = document.getElementById("homeView");
    this.gameView = document.getElementById("gameView");
    this.btnBackToHome = document.getElementById("btnBackToHome");

    // Home Screen Elements
    this.homeDecksContainer = document.getElementById("homeDecksContainer");
    this.modeTwentyOnePill = document.getElementById("modeTwentyOnePill");
    this.modeEndlessPill = document.getElementById("modeEndlessPill");
    this.homeToggleTurns = document.getElementById("homeToggleTurns");
    this.homeSoundToggleBtn = document.getElementById("homeSoundToggleBtn");
    this.homeLangToggleBtn = document.getElementById("homeLangToggleBtn");
    this.homeFavoritesBtn = document.getElementById("homeFavoritesBtn");
    this.homeOpenCustomDeckBtn = document.getElementById("homeOpenCustomDeckBtn");

    // Gameplay Screen Elements
    this.arenaEl = document.getElementById("cardsArena");
    this.deckSelectorBtn = document.getElementById("deckSelectorBtn");
    this.deckTagBadge = document.getElementById("deckTagBadge");
    this.gameSoundToggleBtn = document.getElementById("gameSoundToggleBtn");
    this.gameLangToggleBtn = document.getElementById("gameLangToggleBtn");
    this.menuBtn = document.getElementById("menuBtn");
    
    // Bottom dock buttons
    this.btnPrev = document.getElementById("btnPrev");
    this.btnFlip = document.getElementById("btnFlip");
    this.btnFav = document.getElementById("btnFav");
    this.btnNext = document.getElementById("btnNext");

    // Progress elements
    this.progressFill = document.getElementById("progressFill");
    this.progressText = document.getElementById("progressText");
    this.playerPill = document.getElementById("playerPill");
    this.playerName = document.getElementById("playerName");

    // Modals
    this.decksModal = document.getElementById("decksModal");
    this.decksListContainer = document.getElementById("decksListContainer");
    this.settingsModal = document.getElementById("settingsModal");
    this.favoritesModal = document.getElementById("favoritesModal");
    this.customDeckModal = document.getElementById("customDeckModal");

    // Initialize Card Physics Controller
    this.cardController = new CardStackController(this.arenaEl, {
      onSwipeNext: (direction) => this.handleNextQuestion(),
      onSwipePrev: () => this.handlePrevQuestion(),
      onFlip: (isFlipped) => this.updateFlipUI(isFlipped)
    });

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderHomeView();
    this.renderDecksList();
    this.updateLanguageUI();
  }

  bindEvents() {
    // Navigation: Back to Home
    if (this.btnBackToHome) {
      this.btnBackToHome.addEventListener("click", () => {
        sounds.playTap();
        this.showScreen("home");
      });
    }

    // Sound toggle (synced between Home & Game)
    const toggleSoundHandler = () => {
      const isEnabled = sounds.toggleSound();
      const svgIcon = isEnabled
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      
      if (this.homeSoundToggleBtn) this.homeSoundToggleBtn.innerHTML = svgIcon;
      if (this.gameSoundToggleBtn) this.gameSoundToggleBtn.innerHTML = svgIcon;
    };

    if (this.homeSoundToggleBtn) this.homeSoundToggleBtn.addEventListener("click", toggleSoundHandler);
    if (this.gameSoundToggleBtn) this.gameSoundToggleBtn.addEventListener("click", toggleSoundHandler);

    // Language toggle (synced)
    const toggleLangHandler = () => {
      const nextLang = game.lang === "id" ? "en" : "id";
      game.setLanguage(nextLang);
      sounds.playTap();
      this.updateLanguageUI();
      this.renderHomeView();
      this.renderDecksList();
      if (!this.gameView.classList.contains("is-hidden")) {
        this.renderCurrentCard();
      }
    };

    if (this.homeLangToggleBtn) this.homeLangToggleBtn.addEventListener("click", toggleLangHandler);
    if (this.gameLangToggleBtn) this.gameLangToggleBtn.addEventListener("click", toggleLangHandler);

    // Mode Selector on Home View
    if (this.modeTwentyOnePill && this.modeEndlessPill) {
      this.modeTwentyOnePill.addEventListener("click", () => {
        sounds.playTap();
        this.setGameMode("twenty_one");
      });
      this.modeEndlessPill.addEventListener("click", () => {
        sounds.playTap();
        this.setGameMode("endless");
      });
    }

    // Turns toggle on Home View
    if (this.homeToggleTurns) {
      this.homeToggleTurns.checked = game.enableTurns;
      this.homeToggleTurns.addEventListener("change", (e) => {
        game.enableTurns = e.target.checked;
        game.saveSettings();
        const toggleTurnsCheck = document.getElementById("toggleTurns");
        if (toggleTurnsCheck) toggleTurnsCheck.checked = game.enableTurns;
        sounds.playTap();
      });
    }

    // Modals
    if (this.homeFavoritesBtn) {
      this.homeFavoritesBtn.addEventListener("click", () => {
        this.renderFavoritesList();
        this.openModal(this.favoritesModal);
      });
    }

    if (this.deckSelectorBtn) {
      this.deckSelectorBtn.addEventListener("click", () => this.openModal(this.decksModal));
    }

    if (this.menuBtn) {
      this.menuBtn.addEventListener("click", () => this.openModal(this.settingsModal));
    }

    if (this.homeOpenCustomDeckBtn) {
      this.homeOpenCustomDeckBtn.addEventListener("click", () => this.openModal(this.customDeckModal));
    }

    const openCustomDeckBtn = document.getElementById("openCustomDeckBtn");
    if (openCustomDeckBtn) {
      openCustomDeckBtn.addEventListener("click", () => {
        this.closeAllModals();
        this.openModal(this.customDeckModal);
      });
    }

    // Close buttons on modals
    document.querySelectorAll(".modal-close-btn").forEach(btn => {
      btn.addEventListener("click", () => this.closeAllModals());
    });
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) this.closeAllModals();
      });
    });

    // Bottom dock controls
    if (this.btnPrev) this.btnPrev.addEventListener("click", () => this.handlePrevQuestion());
    if (this.btnFlip) this.btnFlip.addEventListener("click", () => this.cardController.flipCard());
    if (this.btnNext) this.btnNext.addEventListener("click", () => this.cardController.animateOut("right"));
    if (this.btnFav) this.btnFav.addEventListener("click", () => this.handleFavoriteToggle());

    // Settings modal interactions
    const toggleTurnsCheck = document.getElementById("toggleTurns");
    if (toggleTurnsCheck) {
      toggleTurnsCheck.checked = game.enableTurns;
      toggleTurnsCheck.addEventListener("change", (e) => {
        game.enableTurns = e.target.checked;
        game.saveSettings();
        if (this.homeToggleTurns) this.homeToggleTurns.checked = game.enableTurns;
        this.updateHeaderAndProgress();
      });
    }

    const modeSelect = document.getElementById("gameModeSelect");
    if (modeSelect) {
      modeSelect.value = game.gameMode;
      modeSelect.addEventListener("change", (e) => {
        this.setGameMode(e.target.value);
        this.closeAllModals();
      });
    }

    const saveCustomDeckForm = document.getElementById("customDeckForm");
    if (saveCustomDeckForm) {
      saveCustomDeckForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCreateCustomDeck();
      });
    }
  }

  showScreen(screenName) {
    if (screenName === "home") {
      this.gameView.classList.add("is-hidden");
      this.homeView.classList.remove("is-hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      this.homeView.classList.add("is-hidden");
      this.gameView.classList.remove("is-hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  setGameMode(mode) {
    game.gameMode = mode;
    game.saveSettings();

    if (this.modeTwentyOnePill && this.modeEndlessPill) {
      this.modeTwentyOnePill.classList.toggle("is-active", mode === "twenty_one");
      this.modeEndlessPill.classList.toggle("is-active", mode === "endless");
    }

    const modeSelect = document.getElementById("gameModeSelect");
    if (modeSelect) modeSelect.value = mode;

    if (!this.gameView.classList.contains("is-hidden")) {
      this.launchGame(game.currentDeckId, game.gameMode);
    }
  }

  renderHomeView() {
    if (!this.homeDecksContainer) return;
    this.homeDecksContainer.innerHTML = "";

    // Update Mode Card State
    if (this.modeTwentyOnePill && this.modeEndlessPill) {
      this.modeTwentyOnePill.classList.toggle("is-active", game.gameMode === "twenty_one");
      this.modeEndlessPill.classList.toggle("is-active", game.gameMode === "endless");
    }

    game.decks.forEach(deck => {
      const title = typeof deck.title === "object" ? (deck.title[game.lang] || deck.title.en) : deck.title;
      const tagline = typeof deck.tagline === "object" ? (deck.tagline[game.lang] || deck.tagline.en) : deck.tagline;
      const count = deck.questions ? deck.questions.length : 0;
      const isSpicy = deck.id === "spicy";

      const emojiMap = {
        couples: "💖",
        deep: "🌌",
        icebreaker: "🧊",
        pregame: "🎉",
        truth_or_drink: "🍷",
        would_you_rather: "🔀",
        hot_seat: "⚡",
        late_night: "🌙",
        spicy: "🌶️",
        do_you_know_me: "🧐",
        after_dark: "🌒",
        me_or_you: "⚖️"
      };
      const deckEmoji = emojiMap[deck.id] || "🃏";

      const card = document.createElement("div");
      card.className = "home-deck-card";
      card.style.setProperty("--card-accent", deck.accentColor || "#7C5CFC");

      card.innerHTML = `
        <div class="home-deck-left">
          <div class="home-deck-icon" style="background:${deck.accentGlow || 'rgba(124,92,252,0.15)'};color:${deck.accentColor || '#7C5CFC'}">
            <span style="font-size:1.45rem">${deckEmoji}</span>
          </div>
          <div class="home-deck-info">
            <div style="display:flex;align-items:center;gap:6px">
              <h4>${title}</h4>
              ${isSpicy ? '<span style="font-size:0.65rem;background:#FF1352;color:#fff;padding:2px 6px;border-radius:6px;font-weight:800">18+</span>' : ''}
            </div>
            <p>${tagline}</p>
          </div>
        </div>

        <div class="home-deck-right">
          <span class="deck-count-chip">${count} Q</span>
          <div class="play-arrow-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        sounds.playTap();
        this.launchGame(deck.id, game.gameMode);
      });

      this.homeDecksContainer.appendChild(card);
    });
  }

  launchGame(deckId, mode) {
    game.startSession(deckId, mode);
    this.applyDeckTheme(game.getCurrentDeck());
    this.renderCurrentCard();
    this.updateHeaderAndProgress();
    this.showScreen("game");
  }

  applyDeckTheme(deck) {
    if (!deck) return;
    document.documentElement.style.setProperty("--deck-accent", deck.accentColor || "#7C5CFC");
    document.documentElement.style.setProperty("--deck-glow", deck.accentGlow || "rgba(124, 92, 252, 0.25)");

    const title = typeof deck.title === "object" ? (deck.title[game.lang] || deck.title.en) : deck.title;
    if (this.deckTagBadge) this.deckTagBadge.textContent = title;
  }

  renderCurrentCard() {
    this.arenaEl.innerHTML = "";

    if (game.isSessionComplete()) {
      this.renderCompletionScreen();
      return;
    }

    const currentQ = game.getCurrentQuestion();
    const previewQ = game.getNextPreviewQuestion();
    const deck = game.getCurrentDeck();

    if (!currentQ) return;

    const deckTitle = typeof deck.title === "object" ? (deck.title[game.lang] || deck.title.en) : deck.title;
    const qText = currentQ[game.lang] || currentQ.en || currentQ.id;

    // Background Ghost Preview Card
    if (previewQ) {
      const ghostEl = document.createElement("div");
      ghostEl.className = "card-ghost-bg";
      this.arenaEl.appendChild(ghostEl);
    }

    // Top Interactive Card
    const cardEl = document.createElement("div");
    cardEl.className = "card-element";

    const isFav = game.isFavorite(qText);
    if (this.btnFav) this.btnFav.classList.toggle("is-active", isFav);

    const backPrompt = game.lang === "id" 
      ? "Kiat Refleksi: Luangkan waktu sejenak untuk menjawab tanpa filter. Giliran berikutnya akan berganti ke lawan bicaramu!" 
      : "Reflection Prompt: Take a moment to answer with zero filter. The next turn passes to your partner!";

    const isEndless = game.gameMode === "endless";
    const cardModeLabel = !isEndless 
      ? "21 Q" 
      : (game.lang === "id" ? "♾️ Tanpa Batas" : "♾️ Endless");

    const cardNumberLabel = !isEndless
      ? `#${game.currentIndex + 1} / 21`
      : `#${game.currentIndex + 1} • ♾️`;

    const tagClass = !isEndless ? "is-classic-tag" : "is-endless-tag";

    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <div class="badge-pass">${game.lang === "id" ? "LEWAT" : "PASS"}</div>
          <div class="badge-next">${game.lang === "id" ? "JAWAB" : "NEXT"}</div>
          
          <div class="card-meta-top">
            <div class="card-category-tag">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${deck.accentColor}"></span>
              ${deckTitle}
            </div>
            <div class="card-number-tag ${tagClass}">
              ${cardNumberLabel}
            </div>
          </div>

          <div class="card-question-box">
            <div class="card-question-text">${qText}</div>
          </div>

          <div class="card-footer-cue">
            <div class="flip-prompt">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>${game.lang === "id" ? "Ketuk kartu untuk balik" : "Tap card to flip"}</span>
            </div>
            <span style="${isEndless ? 'color:#34D399;font-weight:700' : ''}">${cardModeLabel}</span>
          </div>
        </div>

        <div class="card-back">
          <div class="card-back-content">
            <div class="back-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              <span>${game.lang === "id" ? "Aturan & Refleksi" : "Card Insight"}</span>
            </div>
            
            <div class="back-body">
              <h3 class="back-title">${deckTitle}</h3>
              <p class="back-instructions">${backPrompt}</p>
            </div>

            <div class="card-footer-cue">
              <div class="flip-prompt">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38l-5.67-5.67"/></svg>
                <span>${game.lang === "id" ? "Ketuk untuk kembali ke pertanyaan" : "Tap to return to question"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.arenaEl.appendChild(cardEl);
    this.cardController.setupTopCard(cardEl);
  }

  renderCompletionScreen() {
    const deck = game.getCurrentDeck();
    const deckTitle = typeof deck.title === "object" ? (deck.title[game.lang] || deck.title.en) : deck.title;

    const title = game.lang === "id" ? "Sesi Selesai!" : "Session Completed!";
    const desc = game.lang === "id" 
      ? `Kalian telah menyelesaikan 21 pertanyaan dalam deck "${deckTitle}". Kalian saling mengenal lebih dalam sekarang!`
      : `You've completed all 21 questions from the "${deckTitle}" deck. You know each other much deeper now!`;
    const restartText = game.lang === "id" ? "Pilih Game / Deck Lain" : "Pick Another Game / Deck";
    const replayText = game.lang === "id" ? "Kocok Ulang Deck Ini" : "Reshuffle This Deck";

    this.arenaEl.innerHTML = `
      <div class="completion-container">
        <div class="completion-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h2 class="completion-title">${title}</h2>
        <p class="completion-desc">${desc}</p>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px">
          <button id="btnRestartSession" class="btn-primary" style="width:100%">
            ${replayText}
          </button>
          <button id="btnPickAnotherDeck" class="dock-btn" style="width:100%;padding:14px;border-radius:14px;color:#fff">
            ${restartText}
          </button>
        </div>
      </div>
    `;

    document.getElementById("btnRestartSession")?.addEventListener("click", () => {
      this.launchGame(game.currentDeckId, game.gameMode);
    });
    document.getElementById("btnPickAnotherDeck")?.addEventListener("click", () => {
      this.showScreen("home");
    });
  }

  handleNextQuestion() {
    game.advanceNext();
    this.renderCurrentCard();
    this.updateHeaderAndProgress();
  }

  handlePrevQuestion() {
    if (game.currentIndex > 0) {
      game.advancePrev();
      this.renderCurrentCard();
      this.updateHeaderAndProgress();
    }
  }

  handleFavoriteToggle() {
    const q = game.getCurrentQuestion();
    if (!q) return;
    const deck = game.getCurrentDeck();
    const deckTitle = typeof deck.title === "object" ? (deck.title[game.lang] || deck.title.en) : deck.title;
    const isFav = game.toggleFavorite(q, deckTitle);
    if (this.btnFav) this.btnFav.classList.toggle("is-active", isFav);
  }

  updateFlipUI(isFlipped) {
    // Optional UI reflection
  }

  updateHeaderAndProgress() {
    const { current, total, percent, isEndless } = game.getProgress();
    
    if (this.progressFill) {
      if (isEndless) {
        this.progressFill.style.width = "100%";
        this.progressFill.classList.add("is-endless-bar");
      } else {
        this.progressFill.style.width = `${percent}%`;
        this.progressFill.classList.remove("is-endless-bar");
      }
    }

    if (this.progressText) {
      if (isEndless) {
        this.progressText.innerHTML = game.lang === "id"
          ? `<span style="color:#34D399;font-weight:800">#${current}</span> • <span style="color:#06B6D4">♾️ Tanpa Batas</span>`
          : `<span style="color:#34D399;font-weight:800">#${current}</span> • <span style="color:#06B6D4">♾️ Endless</span>`;
      } else {
        this.progressText.innerHTML = `<span style="color:#C4B5FD;font-weight:800">${current}</span> / 21`;
      }
    }

    if (game.enableTurns) {
      const activePlayer = game.getCurrentPlayer();
      if (this.playerPill) {
        this.playerPill.style.display = "inline-flex";
        this.playerName.textContent = activePlayer || "Pemain";
      }
    } else {
      if (this.playerPill) this.playerPill.style.display = "none";
    }

    if (this.btnPrev) {
      this.btnPrev.style.opacity = game.currentIndex === 0 ? "0.4" : "1";
      this.btnPrev.style.pointerEvents = game.currentIndex === 0 ? "none" : "auto";
    }
  }

  renderDecksList() {
    if (!this.decksListContainer) return;
    this.decksListContainer.innerHTML = "";

    const emojiMap = {
      couples: "💖",
      deep: "🌌",
      icebreaker: "🧊",
      pregame: "🎉",
      truth_or_drink: "🍷",
      would_you_rather: "🔀",
      hot_seat: "⚡",
      late_night: "🌙",
      spicy: "🌶️",
      do_you_know_me: "🧐",
      after_dark: "🌒",
      me_or_you: "⚖️"
    };

    game.decks.forEach(deck => {
      const title = typeof deck.title === "object" ? (deck.title[game.lang] || deck.title.en) : deck.title;
      const tagline = typeof deck.tagline === "object" ? (deck.tagline[game.lang] || deck.tagline.en) : deck.tagline;
      const count = deck.questions ? deck.questions.length : 0;
      const isActive = deck.id === game.currentDeckId;
      const deckEmoji = emojiMap[deck.id] || "🃏";
      const isSpicy = deck.id === "spicy";

      const item = document.createElement("div");
      item.className = `deck-item-card ${isActive ? "is-active" : ""}`;
      item.innerHTML = `
        <div class="deck-icon-badge" style="background:${deck.accentGlow || 'rgba(124,92,252,0.2)'};color:${deck.accentColor || '#7C5CFC'}">
          <span style="font-size:1.45rem">${deckEmoji}</span>
        </div>
        <div class="deck-details">
          <div style="display:flex;align-items:center;gap:6px">
            <h4>${title}</h4>
            ${isSpicy ? '<span style="font-size:0.65rem;background:#FF1352;color:#fff;padding:2px 6px;border-radius:6px;font-weight:800">18+</span>' : ''}
          </div>
          <p>${tagline}</p>
        </div>
        <div style="font-size:0.75rem;color:var(--text-tertiary);font-weight:600">
          ${count} Q
        </div>
      `;

      item.addEventListener("click", () => {
        sounds.playTap();
        this.launchGame(deck.id, game.gameMode);
        this.closeAllModals();
      });

      this.decksListContainer.appendChild(item);
    });
  }

  renderFavoritesList() {
    const container = document.getElementById("favoritesListContainer");
    if (!container) return;
    container.innerHTML = "";

    if (!game.favorites.length) {
      container.innerHTML = `
        <div style="text-align:center;padding:30px 10px;color:var(--text-tertiary)">
          ${game.lang === "id" ? "Belum ada pertanyaan favorit yang disimpan." : "No saved favorites yet."}
        </div>
      `;
      return;
    }

    game.favorites.forEach((fav, index) => {
      const card = document.createElement("div");
      card.className = "deck-item-card";
      card.innerHTML = `
        <div style="flex:1">
          <div style="font-size:0.75rem;color:var(--deck-accent);font-weight:700;margin-bottom:4px">${fav.deck || "Quriosity"}</div>
          <div style="font-size:0.95rem;line-height:1.4">${fav.text}</div>
        </div>
        <button class="icon-btn" style="flex-shrink:0;color:#EF4444" title="Hapus">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      `;

      const delBtn = card.querySelector("button");
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        game.favorites.splice(index, 1);
        game.saveFavorites();
        sounds.playTap();
        this.renderFavoritesList();
        if (!this.gameView.classList.contains("is-hidden")) {
          this.renderCurrentCard();
        }
      });

      container.appendChild(card);
    });
  }

  handleCreateCustomDeck() {
    const title = document.getElementById("customDeckTitle").value.trim();
    const questionsRaw = document.getElementById("customDeckQuestions").value.trim();

    if (!title || !questionsRaw) return;

    const questionsList = questionsRaw
      .split("\n")
      .map(q => q.trim())
      .filter(q => q.length > 0)
      .map(q => ({ en: q, id: q }));

    if (questionsList.length === 0) return;

    const newDeck = {
      id: "custom_" + Date.now(),
      title: { en: title, id: title },
      tagline: { en: "Custom User Deck", id: "Deck Kustom Buatanmu" },
      accentColor: "#F59E0B",
      accentGlow: "rgba(245, 158, 11, 0.25)",
      questions: questionsList
    };

    game.saveCustomDeck(newDeck);
    sounds.playDeckShuffle();
    this.closeAllModals();
    this.renderHomeView();
    this.renderDecksList();
    this.launchGame(newDeck.id, game.gameMode);
  }

  updateLanguageUI() {
    const langUpper = game.lang.toUpperCase();
    if (this.homeLangToggleBtn) this.homeLangToggleBtn.textContent = langUpper;
    if (this.gameLangToggleBtn) this.gameLangToggleBtn.textContent = langUpper;

    const isId = game.lang === "id";

    // Update Home Text
    const homeHeroTitle = document.getElementById("homeHeroTitle");
    const homeHeroSubtitle = document.getElementById("homeHeroSubtitle");
    const labelModeSelect = document.getElementById("labelModeSelect");
    const labelDeckSelect = document.getElementById("labelDeckSelect");
    const txtMode21Title = document.getElementById("txtMode21Title");
    const txtMode21Desc = document.getElementById("txtMode21Desc");
    const txtModeEndlessTitle = document.getElementById("txtModeEndlessTitle");
    const txtModeEndlessDesc = document.getElementById("txtModeEndlessDesc");
    const txtPassPlayTitle = document.getElementById("txtPassPlayTitle");
    const txtPassPlayDesc = document.getElementById("txtPassPlayDesc");
    const homeOpenCustomDeckBtn = document.getElementById("homeOpenCustomDeckBtn");

    if (homeHeroTitle) homeHeroTitle.textContent = isId ? "Pilih Jenis Game" : "Choose Your Game";
    if (homeHeroSubtitle) homeHeroSubtitle.textContent = isId 
      ? "Pilih mode permainan dan deck kartu untuk mencairkan suasana, memperdalam hubungan, atau seru-seruan bareng teman."
      : "Select your game mode and card deck to break the ice, deepen intimacy, or spark party fun.";
    if (labelModeSelect) labelModeSelect.textContent = isId ? "Mode Permainan" : "Game Mode";
    if (labelDeckSelect) labelDeckSelect.textContent = isId ? "Pilih Kategori Deck" : "Choose Card Deck";
    if (txtMode21Title) txtMode21Title.textContent = isId ? "Klasik 21 Q" : "Classic 21 Q";
    if (txtMode21Desc) txtMode21Desc.textContent = isId ? "Target 21 pertanyaan terarah & progress bar" : "Curated 21 questions with progress track";
    if (txtModeEndlessTitle) txtModeEndlessTitle.textContent = isId ? "Tanpa Batas" : "Endless Deck";
    if (txtModeEndlessDesc) txtModeEndlessDesc.textContent = isId ? "Kocok seluruh kartu sepuasnya tanpa batas" : "Shuffle and swipe all cards freely";
    if (txtPassPlayTitle) txtPassPlayTitle.textContent = isId ? "Pelacak Giliran (Pass & Play)" : "Turn Tracker (Pass & Play)";
    if (txtPassPlayDesc) txtPassPlayDesc.textContent = isId ? "Tukar giliran pemain otomatis di tiap kartu" : "Switch player turns automatically per card";
    if (homeOpenCustomDeckBtn) homeOpenCustomDeckBtn.textContent = isId ? "+ Buat Deck Sendiri" : "+ Create Custom Deck";

    const currentDeck = game.getCurrentDeck();
    if (currentDeck && this.deckTagBadge) {
      const title = typeof currentDeck.title === "object" ? (currentDeck.title[game.lang] || currentDeck.title.en) : currentDeck.title;
      this.deckTagBadge.textContent = title;
    }
  }

  openModal(modal) {
    if (!modal) return;
    modal.classList.add("is-open");
    sounds.playTap();
  }

  closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("is-open"));
  }
}

// Boot up
window.addEventListener("DOMContentLoaded", () => {
  new App();
});
