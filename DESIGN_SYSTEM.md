# Phase 5: Visual Design System & Design Tokens

## 1. Aesthetic Identity: Y2K Retro-Arcade Neo-Brutalisim

The visual language pairs high-speed gaming ergonomics with a playful, high-contrast Y2K retro-arcade aesthetic. It replaces sterile corporate grays with bold graphic silhouettes, tactile hard shadows, and customizable electric neon accents.

---

## 2. Color Tokens & Theme Engine

### Core UI Foundation
| Token | Default Hex | Description |
| :--- | :--- | :--- |
| `--color-canvas-bg` | `#130026` / `#FFFFFF` | Deep Indigo Arcade Grid or Clean Paper White |
| `--color-hud-plate` | `rgba(28, 5, 52, 0.88)` | Translucent Frosted Obsidian-Purple HUD Body |
| `--color-surface-border` | `#000000` | 2.5px Heavy Graphic Stroke |
| `--color-shadow-hard` | `4px 4px 0px #000000` | Tactical Neo-Brutalist Offset Drop Shadow |

### Customizable Accent Glow Presets (User Selectable)
The user can toggle glow effects ON/OFF and select their personal theme glow:

```css
:root {
  /* User-Selected Accent (Default: Cyber Magenta) */
  --accent-glow-active: #FF007F;
  --accent-glow-filter: 0 0 16px rgba(255, 0, 127, 0.75);
}

/* Palette Preset Swatches */
[data-theme="cyber-pink"]  { --accent-glow-active: #FF007F; --accent-glow-filter: 0 0 16px rgba(255, 0, 127, 0.8); }
[data-theme="electric-teal"]{ --accent-glow-active: #00F0FF; --accent-glow-filter: 0 0 16px rgba(0, 240, 255, 0.8); }
[data-theme="arcade-gold"]  { --accent-glow-active: #FFB800; --accent-glow-filter: 0 0 16px rgba(255, 184, 0, 0.8); }
[data-theme="acid-lime"]    { --accent-glow-active: #39FF14; --accent-glow-filter: 0 0 16px rgba(57, 255, 20, 0.8); }
[data-theme="vapor-violet"] { --accent-glow-active: #9D00FF; --accent-glow-filter: 0 0 16px rgba(157, 0, 255, 0.8); }
```

---

## 3. Dual-Typography Engine

Users can switch between maximum functional clarity and nostalgic arcade charm with a single click:

```
┌───────────────────────────────────────┬───────────────────────────────────────┐
│     MODE A: HELVETICA / SWISS SANS     │        MODE B: RETRO ARCADE PIXEL     │
│        (Maximum Readability)          │           (Stylistic Immersion)       │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ Font Stack:                           │ Font Stack:                           │
│ "Helvetica Neue", Helvetica, Arial,   │ "Press Start 2P", "VT323", monospace  │
│ sans-serif                            │                                       │
│                                       │                                       │
│ Sample Readout:                       │ Sample Readout:                       │
│ 2B GRAPHITE PENCIL • 16px • 90%       │ 2B PENCIL • 16PX • 90% [REC]          │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

---

## 4. Radial HUD Component Tokens (Arcade Edition)

```
                     [12:00] PENCIL
               ┌────────────────────────┐
               │    Arcade Yellow       │
               │    #FFB800 + Border    │
               └───────────┬────────────┘
                           │
       [9:00] PAINT        │        [3:00] ERASER
┌────────────────────────┐ │ ┌────────────────────────┐
│  Cyber Pink (#FF007F)  ├─┼─┤ Electric Teal (#00F0FF)│
│  Hard Shadow 3px       │ │ │ Hard Shadow 3px        │
└────────────────────────┘ │ └────────────────────────┘
                           │
               ┌───────────┴────────────┐
               │   RETRO CHIP STATUS    │
               │  "2B PENCIL • 16px"    │
               │   Font: Helvetica/8bit │
               └────────────────────────┘
```

### Component Micro-Interactions:
- **Button Hover:** 2px downward translate + shadow compression (`translate(2px, 2px)`).
- **Active Wheel Slice:** Inset neon stroke pulse + outer radial glow ring.
- **Sound Effect (SFX) Option:** Subtle 8-bit blip audio feedback on slot selection (toggleable in preferences).
