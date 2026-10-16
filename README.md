# ✨ Quriosity - Conversation Card Games

A modern conversation card game web app built to break the ice, deepen connections, and spark genuine conversations. Built with zero external dependencies, focusing on fast performance, minimalist dark aesthetics, fluid 3D card physics, and procedural synthesized audio.

---

## ✨ Key Features

1. **3D Card Gestures & Natural Physics:**
   - **Swipe Right:** Answer & advance to the next card.
   - **Swipe Left:** Skip the current question.
   - **Tap / Flip:** Flip the card to view thoughtful conversation tips and reflections.
   - Stacked card depth with realistic multi-layer drop shadows.

2. **12 Curated Decks (Bilingual: English & Indonesian):**
   - 💖 **Couples:** Emotional intimacy, romantic sparks, and vulnerability.
   - 🌌 **Deep Convos:** Existential reflections, core values, and life philosophy.
   - 🧊 **Ice Breaker:** Lighthearted, relaxed prompts to ease awkwardness.
   - 🎉 **Party & Pregame:** High energy, wild stories, and social catalysts.
   - 🍷 **Truth or Drink:** Candid confessions or take a sip.
   - 🔀 **Would You Rather:** Engaging dilemmas and playful debates.
   - ⚡ **Hot Seat:** Quick-fire questions directed at one person in the spotlight.
   - 🌙 **Late Night:** 3 AM thoughts, vulnerability, and nostalgia.
   - 🌶️ **Spicy & Intimate (18+):** Daring fantasies, passion, and unfiltered chemistry.
   - 🧐 **Do You Know Me?:** Put your friends or partner to the test on how well they know your habits.
   - 🌒 **After Dark:** Midnight admissions, confessions, and taboo subjects.
   - ⚖️ **Me or You?:** Point fingers at who is most likely to do what.

3. **Game Modes & Turn Tracking:**
   - 🎯 **Classic 21 Questions:** An intimate 21-card session with a glowing progress tracker.
   - ♾️ **Endless Mode:** Shuffles the entire deck in an infinite loop for continuous play.
   - 👥 **Pass & Play (Turn Tracker):** Automatically tags turns (Player 1, Player 2, etc.) for each card.

4. **Zero-Asset Procedural Audio & Haptics:**
   - Synthesized using the native **Web Audio API** (card whooshes, deck shuffles, gentle taps, and completion chimes) without downloading heavy audio files.
   - Mobile **Vibration API** integration for tactile haptic feedback.

5. **Customization & Bookmarks:**
   - **Custom Deck Builder:** Create and save your own question prompts directly in the browser.
   - **Favorites:** Bookmark meaningful questions to revisit later.

---

## 🚀 Getting Started

### Local Development
Run the built-in, zero-dependency Node.js server:
```bash
npm start
# or
node server.js
```
Then visit `http://localhost:3000/` in your browser.

### Deployment (Vercel)
This project is configured for instant static deployment with `vercel.json` and supports Vercel Web Analytics and Speed Insights out of the box.
```bash
vercel
```
