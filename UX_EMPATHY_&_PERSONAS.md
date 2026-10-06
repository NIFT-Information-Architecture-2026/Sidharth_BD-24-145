# Phase 2: Empathy & User Experience Modeling

## 1. User Spectrum & Archetypes

Our software caters to a progressive spectrum of creative users, spanning from digital newcomers to industry veterans.

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                           USER SPECTRUM ARCHETYPES                             │
├───────────────────┬───────────────────┬───────────────────┬────────────────────┤
│ 1. Traditional    │ 2. Novice /       │ 3. Pro Concept    │ 4. Professional    │
│    Transitioner   │    Hobbyist       │    Artist         │    2D Animator     │
├───────────────────┼───────────────────┼───────────────────┼────────────────────┤
│ • Moving from     │ • Learning digital│ • Demands speed,  │ • Demands frame-   │
│   paper/canvas    │   illustration    │   high-res layers,│   by-frame control,│
│ • Intimidated by  │ • Wants quick,    │   custom brushes, │   multi-track time-│
│   complex software│   fun results     │   and precision   │   line, and audio  │
│   UI clutter      │   without bloat   │   non-destructive │   scrubbing        │
│                   │                   │   adjustments     │                    │
└───────────────────┴───────────────────┴───────────────────┴────────────────────┘
```

---

## 2. Core UX Strategy: Progressive Disclosure & Adaptive Workspaces

To serve all 4 archetypes without overwhelming beginners or stifling pros, the software implements **Progressive Disclosure**:

1. **Zen / Sketchbook Mode (Default for Beginners & Traditional Artists):**
   - Pure, distraction-free canvas with physical media analogies (Pencil 2B, Ink Pen, Watercolor, Paper Texture).
   - Single-tap color palette and gesture-driven HUD.
2. **Pro Studio Mode (For Concept Artists & Illustrators):**
   - Surfaces deep multi-nested layer hierarchies, adjustment layers, dual-texture brush tuning, and keyboard shortcuts.
3. **Animation Suite Mode (For 2D Animators):**
   - Unrolls the full multi-track timeline, onion-skin controls, frame rates, and audio tracks.

---

## 3. Empathy Map: Creator Pain Points vs. Our UX Solutions

| What They Experience Elsewhere | What They Feel | Our UX Solution |
| :--- | :--- | :--- |
| Overwhelming menus with 500+ buttons (Photoshop/Krita) | Anxiety, intimidation, paralyzed creative flow | **Zen Canvas & HUD:** Tools hidden until invoked. |
| Artificial digital line feel, lack of paper "friction" | Disconnected from physical drawing roots | **Dual-Texture Engine:** Natural tooth & grain feedback. |
| Abrupt jump between drawing and animation UI | Frustration with rigid software boundaries | **Seamless Mode Switcher:** Transition from sketch to animation without leaving the canvas. |
| Hardware slowdowns & layer limits on high-res art | Restriced, paranoid about running out of layers | **Memory-Chunked Tiled Engine:** Efficient RAM/GPU utilization. |
