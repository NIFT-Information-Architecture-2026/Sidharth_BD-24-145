# Phase 1: Narrative, Objectives & Competitor Audit

## 1. Executive Summary & Vision
An open-source, distraction-free 2D illustration and frame-by-frame animation software. It combines the fluid, gesture-driven ergonomics of Procreate with an open, cross-platform desktop architecture (Windows, macOS, Linux).

---

## 2. Core Value Pillars
1. **100% Full-Bleed Canvas:** Zero permanent sidebars; all controls accessible via an on-demand HUD / Radial menu.
2. **Fluid Engine Performance:** GPU-accelerated dual-texture brush engine with real-time Catmull-Rom spline stroke smoothing.
3. **Hybrid Raster/Vector Pipeline:** Crisp vector paths with rich, textured raster ink fills.
4. **Open & Extensible:** Open file formats (`.ora`, `.kra`, SVG, PSD), native version history, and community plugin support.

---

## 3. Competitor Analysis: Procreate UI/UX Limitations & Our Opportunities

| Feature Area | Procreate Limitation | Our Solution Architecture |
| :--- | :--- | :--- |
| **Layer Hierarchy** | Only 1 level of group nesting; no layer search or color-tagging. | Deep multi-nested layer trees (`Folder > Sub-folder > Layer`) with search and tag filters. |
| **Workspace Layout** | Fixed UI sliders; modal brush pop-over blocks up to 40% of canvas. | On-demand HUD & Radial quick-menu; 100% full-screen canvas. |
| **Animation System** | Elementary "Animation Assist" (1 layer = 1 frame); no multi-track timeline. | Multi-track timeline separating content layers from time keyframes, with audio support. |
| **File Standards** | Proprietary `.procreate` format locked to iOS ecosystem. | Open standards (`.ora`, `.kra`, SVG) with cross-platform desktop interoperability. |
| **Modifiers & Edits** | Destructive pixel adjustments; no non-destructive adjustment layers. | Non-destructive adjustment layers and live filter nodes. |
