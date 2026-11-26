# Phase 4: User Flows & Low-Fidelity Wireframes

## 1. Complete Creative Workspace Layout (Pro Edition)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [≡] ARCADE_FLOW_2D        [ZEN] [PRO STUDIO] [ANIMATION]   [LAYERS] [LAB]  │
├───────┬────────────────────────────────────────────────────────────────────┤
│[RAIL] │                                            [▭ RECT ○ CIRCLE ╱ LINE]│
│ SIZE  │                                                                    │
│ [===] │                                                                    │
│ OPAC  │                        100% CANVAS VIEWPORT                        │
│ [===] │                                                                    │
│ COLOR │                    ┌─────────────────────────┐                     │
│  (●)  │                    │   GAMING RADIAL HUD     │                     │
│ SWAP  │                    │   (Prototype Dial)      │                     │
│  (Q)  │                    └─────────────────────────┘                     │
│       │                                                    [ZOOM: 100%]    │
├───────┴────────────────────────────────────────────────────────────────────┤
│ [▶ PLAY] [+ NEW FRAME] [⧉ DUP] | 01  02 [03] 04 | [☑ ONION SKIN]  [12 FPS] │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Spring-Loaded Shortcut State Machine

The interface utilizes momentary "spring-loaded" hotkeys to enable split-second task execution without disrupting continuous drawing flow:

```
┌────────────────────────────────┐
│   ACTIVE DRAWING STATE         │
│   (e.g., Drawing with 2B Pencil)│
└───────────────┬────────────────┘
                │
                ├─────────────────────────────────────────┐
                │ Press & Hold "E"                        │ Press & Hold "Z"
                ▼                                         ▼
┌────────────────────────────────┐        ┌────────────────────────────────┐
│   SPRING-LOADED ERASER         │        │   SPRING-LOADED ZOOM/PAN       │
│   Canvas is in Erase Mode;     │        │   Mouse wheel / drag zooms     │
│   cursor transforms to eraser  │        │   canvas around focal point    │
└───────────────┬────────────────┘        └───────────────┬────────────────┘
                │                                         │
                │ Release "E"                             │ Release "Z"
                ▼                                         ▼
┌──────────────────────────────────────────────────────────────────────────┐
│   RETURN TO PREVIOUS TOOL STATE (Instantly in <10ms, Zero Clicks)        │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Tool Swapping & Undo State Engine
- **`Q` or `X`**: Swaps current tool with previous tool (e.g., instant toggling between Inking Nib and Watercolor Blender).
- **`Ctrl + Z` / `Cmd + Z`**: Canvas history pop restoring multi-layer states.
- **`Ctrl + Y`**: Redo history push.
- **Hold `Spacebar` / Right-Click**: Radial HUD blooms centered directly on cursor.
