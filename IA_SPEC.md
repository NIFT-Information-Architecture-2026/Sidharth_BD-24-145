# Phase 3: Information Architecture & Taxonomy Specification

## 1. Global Application Hierarchy & Mode Scaffolding

The application architecture is organized around 3 adaptive modes that adjust UI density based on user intent and skill level:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GLOBAL NAVIGATION & TAXONOMY                          │
├──────────────────────┬──────────────────────────────┬───────────────────────────┤
│ 1. Zen Mode          │ 2. Pro Studio Mode           │ 3. Animation Mode         │
│    (Traditional/     │    (Concept & Digital        │    (Frame-by-Frame &      │
│     Beginner)        │     Illustrator)             │     Multi-Track)          │
├──────────────────────┼──────────────────────────────┼───────────────────────────┤
│ • 100% Borderless    │ • Collapsible Floating Panels│ • Bottom Multi-Track      │
│   Glass Canvas       │ • Multi-Nested Layer Tree    │   Timeline Dock           │
│ • Floating Gesture   │ • Non-Destructive Modifiers  │ • Onion Skinning Controls │
│   Radial HUD         │ • Deep Color Wheel & Swatches│ • Audio Scrubbing & Sync  │
└──────────────────────┴──────────────────────────────┴───────────────────────────┘
```

---

## 2. Learning-Curve Brush Taxonomy

Brushes are organized progressively into 3 tiers matching the user's digital proficiency:

```
                  ┌──────────────────────────────────────────────┐
                  │          BRUSH TAXONOMY LADDER               │
                  └──────────────────────┬───────────────────────┘
                                         │
     ┌───────────────────────────────────┼───────────────────────────────────┐
     ▼                                   ▼                                   ▼
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│ LEVEL 1: TRADITIONAL    │  │ LEVEL 2: DIGITAL        │  │ LEVEL 3: ADVANCED       │
│ ESSENTIALS              │  │ EXPRESSIVE              │  │ PROCEDURAL & ENGINE     │
├─────────────────────────┤  ├─────────────────────────┤  ├─────────────────────────┤
│ Analog-familiar mediums:│  │ Digital painting tools: │  │ Deep technical control: │
│ • Pencils (HB, 2B, 6B)  │  │ • Soft Airbrushes &     │  │ • Dual-Texture Bleed    │
│ • Ink Pens & Nib Dip    │    Gradient Blenders     │    Mixers               │
│ • Charcoal & Pastels    │  │ • Textural Canvas &     │  │ • Color Jitter Brushes  │
│ • Watercolor & Oil Paint│    Paper Grain Stamps    │  │ • Vector Path Inkers    │
│ • Natural Smudge/Eraser │  │ • Flat Chisel Blocking  │  │ • Full Brush Studio     │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```

### Detailed Tier Breakdown:

1. **Level 1 — Traditional Essentials (Default Starter Kit):**
   - **Target User:** Traditional transitioners and sketching beginners.
   - **UX Design:** Clean analog icons, zero cryptic sliders, pre-tuned pressure dynamics that mirror real paper friction.

2. **Level 2 — Digital Expressive (Intermediate Toolkit):**
   - **Target User:** Illustrators building digital shading, texture, and speed-painting workflows.
   - **UX Design:** Surfaces brush flow, grain scale toggles, and StreamLine stabilization controls.

3. **Level 3 — Advanced Procedural & Engine (Pro Studio):**
   - **Target User:** Concept artists, animators, and brush creators.
   - **UX Design:** Unlocks full 10-parameter Brush Studio editor, custom pressure curves, dual-texture blending, and custom brush pack importing (`.brushset`, `.kra`).
