/**
 * ARCADEFLOW 2D - INTERACTIVE PROTOTYPE ENGINE
 * Combines fluid Procreate-style drawing feel with a gaming-inspired radial HUD.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. CANVAS ENGINE & SETUP
  // =========================================================================
  const viewport = document.getElementById('viewport');
  const drawingCanvas = document.getElementById('drawing-canvas');
  const onionCanvas = document.getElementById('onion-canvas');
  const drawCtx = drawingCanvas.getContext('2d');
  const onionCtx = onionCanvas.getContext('2d');

  let width = 0;
  let height = 0;
  let isDrawing = false;
  let points = [];
  let undoStack = [];
  let redoStack = [];

  // Active Tool State
  const state = {
    tool: 'pencil',          // 'pencil', 'ink', 'eraser', 'charcoal', 'paint', 'smudge'
    size: 12,
    opacity: 0.85,
    color: '#111111',
    mode: 'zen',             // 'zen', 'studio', 'anim'
    font: 'helvetica',       // 'helvetica', 'retro'
    theme: 'cyber-pink',
    glow: true,
    grid: false,
    onionSkin: true,
    fps: 12,
    isPlaying: false,
    currentFrameIndex: 0
  };

  // 2D Animation Frames Storage (Canvas ImageData)
  let animationFrames = [];

  function resizeCanvas() {
    width = viewport.clientWidth;
    height = viewport.clientHeight;

    const dpr = window.devicePixelRatio || 1;
    drawingCanvas.width = width * dpr;
    drawingCanvas.height = height * dpr;
    onionCanvas.width = width * dpr;
    onionCanvas.height = height * dpr;

    drawCtx.scale(dpr, dpr);
    onionCtx.scale(dpr, dpr);

    // Initial background fill
    if (animationFrames.length === 0) {
      saveFrameSnapshot();
    } else {
      restoreCurrentFrame();
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // =========================================================================
  // 2. SMOOTH STROKE RENDERING ("DIGITAL BUTTER" BEZIER SMOOTHING)
  // =========================================================================

  function getPointerPos(e) {
    const rect = drawingCanvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure && e.pressure > 0 ? e.pressure : 0.5
    };
  }

  drawingCanvas.addEventListener('pointerdown', (e) => {
    if (hudOpen) return;
    isDrawing = true;
    drawingCanvas.setPointerCapture(e.pointerId);

    const pos = getPointerPos(e);
    points = [pos];

    drawPoint(pos);
  });

  drawingCanvas.addEventListener('pointermove', (e) => {
    if (!isDrawing || hudOpen) return;
    const pos = getPointerPos(e);
    points.push(pos);

    if (points.length >= 3) {
      drawSmoothStroke();
    }
  });

  drawingCanvas.addEventListener('pointerup', (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    points = [];
    saveFrameSnapshot();
  });

  drawingCanvas.addEventListener('pointercancel', () => {
    isDrawing = false;
    points = [];
  });

  function drawPoint(p) {
    drawCtx.save();
    applyBrushSettings(p.pressure);

    drawCtx.beginPath();
    drawCtx.arc(p.x, p.y, (state.size * p.pressure) / 2, 0, Math.PI * 2);
    drawCtx.fill();
    drawCtx.restore();
  }

  function drawSmoothStroke() {
    drawCtx.save();
    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];
    const midPoint = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
      pressure: (p1.pressure + p2.pressure) / 2
    };

    applyBrushSettings(midPoint.pressure);

    drawCtx.beginPath();
    drawCtx.moveTo(points[points.length - 3].x, points[points.length - 3].y);
    drawCtx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
    drawCtx.stroke();

    drawCtx.restore();
  }

  function applyBrushSettings(pressure) {
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    drawCtx.lineWidth = Math.max(1, state.size * (0.4 + pressure * 0.8));

    if (state.tool === 'eraser') {
      drawCtx.globalCompositeOperation = 'destination-out';
      drawCtx.strokeStyle = 'rgba(0,0,0,1)';
      drawCtx.fillStyle = 'rgba(0,0,0,1)';
    } else {
      drawCtx.globalCompositeOperation = 'source-over';
      drawCtx.strokeStyle = state.color;
      drawCtx.fillStyle = state.color;

      // Tool Texture Variations
      if (state.tool === 'pencil') {
        drawCtx.globalAlpha = state.opacity * 0.65 * (0.3 + pressure * 0.7);
      } else if (state.tool === 'ink') {
        drawCtx.globalAlpha = state.opacity;
        drawCtx.lineWidth = state.size * (0.2 + pressure * 1.2);
      } else if (state.tool === 'charcoal') {
        drawCtx.globalAlpha = state.opacity * 0.5;
        drawCtx.shadowBlur = 4;
        drawCtx.shadowColor = state.color;
      } else if (state.tool === 'paint') {
        drawCtx.globalAlpha = state.opacity * 0.85;
      } else if (state.tool === 'smudge') {
        drawCtx.globalAlpha = 0.25;
        drawCtx.filter = 'blur(2px)';
      }
    }
  }

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

  let hudOpen = false;
  let hudCenter = { x: 0, y: 0 };
  let currentHoveredTool = state.tool;

  function openHUD(x, y) {
    hudOpen = true;
    hudCenter = { x, y };

    // Prevent spawning outside viewport boundaries
    const padding = 170;
    const clampedX = Math.max(padding, Math.min(width - padding, x));
    const clampedY = Math.max(padding, Math.min(height - padding, y));

    hud.style.left = `${clampedX}px`;
    hud.style.top = `${clampedY}px`;
    hud.classList.remove('hidden');

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
    centerTipPreview.style.width = `${Math.min(36, Math.max(6, state.size))}px`;
    centerTipPreview.style.height = `${Math.min(36, Math.max(6, state.size))}px`;
    centerTipPreview.style.background = state.tool === 'eraser' ? '#FFFFFF' : state.color;
  }

  // Keyboard Trigger: Hold Spacebar to Bloom HUD
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !hudOpen && !e.repeat) {
      e.preventDefault();
      openHUD(lastMousePos.x, lastMousePos.y);
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && hudOpen) {
      e.preventDefault();
      closeHUD();
    }
  });

  // Mouse Tracking for Cursor-Centric Spawning
  let lastMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  window.addEventListener('mousemove', (e) => {
    lastMousePos = { x: e.clientX, y: e.clientY };

    if (hudOpen) {
      // Calculate angle from HUD center to cursor
      const dx = e.clientX - hudCenter.x;
      const dy = e.clientY - hudCenter.y;
      const distance = Math.hypot(dx, dy);

      // Deadzone check (25px radius)
      if (distance > 25) {
        let deg = Math.atan2(dy, dx) * (180 / Math.PI);
        if (deg < 0) deg += 360;

        hudReticle.style.transform = `rotate(${deg + 90}deg)`;

        // Find closest slice
        let closestSlice = null;
        let minDiff = Infinity;

        hudSlices.forEach(slice => {
          const sliceAngle = parseInt(slice.dataset.angle, 10);
          let diff = Math.abs(deg - sliceAngle);
          if (diff > 180) diff = 360 - diff;

          if (diff < minDiff) {
            minDiff = diff;
            closestSlice = slice;
          }
        });

        if (closestSlice && closestSlice.dataset.tool !== currentHoveredTool) {
          currentHoveredTool = closestSlice.dataset.tool;
          hudSlices.forEach(s => s.classList.toggle('active', s === closestSlice));
          updateHUDReadout(currentHoveredTool);
        }
      }
    }
  });

  // Touch / Mobile Summon Button
  hudSummonBtn.addEventListener('click', () => {
    if (!hudOpen) {
      openHUD(window.innerWidth / 2, window.innerHeight / 2);
    } else {
      closeHUD();
    }
  });

  // Direct Click on Slices
  hudSlices.forEach(slice => {
    slice.addEventListener('click', () => {
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
  // 5. 2D FRAME-BY-FRAME ANIMATION SYSTEM
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
    const imgData = drawCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
    if (animationFrames.length === 0) {
      animationFrames.push(imgData);
    } else {
      animationFrames[state.currentFrameIndex] = imgData;
    }
    renderFrameStrip();
    renderOnionSkin();
  }

  function restoreCurrentFrame() {
    if (animationFrames[state.currentFrameIndex]) {
      drawCtx.putImageData(animationFrames[state.currentFrameIndex], 0, 0);
    } else {
      drawCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    }
    renderOnionSkin();
  }

  function renderOnionSkin() {
    onionCtx.clearRect(0, 0, onionCanvas.width, onionCanvas.height);
    if (!state.onionSkin || state.currentFrameIndex === 0) return;

    // Ghost the previous frame
    const prevFrame = animationFrames[state.currentFrameIndex - 1];
    if (prevFrame) {
      onionCtx.putImageData(prevFrame, 0, 0);
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
    drawCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    const newEmptyFrame = drawCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
    animationFrames.push(newEmptyFrame);
    state.currentFrameIndex = animationFrames.length - 1;
    renderFrameStrip();
    renderOnionSkin();
  });

  dupFrameBtn.addEventListener('click', () => {
    saveFrameSnapshot();
    const currentFrame = animationFrames[state.currentFrameIndex];
    if (currentFrame) {
      animationFrames.splice(state.currentFrameIndex + 1, 0, currentFrame);
      state.currentFrameIndex++;
      restoreCurrentFrame();
      renderFrameStrip();
    }
  });

  delFrameBtn.addEventListener('click', () => {
    if (animationFrames.length <= 1) {
      drawCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
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
  // 6. DUAL TYPOGRAPHY SWITCHER & THEME LAB
  // =========================================================================
  const fontToggleBtn = document.getElementById('font-toggle-btn');
  const fontLabel = document.getElementById('font-label');
  const themeBtn = document.getElementById('theme-btn');
  const themeDrawer = document.getElementById('theme-drawer');
  const closeThemeBtn = document.getElementById('close-theme-btn');
  const glowToggleBtn = document.getElementById('glow-toggle-btn');
  const gridToggleBtn = document.getElementById('grid-toggle-btn');
  const swatches = document.querySelectorAll('.swatch-btn');

  // Font Toggle (Helvetica <-> Retro 8-Bit)
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

  // Mode Switcher Buttons
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;

      if (state.mode === 'zen') {
        animDock.classList.add('collapsed');
        document.getElementById('floating-sliders').style.display = 'none';
      } else if (state.mode === 'studio') {
        animDock.classList.add('collapsed');
        document.getElementById('floating-sliders').style.display = 'flex';
      } else if (state.mode === 'anim') {
        animDock.classList.remove('collapsed');
        document.getElementById('floating-sliders').style.display = 'flex';
        renderFrameStrip();
      }
    });
  });

  // Clear Canvas Button
  document.getElementById('clear-btn').addEventListener('click', () => {
    if (confirm('Clear current canvas frame?')) {
      drawCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
      saveFrameSnapshot();
    }
  });

  // Undo / Redo
  document.getElementById('undo-btn').addEventListener('click', () => {
    // Basic single-step undo
    if (animationFrames.length > 0) {
      drawCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    }
  });

  // Initialize
  updateTipPreview();
  renderFrameStrip();
  console.log('⚡ ArcadeFlow 2D Engine Initialized.');
});
