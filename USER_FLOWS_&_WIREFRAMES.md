# Phase 4: User Flows & Low-Fidelity Wireframes

## 1. The Gaming Radial HUD Specification (Prototype-Inspired)

The core interaction paradigm of the software is an on-demand, gesture-driven **Radial HUD** centered at the cursor/stylus position.

```
                           [12:00] PENCIL
                              (North)
                   [10:30]                [1:30]
                  CHARCOAL               INK NIB
                         \              /
            [9:00]        ┌────────────┐        [3:00]
            PAINT / ──────┤ ACTIVE TIP ├─────── ERASER
            BLENDER       │  PREVIEW   │       (East)
                          └────────────┘
                         /              \
                   [7:30]                [4:30]
                   SMUDGE                COLOR WHEEL
                              [6:00]
                             TIMELINE
                             (South)
                                │
                        ┌───────────────┐
                        │   2B PENCIL   │  <-- Dynamic Status Readout
                        │  16px  •  90% │
                        └───────────────┘
```

---

## 2. Interaction State Machine: The "Flick & Release" Flow

```
┌─────────────────┐       Press & Hold Hotkey / Stylus Button
│  RESTING CANVAS │ ────────────────────────────────────────► ┌──────────────────────┐
│  (100% Bleed,   │                                           │   HUD BLOOM STATE    │
│   Zero Clutter) │ ◄──────────────────────────────────────── │ (Appears at cursor,  │
└─────────────────┘              Release Hotkey               │  Deadzone centered)  │
                                                              └──────────┬───────────┘
                                                                         │
                                                       Deflect Stylus / Drag Cursor
                                                                         │
                                                                         ▼
┌─────────────────┐             Release Hotkey                ┌──────────────────────┐
│  ACTIVE CANVAS  │ ◄──────────────────────────────────────── │   ACTIVE HOVER GLOW  │
│ (Switched Tool  │       (Tool selected instantly in         │ (Slot glows, reticle │
│  Ready to Draw) │                 <50ms)                    │  points, label read) │
└─────────────────┘                                           └──────────────────────┘
```

### State Details:
1. **State 0: Resting Canvas**
   - Canvas occupies 100% of the screen. Zero persistent sidebars or floating panels.
2. **State 1: HUD Bloom State**
   - Triggered by holding `Spacebar`, keyboard hotkey, or stylus barrel button.
   - The concentric radial wheel blooms smoothly (scale 0.85 -> 1.0, 120ms ease-out) centered directly on the cursor.
   - Center deadzone (radius 24px) prevents accidental mis-selection.
3. **State 2: Directional Hover & Reticle Snap**
   - Moving the cursor into one of the 8 radial slices activates that slot with a glowing accent rim.
   - The center reticle points towards the selected angle.
   - The bottom HUD text displays the tool name and active parameters.
4. **State 3: Snap & Release**
   - Releasing the hotkey collapses the HUD immediately.
   - The tool is armed and ready to draw without requiring an explicit confirmation click.

---

## 3. Screen Wireframe: Complete Creative Workspace Layout

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [≡] Project_01.ora            [Mode: Zen ▾]              Undo ↶ ↷ Redo [🗔]│ (Ultra-thin auto-hiding header)
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                                                                            │
│                                                                            │
│                           ┌──────────────┐                                 │
│                           │  RADIAL HUD  │                                 │
│                           │  (Pop-up on  │                                 │
│                           │   command)   │                                 │
│                           └──────────────┘                                 │
│                                                                            │
│                                                                            │
│                                                                            │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ [▶ Play] [⏺ Rec] | 01  02 [03] 04  05  06 | [Onion Skin: ON]  [FPS: 24]   │ (Collapsible Animation Dock)
└────────────────────────────────────────────────────────────────────────────┘
```
