# Phase 3: Information Architecture & Taxonomy Specification

## 1. Global Application Hierarchy & Mode Scaffolding

The application architecture is organized around 3 adaptive modes that adjust UI density based on user intent and skill level, supported by an **always-present Non-Dominant Hand Left Rail**:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GLOBAL NAVIGATION & TAXONOMY                          │
├──────────────────────┬──────────────────────────────┬───────────────────────────┤
│ 1. Zen Mode          │ 2. Pro Studio Mode           │ 3. Animation Mode         │
│    (Traditional/     │    (Concept & Digital        │    (Frame-by-Frame &      │
│     Beginner)        │     Illustrator)             │     Multi-Track)          │
├──────────────────────┼──────────────────────────────┼───────────────────────────┤
│ • 100% Borderless    │ • Multi-Layer Blend Studio   │ • Bottom Multi-Track      │
│   Glass Canvas       │ • Custom Brush Creator Lab   │   Timeline Scrubber Dock  │
│ • Floating Gesture   │ • Geometric Shapes & Lasso   │ • Onion Skinning Controls │
│   Radial HUD         │ • Deep Layer Blend Modes     │ • Variable Frame Rates    │
│ • Left Ergonomic Rail│ • Undo/Redo & Tool Swapping  │ • Frame Duplication       │
└──────────────────────┴──────────────────────────────┴───────────────────────────┘
```

---

## 2. Non-Dominant Hand Ergonomic Rail (Always Accessible)
Anchored on the left edge of the viewport to facilitate natural two-handed tablet and keyboard ergonomics:
- **Size Vertical Slider**: 2px to 80px stroke width.
- **Opacity Vertical Slider**: 10% to 100% paint opacity.
- **Color Disc**: Real-time swatch disk with system color picker access.
- **Quick-Swap Button (`Q`)**: One-tap toggle between the active and last used tool.

---

## 3. Custom Brush Lab Taxonomy
Creators can author and save custom brushes with 4 parameter tiers:
1. **Tip Profile**: Round, Chisel, Ink Calligraphy, Charcoal Tooth, Pixel Star, Splatter.
2. **Grain Texture**: Smooth, Cold-Press Paper, Canvas Weave, Halftone Dot Matrix.
3. **Dynamics Engine**: StreamLine / Smoothing (0-100%), Pressure Scale (1-5), Jitter.
4. **Interactive Scratchpad**: Real-time test sandbox before equipping.

---

## 4. Layer Blend Mode Architecture
Native HTML5 Canvas `globalCompositeOperation` bindings:
- **Normal (`source-over`)**: Opaque paint laydown.
- **Multiply (`multiply`)**: Darkening blend for inking, shading, and flat colors.
- **Screen (`screen`)**: Lightening blend for glows, laser swords, and atmospheric rim lights.
- **Overlay (`overlay`)**: High-contrast punch blending highlight and shadow.
- **Color Dodge (`color-dodge`)**: Neon luminescence for retro arcade effects.
- **Color (`color`)**: Preserves underlying luminance while re-tinting hues.

---

## 5. Learning-Curve Brush Taxonomy Ladder

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
│ • Pencils (HB, 2B, 6B)  │  │ • Soft Airbrushes &     │  │ • Custom Brush Lab      │
│ • Ink Pens & Nib Dip    │    Gradient Blenders     │  │ • Layer Blend Modes     │
│ • Charcoal & Pastels    │  │ • Geometric Shapes      │  │ • Geometric Vector Paths│
│ • Natural Eraser & Smudge│  │ • Lasso Freehand Select │  │ • Spring-Loaded Modifiers│
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```
