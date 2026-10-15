/**
 * ARCADEFLOW 2D - INTERACTIVE PROTOTYPE ENGINE (v1.1 Robust Edition)
 * Delivers silky-smooth stroke interpolation and gaming radial HUD mechanics.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. CANVAS SETUP & RESOLUTION HANDLING
  // =========================================================================
  const viewport = document.getElementById('viewport');
  const drawingCanvas = document.getElementById('drawing-canvas');
  const onionCanvas = document.getElementById('onion-canvas');
  const drawCtx = drawingCanvas.getContext('2d');
  const onionCtx = onionCanvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  // Active Drawing & App State
  const state = {
    tool: 'pencil',          // 'pencil', 'ink', 'eraser', 'charcoal', 'paint', 'smudge'
    size: 10,
    opacity: 0.90,
    color: '#111111',
    mode: 'zen',             // 'zen', 'studio', 'anim'
    font: 'helvetica',
    theme: 'cyber-pink',
    glow: true,
    grid: false,
    onionSkin: true,
    fps: 12,
    isPlaying: false,
    currentFrameIndex: 0
  };

  // Tool Meta Icons
  const toolIcons = {
    pencil: '✏️',
    ink: '✒️',
    eraser: '🧹',
    color: '🎨',
    timeline: '🎞️',
    smudge: '💧',
    paint: '🖌️',
    charcoal: '🖍️'
  };

  // Animation Storage (array of DataURLs or ImageBitmaps for 100% reliability)
  let animationFrames = [];

  function resizeCanvas() {
    width = viewport.clientWidth;
    height = viewport.clientHeight;
    dpr = window.devicePixelRatio || 1;

    // Buffer dimensions
    drawingCanvas.width = width * dpr;
    drawingCanvas.height = height * dpr;
    onionCanvas.width = width * dpr;
    onionCanvas.height = height * dpr;

    // CSS dimensions
    drawingCanvas.style.width = width + 'px';
    drawingCanvas.style.height = height + 'px';
    onionCanvas.style.width = width + 'px';
    onionCanvas.style.height = height + 'px';

    // Reset transform and apply DPR scaling
    drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    onionCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Initial blank frame
    if (animationFrames.length === 0) {
      saveFrameSnapshot();
    } else {
      restoreCurrentFrame();
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // =========================================================================
  // 2. SILKY-SMOOTH "DIGITAL BUTTER" BRUSH ENGINE
  // =========================================================================
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let lastPressure = 0.5;

  function getCanvasCoords(e) {
    const rect = drawingCanvas.getBoundingClientRect();
    const pressure = (e.pressure && e.pressure > 0) ? e.pressure : 0.5;
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: pressure
    };
  }

  function applyBrushStyles(pressure) {
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';

    const p = pressure || 0.5;
    const baseWidth = Math.max(1, state.size * (0.3 + p * 0.7));

    if (state.tool === 'eraser') {
      drawCtx.globalCompositeOperation = 'destination-out';
      drawCtx.lineWidth = baseWidth * 1.5;
      drawCtx.strokeStyle = 'rgba(0,0,0,1)';
      drawCtx.fillStyle = 'rgba(0,0,0,1)';
      drawCtx.globalAlpha = 1.0;
    } else {
      drawCtx.globalCompositeOperation = 'source-over';
      drawCtx.strokeStyle = state.color;
      drawCtx.fillStyle = state.color;

      if (state.tool === 'pencil') {
        drawCtx.lineWidth = baseWidth;
        drawCtx.globalAlpha = state.opacity * (0.5 + p * 0.5);
      } else if (state.tool === 'ink') {
        drawCtx.lineWidth = baseWidth * 1.2;
        drawCtx.globalAlpha = state.opacity;
      } else if (state.tool === 'charcoal') {
        drawCtx.lineWidth = baseWidth * 1.4;
        drawCtx.globalAlpha = state.opacity * 0.7;
      } else if (state.tool === 'paint') {
        drawCtx.lineWidth = baseWidth * 1.6;
        drawCtx.globalAlpha = state.opacity * 0.85;
      } else if (state.tool === 'smudge') {
        drawCtx.lineWidth = baseWidth * 1.3;
        drawCtx.globalAlpha = 0.35;
      }
    }
  }

  // Pointer Down (Mouse, Tablet Stylus, Touch)
  drawingCanvas.addEventListener('pointerdown', (e) => {
    // If user right-clicks or stylus button (button 2), summon HUD instead of drawing
    if (e.button === 2) {
      e.preventDefault();
      openHUD(e.clientX, e.clientY);
      return;
    }

    if (hudOpen) {
      closeHUD();
      return;
    }

    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isDrawing = true;
    try { drawingCanvas.setPointerCapture(e.pointerId); } catch(err) {}

    const pos = getCanvasCoords(e);
    lastX = pos.x;
    lastY = pos.y;
    lastPressure = pos.pressure;

    // Draw initial dot
    drawCtx.save();
    applyBrushStyles(pos.pressure);
    drawCtx.beginPath();
    drawCtx.arc(pos.x, pos.y, drawCtx.lineWidth / 2, 0, Math.PI * 2);
    drawCtx.fill();
    drawCtx.restore();
  });

  // Pointer Move (Smooth quadratic bezier interpolation)
  drawingCanvas.addEventListener('pointermove', (e) => {
    if (!isDrawing || hudOpen) return;

    const pos = getCanvasCoords(e);
    const midX = (lastX + pos.x) / 2;
    const midY = (lastY + pos.y) / 2;
    const avgPressure = (lastPressure + pos.pressure) / 2;

    drawCtx.save();
    applyBrushStyles(avgPressure);

    drawCtx.beginPath();
    drawCtx.moveTo(lastX, lastY);
    drawCtx.quadraticCurveTo(lastX, lastY, midX, midY);
    drawCtx.stroke();

    // Round join fill to ensure zero gaps
    drawCtx.beginPath();
    drawCtx.arc(midX, midY, drawCtx.lineWidth / 2, 0, Math.PI * 2);
    drawCtx.fill();

    drawCtx.restore();

    lastX = pos.x;
    lastY = pos.y;
    lastPressure = pos.pressure;
  });

  // Pointer Up / Cancel
  function finishStroke() {
    if (!isDrawing) return;
    isDrawing = false;
    saveFrameSnapshot();
  }

  drawingCanvas.addEventListener('pointerup', finishStroke);
  drawingCanvas.addEventListener('pointercancel', finishStroke);
  drawingCanvas.addEventListener('pointerleave', finishStroke);

  // Prevent browser context menu on canvas so right-click is free for HUD
  drawingCanvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // =========================================================================
  // 3. GAMING-STYLE RADIAL HUD (PROTOTYPE INSPIRED)
  // =========================================================================
  const hud = document.getElementById('radial-hud');
  const hudReticle = document.getElementById('hud-reticle-needle');
  const hudReadoutTitle = document.getElementById('hud-readout-title');
  const hudSizeDisplay = document.getElementById('hud-size-display');
  const hudOpacityDisplay = document.getElementById('hud-opacity-display');
  const centerTipPreview = document.getElementById('center-tip-preview');
  const hudSlices = document.querySelectorAll('.hud-slice');
  const hudSummonBtn = document.getElementById('hud-summon-btn');
  const activeToolIcon = document.getElementById('active-tool-icon');
  const activeToolName = document.getElementById('active-tool-name');

  let hudOpen = false;
  let hudCenter = { x: 0, y: 0 };
  let currentHoveredTool = state.tool;

  function openHUD(clientX, clientY) {
    hudOpen = true;
    const rect = viewport.getBoundingClientRect();
    
    // Relative coordinates inside viewport
    let relX = clientX - rect.left;
    let relY = clientY - rect.top;

    // Boundary clamp so HUD never clips offscreen
    const pad = 165;
    relX = Math.max(pad, Math.min(width - pad, relX));
    relY = Math.max(pad, Math.min(height - pad, relY));

    hudCenter = { x: relX, y: relY };
    hud.style.left = `${relX}px`;
    hud.style.top = `${relY}px`;
    hud.classList.remove('hidden');

    currentHoveredTool = state.tool;
    updateHUDReadout(state.tool);
    updateReticleForTool(state.tool);
  }

  function closeHUD() {
    if (!hudOpen) return;
    hudOpen = false;
    hud.classList.add('hidden');

    if (currentHoveredTool) {
      selectTool(currentHoveredTool);
    }
  }

  function selectTool(toolKey) {
    if (toolKey === 'color') {
      document.getElementById('brush-color-picker').click();
      return;
    }
    if (toolKey === 'timeline') {
      toggleAnimationDock();
      return;
    }

    state.tool = toolKey;

    // Update active badges & preview
    activeToolIcon.textContent = toolIcons[toolKey] || '✏️';
    activeToolName.textContent = toolKey.toUpperCase();

    hudSlices.forEach(s => {
      s.classList.toggle('active', s.dataset.tool === toolKey);
    });

    updateTipPreview();
    updateHUDReadout(toolKey);
  }

  function updateHUDReadout(toolKey) {
    const slice = document.querySelector(`.hud-slice[data-tool="${toolKey}"]`);
    const label = slice ? slice.dataset.label : toolKey.toUpperCase();
    hudReadoutTitle.textContent = label;
    hudSizeDisplay.textContent = `SIZE: ${state.size}px`;
    hudOpacityDisplay.textContent = `OPACITY: ${Math.round(state.opacity * 100)}%`;
  }

  function updateReticleForTool(toolKey) {
    const slice = document.querySelector(`.hud-slice[data-tool="${toolKey}"]`);
    if (slice) {
      const angle = parseInt(slice.dataset.angle, 10);
      hudReticle.style.transform = `rotate(${angle + 90}deg)`;
    }
  }

  function updateTipPreview() {
    centerTipPreview.style.width = `${Math.min(32, Math.max(6, state.size))}px`;
    centerTipPreview.style.height = `${Math.min(32, Math.max(6, state.size))}px`;
    centerTipPreview.style.background = state.tool === 'eraser' ? '#FFFFFF' : state.color;
  }

  // Keyboard Spacebar Hold & Release
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !hudOpen && !e.repeat) {
      e.preventDefault();
      openHUD(lastGlobalMouse.x, lastGlobalMouse.y);
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && hudOpen) {
      e.preventDefault();
      closeHUD();
    }
  });

  // Mouse Tracking for Polar Angle Selection
  let lastGlobalMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  window.addEventListener('mousemove', (e) => {
    lastGlobalMouse = { x: e.clientX, y: e.clientY };

    if (hudOpen) {
      const rect = viewport.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const dx = cursorX - hudCenter.x;
      const dy = cursorY - hudCenter.y;
      const dist = Math.hypot(dx, dy);

      // Deadzone threshold (25px)
      if (dist > 25) {
        let deg = Math.atan2(dy, dx) * (180 / Math.PI);
        if (deg < 0) deg += 360;

        hudReticle.style.transform = `rotate(${deg + 90}deg)`;

        // Find closest slice
        let closest = null;
        let minDiff = Infinity;

        hudSlices.forEach(slice => {
          const sliceAngle = parseInt(slice.dataset.angle, 10);
          let diff = Math.abs(deg - sliceAngle);
          if (diff > 180) diff = 360 - diff;

          if (diff < minDiff) {
            minDiff = diff;
            closest = slice;
          }
        });

        if (closest && closest.dataset.tool !== currentHoveredTool) {
          currentHoveredTool = closest.dataset.tool;
          hudSlices.forEach(s => s.classList.toggle('active', s === closest));
          updateHUDReadout(currentHoveredTool);
        }
      }
    }
  });

  // Touch / Button Trigger for HUD
  hudSummonBtn.addEventListener('click', () => {
    if (!hudOpen) {
      openHUD(window.innerWidth / 2, window.innerHeight / 2);
    } else {
      closeHUD();
    }
  });

  // Direct Click on Slices
  hudSlices.forEach(slice => {
    slice.addEventListener('click', (e) => {
      e.stopPropagation();
      selectTool(slice.dataset.tool);
      closeHUD();
    });
  });

  // =========================================================================
  // 4. FLOATING SLIDERS & CONTROLS
  // =========================================================================
  const sizeSlider = document.getElementById('size-slider');
  const opacitySlider = document.getElementById('opacity-slider');
  const colorPicker = document.getElementById('brush-color-picker');
  const sizeVal = document.getElementById('size-val');
  const opacityVal = document.getElementById('opacity-val');

  sizeSlider.addEventListener('input', (e) => {
    state.size = parseInt(e.target.value, 10);
    sizeVal.textContent = state.size;
    updateTipPreview();
    updateHUDReadout(state.tool);
  });

  opacitySlider.addEventListener('input', (e) => {
    state.opacity = parseInt(e.target.value, 10) / 100;
    opacityVal.textContent = `${e.target.value}%`;
    updateHUDReadout(state.tool);
  });

  colorPicker.addEventListener('input', (e) => {
    state.color = e.target.value;
    updateTipPreview();
  });

  // =========================================================================
  // 5. 2D ANIMATION ENGINE & ONION SKINNING
  // =========================================================================
  const animDock = document.getElementById('animation-dock');
  const frameStrip = document.getElementById('frame-strip');
  const playBtn = document.getElementById('anim-play-btn');
  const addFrameBtn = document.getElementById('anim-add-frame');
  const dupFrameBtn = document.getElementById('anim-dup-frame');
  const delFrameBtn = document.getElementById('anim-del-frame');
  const onionSkinToggle = document.getElementById('onion-skin-toggle');
  const fpsSelect = document.getElementById('fps-select');
  const dockCloseBtn = document.getElementById('dock-close-btn');

  let playTimer = null;

  function toggleAnimationDock() {
    animDock.classList.toggle('collapsed');
    renderFrameStrip();
  }

  dockCloseBtn.addEventListener('click', () => {
    animDock.classList.add('collapsed');
  });

  function saveFrameSnapshot() {
    const dataUrl = drawingCanvas.toDataURL();
    if (animationFrames.length === 0) {
      animationFrames.push(dataUrl);
    } else {
      animationFrames[state.currentFrameIndex] = dataUrl;
    }
    renderFrameStrip();
    renderOnionSkin();
  }

  function restoreCurrentFrame() {
    const dataUrl = animationFrames[state.currentFrameIndex];
    drawCtx.clearRect(0, 0, width, height);

    if (dataUrl) {
      const img = new Image();
      img.onload = () => {
        drawCtx.drawImage(img, 0, 0, width, height);
        renderOnionSkin();
      };
      img.src = dataUrl;
    } else {
      renderOnionSkin();
    }
  }

  function renderOnionSkin() {
    onionCtx.clearRect(0, 0, width, height);
    if (!state.onionSkin || state.currentFrameIndex === 0) return;

    const prevUrl = animationFrames[state.currentFrameIndex - 1];
    if (prevUrl) {
      const img = new Image();
      img.onload = () => {
        onionCtx.drawImage(img, 0, 0, width, height);
      };
      img.src = prevUrl;
    }
  }

  function renderFrameStrip() {
    frameStrip.innerHTML = '';
    animationFrames.forEach((frame, idx) => {
      const cell = document.createElement('div');
      cell.className = `frame-cell ${idx === state.currentFrameIndex ? 'active' : ''}`;
      cell.innerHTML = `
        <span class="frame-num">${String(idx + 1).padStart(2, '0')}</span>
      `;
      cell.addEventListener('click', () => {
        saveFrameSnapshot();
        state.currentFrameIndex = idx;
        restoreCurrentFrame();
        renderFrameStrip();
      });
      frameStrip.appendChild(cell);
    });
  }

  addFrameBtn.addEventListener('click', () => {
    saveFrameSnapshot();
    drawCtx.clearRect(0, 0, width, height);
    const emptyUrl = drawingCanvas.toDataURL();
    animationFrames.push(emptyUrl);
    state.currentFrameIndex = animationFrames.length - 1;
    renderFrameStrip();
    renderOnionSkin();
  });

  dupFrameBtn.addEventListener('click', () => {
    saveFrameSnapshot();
    const current = animationFrames[state.currentFrameIndex];
    if (current) {
      animationFrames.splice(state.currentFrameIndex + 1, 0, current);
      state.currentFrameIndex++;
      restoreCurrentFrame();
      renderFrameStrip();
    }
  });

  delFrameBtn.addEventListener('click', () => {
    if (animationFrames.length <= 1) {
      drawCtx.clearRect(0, 0, width, height);
      saveFrameSnapshot();
      return;
    }
    animationFrames.splice(state.currentFrameIndex, 1);
    state.currentFrameIndex = Math.max(0, state.currentFrameIndex - 1);
    restoreCurrentFrame();
    renderFrameStrip();
  });

  onionSkinToggle.addEventListener('change', (e) => {
    state.onionSkin = e.target.checked;
    renderOnionSkin();
  });

  fpsSelect.addEventListener('change', (e) => {
    state.fps = parseInt(e.target.value, 10);
    if (state.isPlaying) {
      stopPlayback();
      startPlayback();
    }
  });

  playBtn.addEventListener('click', () => {
    if (state.isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  });

  function startPlayback() {
    if (animationFrames.length <= 1) return;
    state.isPlaying = true;
    playBtn.textContent = '⏹ STOP';
    playBtn.style.background = '#FF4757';

    playTimer = setInterval(() => {
      state.currentFrameIndex = (state.currentFrameIndex + 1) % animationFrames.length;
      restoreCurrentFrame();
      renderFrameStrip();
    }, 1000 / state.fps);
  }

  function stopPlayback() {
    state.isPlaying = false;
    clearInterval(playTimer);
    playBtn.textContent = '▶ PLAY';
    playBtn.style.background = '#2ED573';
  }

  // =========================================================================
  // 6. TYPOGRAPHY SWITCHER & THEME LAB
  // =========================================================================
  const fontToggleBtn = document.getElementById('font-toggle-btn');
  const fontLabel = document.getElementById('font-label');
  const themeBtn = document.getElementById('theme-btn');
  const themeDrawer = document.getElementById('theme-drawer');
  const closeThemeBtn = document.getElementById('close-theme-btn');
  const glowToggleBtn = document.getElementById('glow-toggle-btn');
  const gridToggleBtn = document.getElementById('grid-toggle-btn');
  const swatches = document.querySelectorAll('.swatch-btn');
  const slidersDock = document.getElementById('floating-sliders');

  // Font Toggle (Helvetica <-> Retro Pixel)
  fontToggleBtn.addEventListener('click', () => {
    if (state.font === 'helvetica') {
      state.font = 'retro';
      document.documentElement.setAttribute('data-font', 'retro');
      fontLabel.textContent = 'FONT: 8-BIT ARCADE';
    } else {
      state.font = 'helvetica';
      document.documentElement.setAttribute('data-font', 'helvetica');
      fontLabel.textContent = 'FONT: HELVETICA';
    }
  });

  // Theme Drawer Toggle
  themeBtn.addEventListener('click', () => {
    themeDrawer.classList.toggle('hidden');
  });
  closeThemeBtn.addEventListener('click', () => {
    themeDrawer.classList.add('hidden');
  });

  // Glow Toggle
  glowToggleBtn.addEventListener('click', () => {
    state.glow = !state.glow;
    document.documentElement.setAttribute('data-glow', state.glow ? 'on' : 'off');
    glowToggleBtn.textContent = state.glow ? 'GLOW: ON' : 'GLOW: OFF';
    glowToggleBtn.classList.toggle('active', state.glow);
  });

  // Palette Swatches
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const themeColor = swatch.dataset.color;
      state.theme = themeColor;
      document.documentElement.setAttribute('data-theme', themeColor);
    });
  });

  // Grid Background Toggle
  gridToggleBtn.addEventListener('click', () => {
    state.grid = !state.grid;
    document.body.classList.toggle('grid-active', state.grid);
    gridToggleBtn.textContent = state.grid ? 'GRID: ON' : 'GRID: OFF';
  });

  // Workspace Mode Switcher Tabs
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;

      if (state.mode === 'zen') {
        animDock.classList.add('collapsed');
        slidersDock.classList.add('hidden');
      } else if (state.mode === 'studio') {
        animDock.classList.add('collapsed');
        slidersDock.classList.remove('hidden');
      } else if (state.mode === 'anim') {
        animDock.classList.remove('collapsed');
        slidersDock.classList.remove('hidden');
        renderFrameStrip();
      }
    });
  });

  // Clear Canvas Button
  document.getElementById('clear-btn').addEventListener('click', () => {
    if (confirm('Clear current canvas frame?')) {
      drawCtx.clearRect(0, 0, width, height);
      saveFrameSnapshot();
    }
  });

  // Initialize UI Elements
  selectTool('pencil');
  updateTipPreview();
  renderFrameStrip();
  console.log('⚡ ArcadeFlow 2D Engine Initialized (v1.1 Robust Edition).');
});
