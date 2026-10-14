# crown_of_shawdons
# CROWN OF SHADOWS

A complete medieval fantasy RPG board game built with HTML5, CSS3, and Vanilla JavaScript.

---

## How to Open in VS Code

1. Open VS Code
2. Go to **File → Open Folder**
3. Select the `hackathon/` folder
4. You will see the full project structure

---

## How to Run with Live Server

1. Install the **Live Server** extension in VS Code (by Ritwick Dey)
2. Right-click `index.html` in the Explorer panel
3. Select **"Open with Live Server"**
4. The game opens in your browser at `http://127.0.0.1:5500`

---

## Project Structure

```
hackathon/
├── index.html          ← Main HTML (all screens and modals)
├── css/
│   └── style.css       ← All styles (organized by section)
├── js/
│   └── main.js         ← All game logic (organized by module)
├── assets/
│   ├── images/         ← Place your images here (see below)
│   └── videos/         ← Place intro-dragon.mp4 here (optional)
└── README.md
```

---

## Image Replacement Guide

Place your images in `assets/images/` with these exact filenames:

| File | Used For | Recommended Size |
|------|----------|-----------------|
| `bg-compass-medieval.png` | Welcome screen background | 1920×1080 |
| `crown-of-shadows-cover.png` | Game logo/cover | 600×300 (transparent PNG) |
| `board-map.png` | Game board background texture | 900×650 |
| `dragon.png` | Home screen dragon | 400×400 (transparent PNG) |
| `harley.jpg` | Harley character portrait | 400×500 |
| `morgan.jpg` | Morgan character portrait | 400×500 |
| `lyria.jpg` | Lyria character portrait | 400×500 |
| `goblin.png` | Goblin enemy token | 64×64 |
| `skeleton.png` | Skeleton enemy token | 64×64 |
| `orc.png` | Orc enemy token | 64×64 |
| `guardian.png` | Portal Guardian token | 64×64 |

> All images have fallbacks. If an image is missing, the game still works.

---

## Data Storage

All data is saved locally in your browser using **localStorage**.  
No data is sent to any server. This is a demo/local version.

Saved data includes:
- User accounts
- Terms acceptance
- Character edits (name, nickname, equipment)
- Game progress (positions, HP, mana, XP, gold)
- Inventory
- Quest progress
- Settings

---

## Player Flow

```
ENTER APP → ACCEPT TERMS → CREATE ACCOUNT / LOGIN
→ HOME → CHARACTERS → GAME BOARD
→ MOVE → ROLL D20 → FIGHT → USE ABILITIES
→ COLLECT ITEMS → COMPLETE QUESTS
→ DEFEAT THE GUARDIAN → REACH THE PORTAL → VICTORY
```

---

## Characters

| Character | Class | Special Ability | Mana Color |
|-----------|-------|----------------|------------|
| Harley | Mage | Arcane Orb (ranged, costs mana) | Gold/Yellow |
| Morgan | Warrior | Powerful Strike (melee, high damage) | Gold/Yellow |
| Lyria | Rogue | Shadow Attack (high crit chance) | Gold/Yellow |

---

## Enemies

| Enemy | HP | Notes |
|-------|----|-------|
| Goblin | 30 | Fast, weak |
| Skeleton | 40 | Medium threat |
| Orc | 60 | Tough melee |
| Portal Guardian | 100 | Boss — defeat to unlock portal |

---

## Responsive Support

- ✅ Android phones
- ✅ iPhones
- ✅ Tablets
- ✅ MacBooks / Laptops
- ✅ Desktop computers
- ✅ Mouse + Touch controls
- ✅ No hover dependency
- ✅ No keyboard dependency

