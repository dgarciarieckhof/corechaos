# 🌀 CORE CHAOS
“What kind of emotional chaos are you?”
A retro-style interactive quiz that assigns users to one of three archetypes — Flame, Mirror, or Grinder — based on their answers. Users can share results via image download or mobile-native sharing.

## 📦 Features Implemented
### 🧠 Core Quiz Flow
- Randomized 10-question experience with 3 answer types (flame, mirror, grinder)
- Dynamic loading of localized questions from assets/questions/questions-<lang>.json with fallback to English
- Score tracking and dominant personality logic (pure, combo, or triad)

### 🖼️ Result Modal
- Displays result meme + class name and description
- Responsive, styled with neon pixel-art aesthetic (Press Start 2P)
- Text truncation fixed; modal resized and scrollable

### 📸 Image Export & Sharing
- Dynamically renders a PNG from DOM content (meme image + text)
- Class and description now appear enlarged and drawn on top of the meme
- Website link (corechaos.io) displayed at the bottom of the meme

### 📱 Sharing
- Download button triggers the PNG generation
- X (Twitter) & WhatsApp buttons support:
    - Mobile-native share using navigator.share({ files })
    - Fallback links for desktop browsers

```bash
index.html
style.css
script.js
game.js
assets/
  ├─ questions/
  ├─ icons/
  ├─ memes/
  └─ sounds/
```

## To-Do
- Add reactiveness so it can be played in mobile/desktop/tablets
- Improve layout, and responsiveness
- Add ads trhough pop ups once you are done with the quizz
- Add ads at the bottom of the footer icons
- Optimize code structure