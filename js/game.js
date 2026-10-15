// 21 Questions - Game State Manager & Session Logic

import { DECKS } from "./data/decks.js";
import { sounds } from "./audio.js";

const STORAGE_KEY_FAVS = "21q_favorites_v1";
const STORAGE_KEY_CUSTOM = "21q_custom_decks_v1";
const STORAGE_KEY_SETTINGS = "21q_settings_v1";

export class GameManager {
  constructor() {
    this.decks = [...DECKS];
    this.currentDeckId = "couples";
    this.gameMode = "twenty_one"; // "twenty_one" | "endless"
    this.lang = "id"; // Default Indonesian as requested, toggleable to "en"
    
    // Players setup
    this.players = ["Pemain 1", "Pemain 2"];
    this.enableTurns = true;
    this.currentPlayerIndex = 0;

    // Active session cards
    this.activeQuestions = [];
    this.currentIndex = 0;
    this.history = [];
    this.favorites = this.loadFavorites();

    this.loadCustomDecks();
    this.loadSettings();
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lang) this.lang = parsed.lang;
        if (parsed.gameMode) this.gameMode = parsed.gameMode;
        if (parsed.enableTurns !== undefined) this.enableTurns = parsed.enableTurns;
        if (parsed.players && Array.isArray(parsed.players)) this.players = parsed.players;
      }
    } catch (e) {}
  }

  saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({
        lang: this.lang,
        gameMode: this.gameMode,
        enableTurns: this.enableTurns,
        players: this.players
      }));
    } catch (e) {}
  }

  loadFavorites() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_FAVS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(this.favorites));
    } catch (e) {}
  }

  isFavorite(questionText) {
    return this.favorites.some(f => f.text === questionText);
  }

  toggleFavorite(currentQuestion, deckTitle) {
    const text = currentQuestion[this.lang] || currentQuestion.en || currentQuestion.id;
    const existsIndex = this.favorites.findIndex(f => f.text === text);

    if (existsIndex >= 0) {
      this.favorites.splice(existsIndex, 1);
    } else {
      this.favorites.unshift({
        text,
        deck: deckTitle,
        addedAt: new Date().toISOString()
      });
    }
    this.saveFavorites();
    sounds.playTap();
    return this.isFavorite(text);
  }

  loadCustomDecks() {
    try {
      const custom = localStorage.getItem(STORAGE_KEY_CUSTOM);
      if (custom) {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed)) {
          this.decks = [...DECKS, ...parsed];
        }
      }
    } catch (e) {}
  }

  saveCustomDeck(newDeck) {
    try {
      const currentCustomStr = localStorage.getItem(STORAGE_KEY_CUSTOM);
      const customDecks = currentCustomStr ? JSON.parse(currentCustomStr) : [];
      customDecks.push(newDeck);
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customDecks));
      this.decks.push(newDeck);
    } catch (e) {}
  }

  startSession(deckId, mode = "twenty_one") {
    this.currentDeckId = deckId;
    this.gameMode = mode;
    this.currentIndex = 0;
    this.history = [];
    this.currentPlayerIndex = 0;

    const deck = this.getCurrentDeck();
    if (!deck) return;

    // Shuffle questions
    let pool = [...deck.questions].sort(() => Math.random() - 0.5);

    if (this.gameMode === "twenty_one") {
      this.activeQuestions = pool.slice(0, 21);
    } else {
      this.activeQuestions = [...pool];
    }

    sounds.playDeckShuffle();
  }

  getCurrentDeck() {
    return this.decks.find(d => d.id === this.currentDeckId) || this.decks[0];
  }

  getCurrentQuestion() {
    return this.activeQuestions[this.currentIndex] || null;
  }

  getNextPreviewQuestion() {
    return this.activeQuestions[this.currentIndex + 1] || null;
  }

  getCurrentPlayer() {
    if (!this.enableTurns || !this.players.length) return null;
    return this.players[this.currentPlayerIndex % this.players.length];
  }

  advanceNext() {
    this.history.push(this.currentIndex);
    this.currentIndex++;
    this.currentPlayerIndex++;

    if (this.gameMode === "endless") {
      // Auto replenish cards so Endless Mode never ends
      const deck = this.getCurrentDeck();
      if (deck && this.currentIndex >= this.activeQuestions.length - 2) {
        const moreQuestions = [...deck.questions].sort(() => Math.random() - 0.5);
        this.activeQuestions.push(...moreQuestions);
      }
    } else {
      if (this.isSessionComplete()) {
        sounds.playCompleteFanfare();
      }
    }
  }

  advancePrev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      if (this.currentPlayerIndex > 0) {
        this.currentPlayerIndex--;
      }
    }
  }

  isSessionComplete() {
    if (this.gameMode === "endless") return false;
    return this.currentIndex >= this.activeQuestions.length;
  }

  getProgress() {
    if (this.gameMode === "endless") {
      return {
        current: this.currentIndex + 1,
        total: "∞",
        percent: 100,
        isEndless: true
      };
    }
    const total = 21;
    const current = Math.min(this.currentIndex + 1, total);
    const percent = Math.min((this.currentIndex / total) * 100, 100);
    return { current, total, percent, isEndless: false };
  }

  setLanguage(newLang) {
    this.lang = newLang;
    this.saveSettings();
  }
}

export const game = new GameManager();
