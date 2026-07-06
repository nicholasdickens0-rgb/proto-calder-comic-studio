const canvas = document.getElementById("pageCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  imageInput: document.getElementById("imageInput"),
  projectInput: document.getElementById("projectInput"),
  loadSampleBtn: document.getElementById("loadSampleBtn"),
  undoBtn: document.getElementById("undoBtn"),
  redoBtn: document.getElementById("redoBtn"),
  saveProjectBtn: document.getElementById("saveProjectBtn"),
  exportBtn: document.getElementById("exportBtn"),
  addBalloonBtn: document.getElementById("addBalloonBtn"),
  addSafeBtn: document.getElementById("addSafeBtn"),
  addPanelBtn: document.getElementById("addPanelBtn"),
  detectPanelsBtn: document.getElementById("detectPanelsBtn"),
  deleteBtn: document.getElementById("deleteBtn"),
  critiqueBtn: document.getElementById("critiqueBtn"),
  splitDialogueBtn: document.getElementById("splitDialogueBtn"),
  createBalloonsBtn: document.getElementById("createBalloonsBtn"),
  autoPlaceBtn: document.getElementById("autoPlaceBtn"),
  applyPlanBtn: document.getElementById("applyPlanBtn"),
  assistantInput: document.getElementById("assistantInput"),
  assistantToneInput: document.getElementById("assistantToneInput"),
  assistantStatus: document.getElementById("assistantStatus"),
  assistantStatusText: document.getElementById("assistantStatusText"),
  assistantOutput: document.getElementById("assistantOutput"),
  zoomRange: document.getElementById("zoomRange"),
  showSafeToggle: document.getElementById("showSafeToggle"),
  showPanelToggle: document.getElementById("showPanelToggle"),
  showWarningsToggle: document.getElementById("showWarningsToggle"),
  tools: Array.from(document.querySelectorAll(".tool")),
  pageInfo: document.getElementById("pageInfo"),
  statusText: document.getElementById("statusText"),
  emptyInspector: document.getElementById("emptyInspector"),
  inspector: document.getElementById("inspector"),
  textInput: document.getElementById("textInput"),
  labelInput: document.getElementById("labelInput"),
  xInput: document.getElementById("xInput"),
  yInput: document.getElementById("yInput"),
  wInput: document.getElementById("wInput"),
  hInput: document.getElementById("hInput"),
  fontSizeInput: document.getElementById("fontSizeInput"),
  paddingInput: document.getElementById("paddingInput"),
  radiusInput: document.getElementById("radiusInput"),
  strokeInput: document.getElementById("strokeInput"),
  styleInput: document.getElementById("styleInput"),
  fillInput: document.getElementById("fillInput"),
  strokeColorInput: document.getElementById("strokeColorInput"),
  textColorInput: document.getElementById("textColorInput"),
  tailToggle: document.getElementById("tailToggle"),
  tailWidthInput: document.getElementById("tailWidthInput"),
  wobbleInput: document.getElementById("wobbleInput"),
  textureInput: document.getElementById("textureInput"),
  glowInput: document.getElementById("glowInput"),
  bubblePresetButtons: Array.from(document.querySelectorAll("[data-bubble-preset]")),
  notesInput: document.getElementById("notesInput"),
  checkList: document.getElementById("checkList")
};

const state = {
  title: "Untitled page",
  imageName: "",
  imageDataUrl: "",
  image: null,
  zoom: 0.75,
  tool: "select",
  selected: null,
  drag: null,
  notes: "",
  balloons: [],
  safeZones: [],
  panels: [],
  assistant: {
    beats: [],
    busy: false
  },
  history: {
    undo: [],
    redo: [],
    limit: 80,
    pendingInspector: false,
    pendingNotes: false,
    restoring: false
  },
  options: {
    showSafe: true,
    showPanels: true,
    showWarnings: true
  }
};

const sampleCandidates = [
  "../outputs/Calder_Remnants_Page_007_full_color_v1_lettering_first.png",
  "/outputs/Calder_Remnants_Page_007_full_color_v1_lettering_first.png",
  "./sample-pages/Calder_Remnants_Page_007_full_color_v1_lettering_first.png"
];

const balloonDefaults = {
  style: "rounded",
  preset: "classic",
  fill: "#fffdf4",
  strokeColor: "#171717",
  textColor: "#171717",
  hasTail: true,
  tailWidth: 20,
  wobble: 0,
  texture: 0,
  glow: 0,
  fillOpacity: 1
};

const bubblePresets = {
  classic: {
    style: "oval",
    fill: "#fffdf4",
    strokeColor: "#171717",
    textColor: "#171717",
    radius: 36,
    stroke: 3,
    padding: 20,
    hasTail: true,
    tailWidth: 20,
    wobble: 0,
    texture: 8,
    glow: 0,
    fillOpacity: 1
  },
  manga: {
    style: "manga",
    fill: "#fffdf7",
    strokeColor: "#111111",
    textColor: "#111111",
    radius: 38,
    stroke: 3,
    padding: 20,
    hasTail: true,
    tailWidth: 18,
    wobble: 13,
    texture: 14,
    glow: 0,
    fillOpacity: 1
  },
  whisper: {
    style: "whisper",
    fill: "#ffffff",
    strokeColor: "#585858",
    textColor: "#2b2b2b",
    radius: 36,
    stroke: 2,
    padding: 20,
    hasTail: true,
    tailWidth: 12,
    wobble: 4,
    texture: 3,
    glow: 0,
    fillOpacity: 0.92
  },
  shout: {
    style: "shout",
    fill: "#fff8df",
    strokeColor: "#111111",
    textColor: "#111111",
    radius: 8,
    stroke: 4,
    padding: 22,
    hasTail: true,
    tailWidth: 26,
    wobble: 16,
    texture: 8,
    glow: 0,
    fillOpacity: 1
  },
  thought: {
    style: "thought",
    fill: "#fffdf8",
    strokeColor: "#161616",
    textColor: "#161616",
    radius: 42,
    stroke: 3,
    padding: 22,
    hasTail: true,
    tailWidth: 18,
    wobble: 8,
    texture: 10,
    glow: 0,
    fillOpacity: 1
  },
  caption: {
    style: "caption",
    fill: "#f8eed2",
    strokeColor: "#2b2115",
    textColor: "#241b12",
    radius: 8,
    stroke: 2,
    padding: 16,
    hasTail: false,
    tailWidth: 4,
    wobble: 0,
    texture: 18,
    glow: 0,
    fillOpacity: 0.98
  },
  sfx: {
    style: "sfx",
    fill: "#ffffff",
    strokeColor: "#05070d",
    textColor: "#ffe88d",
    radius: 0,
    stroke: 8,
    padding: 2,
    hasTail: false,
    tailWidth: 4,
    wobble: 18,
    texture: 0,
    glow: 24,
    fillOpacity: 0
  },
  magic: {
    style: "magic",
    fill: "#eefbff",
    strokeColor: "#2b7f9e",
    textColor: "#143443",
    radius: 42,
    stroke: 3,
    padding: 22,
    hasTail: true,
    tailWidth: 18,
    wobble: 6,
    texture: 6,
    glow: 28,
    fillOpacity: 0.9
  }
};

function id(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function setStatus(text) {
  ui.statusText.textContent = text;
}

function assistantButtons() {
  return [ui.critiqueBtn, ui.splitDialogueBtn, ui.createBalloonsBtn, ui.autoPlaceBtn, ui.applyPlanBtn, ui.detectPanelsBtn];
}

function setAssistantState(message, mode = "idle") {
  ui.assistantStatusText.textContent = message;
  ui.assistantStatus.classList.toggle("busy", mode === "busy");
  ui.assistantStatus.classList.toggle("error", mode === "error");
}

function setAssistantBusy(isBusy, message = "") {
  state.assistant.busy = isBusy;
  assistantButtons().forEach((button) => {
    button.disabled = isBusy;
  });
  if (message) setAssistantState(message, isBusy ? "busy" : "idle");
}

function assistantWorkingCard(title, body) {
  assistantCards([{ title, body }]);
}

function runAssistantAction(label, work, doneMessage) {
  if (state.assistant.busy) return;
  setAssistantBusy(true, `${label}...`);
  assistantWorkingCard(label, "Working through the page data now.");
  setStatus(`${label}...`);

  window.setTimeout(() => {
    try {
      const result = work() || {};
      const message = typeof result === "string"
        ? result
        : result.message || doneMessage || `${label} complete`;
      setAssistantBusy(false);
      setAssistantState(message, result.warn ? "error" : "idle");
      setStatus(message);
    } catch (error) {
      setAssistantBusy(false);
      setAssistantState("Assistant stopped. Check the pasted text and try again.", "error");
      assistantCards([{
        title: "Assistant Error",
        body: error && error.message ? error.message : "Something interrupted the assistant action.",
        warn: true
      }]);
      setStatus("Assistant error");
    }
  }, 40);
}

function snapshotData() {
  return {
    title: state.title,
    imageName: state.imageName,
    imageDataUrl: state.imageDataUrl,
    notes: state.notes,
    selected: state.selected ? { ...state.selected } : null,
    balloons: state.balloons.map((balloon) => ({ ...normalizeBalloon(balloon) })),
    safeZones: state.safeZones.map((safe) => ({ ...safe })),
    panels: state.panels.map((panel) => ({ ...panel }))
  };
}

function createSnapshot() {
  return JSON.stringify(snapshotData());
}

function updateHistoryControls() {
  ui.undoBtn.disabled = state.history.undo.length === 0;
  ui.redoBtn.disabled = state.history.redo.length === 0;
}

function pushHistorySnapshot(snapshot, skipIfUnchanged = false) {
  if (state.history.restoring || !snapshot) return;
  const last = state.history.undo[state.history.undo.length - 1];
  if ((skipIfUnchanged && snapshot === createSnapshot()) || snapshot === last) return;
  state.history.undo.push(snapshot);
  if (state.history.undo.length > state.history.limit) state.history.undo.shift();
  state.history.redo = [];
  updateHistoryControls();
}

function pushHistory() {
  pushHistorySnapshot(createSnapshot());
}

function finishHistoryRestore(message) {
  if (state.selected && !selectedObject()) state.selected = null;
  ui.notesInput.value = state.notes;
  updateCanvasSize();
  syncInspector();
  render();
  updateChecks();
  updateHistoryControls();
  state.history.restoring = false;
  state.history.pendingInspector = false;
  state.history.pendingNotes = false;
  setStatus(message);
}

function restoreSnapshot(snapshot, message) {
  state.history.restoring = true;
  const data = JSON.parse(snapshot);
  state.title = data.title || "Untitled page";
  state.imageName = data.imageName || "";
  state.imageDataUrl = data.imageDataUrl || "";
  state.notes = data.notes || "";
  state.balloons = (data.balloons || []).map(normalizeBalloon);
  state.safeZones = data.safeZones || [];
  state.panels = data.panels || [];
  state.selected = data.selected || null;

  if (!state.imageDataUrl) {
    state.image = null;
    finishHistoryRestore(message);
    return;
  }

  const img = new Image();
  img.onload = () => {
    state.image = img;
    finishHistoryRestore(message);
  };
  img.onerror = () => {
    state.image = null;
    finishHistoryRestore(message);
  };
  img.src = state.imageDataUrl;
}

function undo() {
  if (!state.history.undo.length) return;
  state.history.redo.push(createSnapshot());
  const snapshot = state.history.undo.pop();
  restoreSnapshot(snapshot, "Undo");
}

function redo() {
  if (!state.history.redo.length) return;
  state.history.undo.push(createSnapshot());
  const snapshot = state.history.redo.pop();
  restoreSnapshot(snapshot, "Redo");
}

function pageRect() {
  if (state.image) return { w: state.image.naturalWidth, h: state.image.naturalHeight };
  return { w: 900, h: 1300 };
}

function updateCanvasSize() {
  const rect = pageRect();
  canvas.width = Math.round(rect.w * state.zoom);
  canvas.height = Math.round(rect.h * state.zoom);
  ui.pageInfo.textContent = state.image
    ? `${state.title} - ${rect.w} x ${rect.h}`
    : "No page loaded";
}

function toScreen(v) {
  return v * state.zoom;
}

function fromScreen(v) {
  return v / state.zoom;
}

function pointerToPage(event) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: fromScreen(event.clientX - bounds.left),
    y: fromScreen(event.clientY - bounds.top)
  };
}

function normalizeRect(rect) {
  if (rect.w < 0) {
    rect.x += rect.w;
    rect.w = Math.abs(rect.w);
  }
  if (rect.h < 0) {
    rect.y += rect.h;
    rect.h = Math.abs(rect.h);
  }
  return rect;
}

function roundedRectPath(context, x, y, w, h, radius) {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + w - r, y);
  context.quadraticCurveTo(x + w, y, x + w, y + r);
  context.lineTo(x + w, y + h - r);
  context.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  context.lineTo(x + r, y + h);
  context.quadraticCurveTo(x, y + h, x, y + h - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeBalloon(balloon) {
  Object.assign(balloon, {
    ...balloonDefaults,
    ...balloon
  });
  balloon.style = balloon.style || "rounded";
  balloon.preset = balloon.preset || "";
  balloon.tailWidth = Number.isFinite(Number(balloon.tailWidth)) ? Number(balloon.tailWidth) : balloonDefaults.tailWidth;
  balloon.wobble = Number.isFinite(Number(balloon.wobble)) ? Number(balloon.wobble) : balloonDefaults.wobble;
  balloon.texture = Number.isFinite(Number(balloon.texture)) ? Number(balloon.texture) : balloonDefaults.texture;
  balloon.glow = Number.isFinite(Number(balloon.glow)) ? Number(balloon.glow) : balloonDefaults.glow;
  balloon.fillOpacity = Number.isFinite(Number(balloon.fillOpacity)) ? Number(balloon.fillOpacity) : balloonDefaults.fillOpacity;
  return balloon;
}

function hexToRgba(hex, alpha) {
  const fallback = `rgba(255, 253, 244, ${alpha})`;
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return fallback;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function seedFromId(value) {
  let seed = 0;
  for (let i = 0; i < value.length; i += 1) {
    seed = (seed * 31 + value.charCodeAt(i)) % 9973;
  }
  return seed;
}

function ellipsePath(context, x, y, w, h) {
  context.beginPath();
  context.ellipse(x + w / 2, y + h / 2, Math.max(1, w / 2), Math.max(1, h / 2), 0, 0, Math.PI * 2);
  context.closePath();
}

function organicEllipsePath(context, x, y, w, h, wobble, seed) {
  const steps = 34;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rx = Math.max(1, w / 2);
  const ry = Math.max(1, h / 2);
  context.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const a = (Math.PI * 2 * i) / steps;
    const wave = Math.sin(a * 3 + seed) * 0.55 + Math.sin(a * 7 + seed * 0.37) * 0.45;
    const offset = wave * wobble;
    const px = cx + Math.cos(a) * (rx + offset);
    const py = cy + Math.sin(a) * (ry + offset * 0.7);
    if (i === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
}

function burstPath(context, x, y, w, h, wobble, seed) {
  const points = 26;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rx = Math.max(1, w / 2);
  const ry = Math.max(1, h / 2);
  context.beginPath();
  for (let i = 0; i < points; i += 1) {
    const a = (Math.PI * 2 * i) / points - Math.PI / 2;
    const spike = i % 2 === 0 ? 1.09 : 0.78;
    const wave = Math.sin(i * 1.7 + seed) * wobble * 0.01;
    const px = cx + Math.cos(a) * rx * (spike + wave);
    const py = cy + Math.sin(a) * ry * (spike + wave);
    if (i === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
}

function bubbleBodyPath(context, balloon, x, y, w, h, radius, scale) {
  const style = balloon.style || "rounded";
  const wobble = (Number(balloon.wobble) || 0) * scale;
  const seed = seedFromId(balloon.id || style);

  if (style === "oval" || style === "whisper" || style === "magic") {
    if (wobble > 0) organicEllipsePath(context, x, y, w, h, wobble, seed);
    else ellipsePath(context, x, y, w, h);
    return;
  }

  if (style === "manga" || style === "thought") {
    organicEllipsePath(context, x, y, w, h, Math.max(5 * scale, wobble), seed);
    return;
  }

  if (style === "shout") {
    burstPath(context, x, y, w, h, Math.max(8 * scale, wobble), seed);
    return;
  }

  roundedRectPath(context, x, y, w, h, radius);
}

function nearestTailAnchor(x, y, w, h, tailX, tailY) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const dx = tailX - cx;
  const dy = tailY - cy;
  if (Math.abs(dx) > Math.abs(dy)) {
    return {
      x: dx < 0 ? x : x + w,
      y: clamp(tailY, y + h * 0.22, y + h * 0.78)
    };
  }
  return {
    x: clamp(tailX, x + w * 0.18, x + w * 0.82),
    y: dy < 0 ? y : y + h
  };
}

function drawTriangleTail(context, balloon, x, y, w, h, tailX, tailY, scale) {
  if (!balloon.hasTail) return;
  const anchor = nearestTailAnchor(x, y, w, h, tailX, tailY);
  const width = Math.max(4, Number(balloon.tailWidth) || 18) * scale;
  const horizontal = anchor.x === x || anchor.x === x + w;
  context.beginPath();
  if (horizontal) {
    context.moveTo(anchor.x, anchor.y - width / 2);
    context.lineTo(tailX, tailY);
    context.lineTo(anchor.x, anchor.y + width / 2);
  } else {
    context.moveTo(anchor.x - width / 2, anchor.y);
    context.lineTo(tailX, tailY);
    context.lineTo(anchor.x + width / 2, anchor.y);
  }
  context.closePath();
}

function drawThoughtTail(context, balloon, x, y, w, h, tailX, tailY, scale) {
  if (!balloon.hasTail) return;
  const anchor = nearestTailAnchor(x, y, w, h, tailX, tailY);
  const sizes = [12, 8, 5].map((size) => size * scale);
  context.beginPath();
  for (let i = 0; i < sizes.length; i += 1) {
    const t = (i + 1) / (sizes.length + 1);
    const px = anchor.x + (tailX - anchor.x) * t;
    const py = anchor.y + (tailY - anchor.y) * t;
    context.moveTo(px + sizes[i], py);
    context.arc(px, py, sizes[i], 0, Math.PI * 2);
  }
}

function drawTexture(context, balloon, x, y, w, h, scale) {
  const strength = clamp(Number(balloon.texture) || 0, 0, 100);
  if (!strength) return;

  const spacing = Math.max(8, 18 * scale);
  context.save();
  context.globalAlpha = strength / 520;
  context.strokeStyle = balloon.strokeColor || "#171717";
  context.lineWidth = Math.max(0.5, scale);
  for (let yy = y + spacing / 2; yy < y + h; yy += spacing) {
    context.beginPath();
    context.moveTo(x + 8 * scale, yy);
    context.lineTo(x + w - 8 * scale, yy + Math.sin(yy * 0.05) * 2 * scale);
    context.stroke();
  }
  context.restore();
}

function wrapText(context, text, maxWidth) {
  const lines = [];
  for (const rawLine of text.split("\n")) {
    const words = rawLine.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      continue;
    }
    let current = words[0];
    for (const word of words.slice(1)) {
      const trial = `${current} ${word}`;
      if (context.measureText(trial).width <= maxWidth) {
        current = trial;
      } else {
        lines.push(current);
        current = word;
      }
    }
    lines.push(current);
  }
  return lines;
}

function fitBalloonText(context, balloon) {
  let size = balloon.fontSize;
  let lines = [];
  const maxW = Math.max(20, balloon.w - balloon.padding * 2);
  const maxH = Math.max(20, balloon.h - balloon.padding * 2);

  while (size >= 12) {
    context.font = `700 ${size}px "Comic Sans MS", "Segoe UI", sans-serif`;
    lines = wrapText(context, balloon.text, maxW);
    const lineHeight = size * 1.22;
    if (lines.length * lineHeight <= maxH) {
      return { size, lines, lineHeight };
    }
    size -= 1;
  }

  context.font = `700 12px "Comic Sans MS", "Segoe UI", sans-serif`;
  return { size: 12, lines: wrapText(context, balloon.text, maxW), lineHeight: 14.5 };
}

function sfxBurstPath(context, x, y, w, h, seed) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const points = 18;
  const outerX = w / 2;
  const outerY = h / 2;
  const innerX = outerX * 0.72;
  const innerY = outerY * 0.62;
  context.beginPath();
  for (let i = 0; i < points; i += 1) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / points;
    const jag = 0.88 + (((seed + i * 37) % 29) / 100);
    const radiusX = (i % 2 === 0 ? outerX : innerX) * jag;
    const radiusY = (i % 2 === 0 ? outerY : innerY) * jag;
    const px = cx + Math.cos(angle) * radiusX;
    const py = cy + Math.sin(angle) * radiusY;
    if (i === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
}

function drawSfxCracks(context, x, y, w, h, seed, scale) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const arms = [
    [-0.48, -0.25, -0.72, -0.46, -0.9, -0.39],
    [0.42, -0.2, 0.68, -0.38, 0.9, -0.3],
    [-0.22, 0.36, -0.42, 0.58, -0.58, 0.5],
    [0.24, 0.34, 0.42, 0.58, 0.64, 0.52]
  ];
  context.save();
  context.strokeStyle = "rgba(255, 244, 190, 0.72)";
  context.lineWidth = Math.max(1.2, 1.8 * scale);
  context.lineCap = "round";
  for (const [x1, y1, x2, y2, x3, y3] of arms) {
    const jitter = ((seed % 11) - 5) * 0.003;
    context.beginPath();
    context.moveTo(cx + w * x1, cy + h * y1);
    context.lineTo(cx + w * (x2 + jitter), cy + h * y2);
    context.lineTo(cx + w * x3, cy + h * (y3 - jitter));
    context.stroke();
    seed += 17;
  }
  context.restore();
}

function drawSfxText(context, balloon, scale = 1, selected = false, exportMode = false) {
  const x = balloon.x * scale;
  const y = balloon.y * scale;
  const w = balloon.w * scale;
  const h = balloon.h * scale;
  const sfxFontSize = Math.max(balloon.fontSize * scale, Math.min(h * 0.78, w * 0.36));
  const working = {
    ...balloon,
    x,
    y,
    w,
    h,
    padding: balloon.padding * scale,
    fontSize: sfxFontSize
  };
  const fit = fitBalloonText(context, working);
  const seed = seedFromId(balloon.id || balloon.text || "sfx");
  const wobble = Math.max(Number(balloon.wobble) || 0, 10);
  const burstPadX = (12 + wobble * 0.45) * scale;
  const burstPadY = (6 + wobble * 0.28) * scale;

  context.save();
  context.shadowColor = "transparent";
  context.shadowBlur = 0;
  sfxBurstPath(context, x - burstPadX, y - burstPadY, w + burstPadX * 2, h + burstPadY * 2, seed);
  context.fillStyle = "rgba(255, 234, 132, 0.24)";
  context.strokeStyle = "rgba(8, 10, 16, 0.82)";
  context.lineWidth = Math.max(2.5, 3.5 * scale);
  context.fill();
  context.stroke();
  drawSfxCracks(context, x - burstPadX, y - burstPadY, w + burstPadX * 2, h + burstPadY * 2, seed, scale);

  context.translate(x + w / 2, y + h / 2);
  context.rotate((((seed % 9) - 4) * Math.PI) / 240);
  context.translate(-(x + w / 2), -(y + h / 2));
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.lineJoin = "round";
  context.lineCap = "round";
  context.font = `900 ${fit.size}px "Impact", "Arial Black", "Segoe UI", sans-serif`;
  const totalH = fit.lines.length * fit.lineHeight;
  context.strokeStyle = balloon.strokeColor || "#111111";
  context.lineWidth = Math.max(3, balloon.stroke * scale);
  if (balloon.glow > 0) {
    context.shadowColor = "rgba(255, 238, 160, 0.65)";
    context.shadowBlur = Number(balloon.glow) * scale;
  }

  let lineY = y + h / 2 - totalH / 2 + fit.lineHeight / 2;
  for (const line of fit.lines) {
    context.strokeText(line, x + w / 2, lineY);
    lineY += fit.lineHeight;
  }
  context.shadowColor = "transparent";
  context.shadowBlur = 0;
  context.strokeStyle = "#f8d574";
  context.lineWidth = Math.max(2, (balloon.stroke * 0.38) * scale);
  lineY = y + h / 2 - totalH / 2 + fit.lineHeight / 2;
  for (const line of fit.lines) {
    context.strokeText(line, x + w / 2, lineY);
    lineY += fit.lineHeight;
  }
  context.fillStyle = balloon.textColor || "#fff4d0";
  if (balloon.glow > 0) {
    context.shadowColor = "rgba(255, 238, 160, 0.45)";
    context.shadowBlur = Number(balloon.glow) * 0.6 * scale;
  }
  lineY = y + h / 2 - totalH / 2 + fit.lineHeight / 2;
  for (const line of fit.lines) {
    context.fillText(line, x + w / 2, lineY);
    lineY += fit.lineHeight;
  }

  if (selected && !exportMode) drawSelection(context, balloon, scale, "#2f6f67");
  context.restore();
}

function drawBalloon(context, balloon, scale = 1, selected = false, exportMode = false) {
  normalizeBalloon(balloon);
  if (balloon.style === "sfx") {
    drawSfxText(context, balloon, scale, selected, exportMode);
    return;
  }
  const x = balloon.x * scale;
  const y = balloon.y * scale;
  const w = balloon.w * scale;
  const h = balloon.h * scale;
  const tailX = balloon.tailX * scale;
  const tailY = balloon.tailY * scale;
  const stroke = balloon.stroke * scale;
  const radius = balloon.radius * scale;
  const style = balloon.style || "rounded";
  const fillAlpha = clamp(Number(balloon.fillOpacity) || 1, 0.2, 1);

  context.save();
  context.lineJoin = "round";
  context.lineCap = "round";
  context.fillStyle = hexToRgba(balloon.fill, fillAlpha);
  context.strokeStyle = balloon.strokeColor;
  context.lineWidth = Math.max(1.5, stroke);
  if (style === "whisper") context.setLineDash([7 * scale, 7 * scale]);
  if (style === "magic" && balloon.glow > 0) {
    context.shadowColor = "rgba(91, 188, 224, 0.72)";
    context.shadowBlur = Number(balloon.glow) * scale;
  }

  if (balloon.hasTail && style !== "caption") {
    if (style === "thought") drawThoughtTail(context, balloon, x, y, w, h, tailX, tailY, scale);
    else drawTriangleTail(context, balloon, x, y, w, h, tailX, tailY, scale);
    context.fill();
    context.stroke();
  }

  bubbleBodyPath(context, balloon, x, y, w, h, radius, scale);
  context.fill();
  context.save();
  bubbleBodyPath(context, balloon, x, y, w, h, radius, scale);
  context.clip();
  drawTexture(context, balloon, x, y, w, h, scale);
  context.restore();
  context.stroke();
  context.setLineDash([]);
  context.shadowBlur = 0;

  const working = {
    ...balloon,
    x,
    y,
    w,
    h,
    padding: balloon.padding * scale,
    fontSize: balloon.fontSize * scale
  };
  const fit = fitBalloonText(context, working);
  context.font = `700 ${fit.size}px "Comic Sans MS", "Segoe UI", sans-serif`;
  context.fillStyle = balloon.textColor;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const totalH = fit.lines.length * fit.lineHeight;
  let lineY = y + h / 2 - totalH / 2 + fit.lineHeight / 2;
  for (const line of fit.lines) {
    context.fillText(line, x + w / 2, lineY);
    lineY += fit.lineHeight;
  }

  if (selected && !exportMode) {
    drawSelection(context, balloon, scale, "#2f6f67");
    if (balloon.hasTail && style !== "caption") {
      context.fillStyle = "#2f6f67";
      context.beginPath();
      context.arc(tailX, tailY, 6, 0, Math.PI * 2);
      context.fill();
    }
  }

  context.restore();
}

function drawSelection(context, rect, scale, color) {
  const x = rect.x * scale;
  const y = rect.y * scale;
  const w = rect.w * scale;
  const h = rect.h * scale;
  context.save();
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.setLineDash([6, 4]);
  context.strokeRect(x, y, w, h);
  context.setLineDash([]);
  const handles = getHandles(rect);
  context.fillStyle = color;
  for (const handle of handles) {
    context.fillRect(handle.x * scale - 5, handle.y * scale - 5, 10, 10);
  }
  context.restore();
}

function drawRectObject(context, item, scale, kind, selected = false) {
  const x = item.x * scale;
  const y = item.y * scale;
  const w = item.w * scale;
  const h = item.h * scale;
  context.save();
  if (kind === "safe") {
    context.fillStyle = "rgba(255, 162, 62, 0.24)";
    context.strokeStyle = "rgba(177, 100, 18, 0.95)";
  } else {
    context.fillStyle = "rgba(39, 114, 171, 0.16)";
    context.strokeStyle = "rgba(39, 114, 171, 0.9)";
  }
  context.lineWidth = 2;
  context.fillRect(x, y, w, h);
  context.strokeRect(x, y, w, h);
  context.fillStyle = kind === "safe" ? "#8a5417" : "#1f6186";
  context.font = `700 ${Math.max(12, 13 * scale)}px "Segoe UI", sans-serif`;
  context.fillText(item.label || (kind === "safe" ? "Protected" : "Panel"), x + 8, y + 18);
  if (selected) drawSelection(context, item, scale, kind === "safe" ? "#b16412" : "#2772ab");
  context.restore();
}

function render(exportMode = false, targetCanvas = canvas) {
  const context = targetCanvas.getContext("2d");
  const scale = exportMode ? 1 : state.zoom;
  const rect = pageRect();

  context.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, rect.w * scale, rect.h * scale);

  if (state.image) {
    context.drawImage(state.image, 0, 0, rect.w * scale, rect.h * scale);
  } else {
    context.fillStyle = "#f7f4ec";
    context.fillRect(0, 0, rect.w * scale, rect.h * scale);
    context.fillStyle = "#7a7d76";
    context.font = `${22 * scale}px "Segoe UI", sans-serif`;
    context.textAlign = "center";
    context.fillText("Import a clean page image to begin", (rect.w * scale) / 2, (rect.h * scale) / 2);
  }

  if (!exportMode && state.options.showPanels) {
    for (const panel of state.panels) {
      drawRectObject(context, panel, scale, "panel", isSelected("panel", panel.id));
    }
  }

  if (!exportMode && state.options.showSafe) {
    for (const safe of state.safeZones) {
      drawRectObject(context, safe, scale, "safe", isSelected("safe", safe.id));
    }
  }

  for (const balloon of state.balloons) {
    drawBalloon(context, balloon, scale, isSelected("balloon", balloon.id), exportMode);
  }

  if (!exportMode && state.options.showWarnings) {
    drawWarnings(context, scale);
  }
}

function isSelected(type, objectId) {
  return state.selected && state.selected.type === type && state.selected.id === objectId;
}

function selectedObject() {
  if (!state.selected) return null;
  const list = getList(state.selected.type);
  return list.find((item) => item.id === state.selected.id) || null;
}

function getList(type) {
  if (type === "balloon") return state.balloons;
  if (type === "safe") return state.safeZones;
  return state.panels;
}

function getHandles(rect) {
  return [
    { name: "nw", x: rect.x, y: rect.y },
    { name: "ne", x: rect.x + rect.w, y: rect.y },
    { name: "sw", x: rect.x, y: rect.y + rect.h },
    { name: "se", x: rect.x + rect.w, y: rect.y + rect.h }
  ];
}

function hitHandle(rect, point) {
  for (const handle of getHandles(rect)) {
    if (Math.abs(point.x - handle.x) <= 10 && Math.abs(point.y - handle.y) <= 10) {
      return handle.name;
    }
  }
  return null;
}

function hitTail(balloon, point) {
  if (!balloon.hasTail || balloon.style === "caption") return false;
  return Math.hypot(point.x - balloon.tailX, point.y - balloon.tailY) <= 12;
}

function contains(rect, point) {
  return point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;
}

function hitTest(point) {
  for (let i = state.balloons.length - 1; i >= 0; i -= 1) {
    const balloon = state.balloons[i];
    if (hitTail(balloon, point)) return { type: "balloon", id: balloon.id, part: "tail" };
    const handle = hitHandle(balloon, point);
    if (handle) return { type: "balloon", id: balloon.id, part: handle };
    if (contains(balloon, point)) return { type: "balloon", id: balloon.id, part: "move" };
  }
  for (let i = state.safeZones.length - 1; i >= 0; i -= 1) {
    const safe = state.safeZones[i];
    const handle = hitHandle(safe, point);
    if (handle) return { type: "safe", id: safe.id, part: handle };
    if (contains(safe, point)) return { type: "safe", id: safe.id, part: "move" };
  }
  for (let i = state.panels.length - 1; i >= 0; i -= 1) {
    const panel = state.panels[i];
    const handle = hitHandle(panel, point);
    if (handle) return { type: "panel", id: panel.id, part: handle };
    if (contains(panel, point)) return { type: "panel", id: panel.id, part: "move" };
  }
  return null;
}

function addBalloon(recordHistory = true) {
  if (recordHistory) pushHistory();
  const rect = pageRect();
  const balloon = normalizeBalloon({
    id: id("balloon"),
    x: Math.round(rect.w * 0.52),
    y: Math.round(rect.h * 0.08),
    w: 270,
    h: 92,
    text: "New dialogue.",
    fontSize: 24,
    padding: 18,
    radius: 28,
    stroke: 3,
    fill: "#fffdf4",
    strokeColor: "#171717",
    textColor: "#171717",
    hasTail: true,
    tailX: Math.round(rect.w * 0.58),
    tailY: Math.round(rect.h * 0.22)
  });
  applyBubblePreset(balloon, "classic", false);
  state.balloons.push(balloon);
  select("balloon", balloon.id);
  render();
  updateChecks();
}

function applyBubblePreset(balloon, presetName, rerender = true) {
  const preset = bubblePresets[presetName];
  if (!preset) return;
  if (rerender) pushHistory();
  Object.assign(balloon, preset);
  balloon.preset = presetName;
  if (preset.style === "caption") balloon.hasTail = false;
  normalizeBalloon(balloon);
  if (rerender) {
    syncInspector();
    render();
    updateChecks();
    setStatus(`Applied ${presetName} bubble preset`);
  }
}

function addSafeZone() {
  pushHistory();
  const rect = pageRect();
  const safe = {
    id: id("safe"),
    label: "Face / hand / baby",
    x: Math.round(rect.w * 0.18),
    y: Math.round(rect.h * 0.2),
    w: 190,
    h: 150
  };
  state.safeZones.push(safe);
  select("safe", safe.id);
  render();
  updateChecks();
}

function addPanelGuide() {
  pushHistory();
  const rect = pageRect();
  const panel = {
    id: id("panel"),
    label: "Panel guide",
    x: 12,
    y: Math.round(rect.h * 0.08),
    w: rect.w - 24,
    h: Math.round(rect.h * 0.18)
  };
  state.panels.push(panel);
  select("panel", panel.id);
  render();
}

function select(type, objectId) {
  state.selected = type && objectId ? { type, id: objectId } : null;
  syncInspector();
}

function syncInspector() {
  const obj = selectedObject();
  ui.emptyInspector.classList.toggle("hidden", Boolean(obj));
  ui.inspector.classList.toggle("hidden", !obj);
  if (!obj) return;

  ui.inspector.querySelectorAll("[data-for]").forEach((el) => {
    el.classList.toggle("hidden", el.dataset.for !== state.selected.type);
  });

  ui.xInput.value = Math.round(obj.x);
  ui.yInput.value = Math.round(obj.y);
  ui.wInput.value = Math.round(obj.w);
  ui.hInput.value = Math.round(obj.h);

  if (state.selected.type === "balloon") {
    normalizeBalloon(obj);
    ui.textInput.value = obj.text;
    ui.fontSizeInput.value = obj.fontSize;
    ui.paddingInput.value = obj.padding;
    ui.radiusInput.value = obj.radius;
    ui.strokeInput.value = obj.stroke;
    ui.styleInput.value = obj.style;
    ui.fillInput.value = obj.fill;
    ui.strokeColorInput.value = obj.strokeColor;
    ui.textColorInput.value = obj.textColor;
    ui.tailToggle.checked = Boolean(obj.hasTail);
    ui.tailWidthInput.value = obj.tailWidth;
    ui.wobbleInput.value = obj.wobble;
    ui.textureInput.value = obj.texture;
    ui.glowInput.value = obj.glow;
    ui.bubblePresetButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.bubblePreset === obj.preset);
    });
  }

  if (state.selected.type === "safe") {
    ui.labelInput.value = obj.label || "";
  }
}

function applyInspectorChange() {
  const obj = selectedObject();
  if (!obj) return;
  if (state.selected.type === "panel") obj.generatedByAssistant = false;
  obj.x = Number(ui.xInput.value) || 0;
  obj.y = Number(ui.yInput.value) || 0;
  obj.w = Math.max(12, Number(ui.wInput.value) || 12);
  obj.h = Math.max(12, Number(ui.hInput.value) || 12);

  if (state.selected.type === "balloon") {
    obj.text = ui.textInput.value;
    obj.fontSize = Math.max(10, Number(ui.fontSizeInput.value) || 24);
    obj.padding = Math.max(4, Number(ui.paddingInput.value) || 18);
    obj.radius = Math.max(0, Number(ui.radiusInput.value) || 28);
    obj.stroke = Math.max(1, Number(ui.strokeInput.value) || 3);
    obj.style = ui.styleInput.value || "rounded";
    obj.fill = ui.fillInput.value || "#fffdf4";
    obj.strokeColor = ui.strokeColorInput.value || "#171717";
    obj.textColor = ui.textColorInput.value || "#171717";
    obj.hasTail = ui.tailToggle.checked && obj.style !== "caption";
    ui.tailToggle.checked = obj.hasTail;
    obj.tailWidth = Math.max(0, Number(ui.tailWidthInput.value) || 0);
    obj.wobble = Math.max(0, Number(ui.wobbleInput.value) || 0);
    obj.texture = Math.max(0, Number(ui.textureInput.value) || 0);
    obj.glow = Math.max(0, Number(ui.glowInput.value) || 0);
    obj.preset = "";
    ui.bubblePresetButtons.forEach((button) => button.classList.remove("active"));
  }

  if (state.selected.type === "safe") {
    obj.label = ui.labelInput.value;
  }

  render();
  updateChecks();
}

function deleteSelected() {
  if (!state.selected) return;
  const list = getList(state.selected.type);
  const index = list.findIndex((item) => item.id === state.selected.id);
  if (index >= 0) pushHistory();
  if (index >= 0) list.splice(index, 1);
  select(null, null);
  render();
  updateChecks();
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function overlapArea(a, b) {
  const x = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const y = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  return x * y;
}

function overlapWarnings() {
  const warnings = [];
  for (const balloon of state.balloons) {
    for (const safe of state.safeZones) {
      if (rectsOverlap(balloon, safe)) {
        warnings.push({ balloon, safe });
      }
    }
  }
  return warnings;
}

function drawWarnings(context, scale) {
  const warnings = overlapWarnings();
  context.save();
  context.strokeStyle = "#c98122";
  context.lineWidth = 3;
  context.setLineDash([7, 5]);
  for (const warning of warnings) {
    const b = warning.balloon;
    context.strokeRect(b.x * scale, b.y * scale, b.w * scale, b.h * scale);
  }
  context.restore();
}

function updateChecks() {
  const warnings = overlapWarnings();
  ui.checkList.innerHTML = "";

  const good = document.createElement("div");
  good.className = `check-item ${warnings.length ? "warn" : ""}`;
  good.innerHTML = warnings.length
    ? `<strong>${warnings.length} overlap warning${warnings.length === 1 ? "" : "s"}</strong><span>Move balloons away from protected art zones.</span>`
    : "<strong>No protected-zone overlaps</strong><span>Faces, hands, and key acting are clear.</span>";
  ui.checkList.appendChild(good);

  const density = document.createElement("div");
  density.className = "check-item";
  density.innerHTML = `<strong>${state.balloons.length} balloon${state.balloons.length === 1 ? "" : "s"}</strong><span>${state.safeZones.length} protected zone${state.safeZones.length === 1 ? "" : "s"}, ${state.panels.length} panel guide${state.panels.length === 1 ? "" : "s"}.</span>`;
  ui.checkList.appendChild(density);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wordCount(text) {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}

function assistantCards(cards) {
  ui.assistantOutput.innerHTML = "";
  for (const card of cards) {
    const el = document.createElement("div");
    el.className = `assistant-card ${card.warn ? "warn" : ""}`;
    el.innerHTML = `<strong>${escapeHtml(card.title)}</strong><small>${escapeHtml(card.body)}</small>`;
    ui.assistantOutput.appendChild(el);
  }
}

function pageCritique() {
  const cards = [];
  const warnings = overlapWarnings();
  const totalWords = state.balloons.reduce((sum, balloon) => sum + wordCount(balloon.text), 0);
  const longBalloons = state.balloons.filter((balloon) => wordCount(balloon.text) > 22);

  if (!state.image) {
    cards.push({ title: "Load Art", body: "Import the clean page image before final lettering.", warn: true });
  }
  if (!state.safeZones.length) {
    cards.push({ title: "Protect Acting", body: "Mark faces, hands, babies, runes, and key action before placing dialogue.", warn: true });
  }
  if (warnings.length) {
    cards.push({ title: "Clear The Art", body: `${warnings.length} balloon overlap protected art. Move or auto-place those balloons.`, warn: true });
  }
  if (longBalloons.length) {
    cards.push({ title: "Split Heavy Lines", body: `${longBalloons.length} balloon has more than 22 words. Split it into smaller beats for better pacing.`, warn: true });
  }
  if (!state.panels.length) {
    cards.push({ title: "Panel Guides", body: "Add panel guides when a page has several beats; the assistant can place balloons more intelligently inside them." });
  }
  if (state.balloons.length && totalWords / state.balloons.length < 5) {
    cards.push({ title: "Sparse Dialogue", body: "The page has short lines. This may read cinematic; make sure the acting carries the emotion." });
  }
  if (state.balloons.length >= 6) {
    cards.push({ title: "Reading Load", body: "This page has many balloons. Check that the eye path stays top-left to bottom-right." });
  }
  if (!cards.length) {
    cards.push({ title: "Page Looks Ready", body: "No obvious lettering issues. Try exporting a PNG and reviewing it full-screen." });
  }

  assistantCards(cards);
  setStatus("Assistant critique ready");
  return { message: "Critique ready" };
}

function splitDialogue(text) {
  const cleaned = (text || "").replace(/\r/g, "").trim();
  if (!cleaned) return [];
  const lineBeats = cleaned
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const rawBeats = [];

  for (const line of lineBeats) {
    const parts = line.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [line];
    for (const part of parts) {
      const beat = part.trim();
      if (beat) rawBeats.push(beat);
    }
  }

  const beats = [];
  for (const beat of rawBeats) {
    const words = beat.split(/\s+/);
    if (words.length <= 18) {
      beats.push(beat);
      continue;
    }
    for (let i = 0; i < words.length; i += 14) {
      beats.push(words.slice(i, i + 14).join(" "));
    }
  }
  return beats.slice(0, 12);
}

function assistantSplitDialogue() {
  const selected = selectedObject();
  const source = ui.assistantInput.value || (selected && selected.text) || "";
  state.assistant.beats = splitDialogue(source);
  if (!state.assistant.beats.length) {
    assistantCards([{ title: "No Dialogue", body: "Paste dialogue or select a balloon with text first.", warn: true }]);
    return { message: "No dialogue found", warn: true };
  }
  assistantCards(state.assistant.beats.map((beat, index) => ({
    title: `Beat ${index + 1}`,
    body: beat
  })));
  setStatus(`${state.assistant.beats.length} dialogue beat${state.assistant.beats.length === 1 ? "" : "s"} split`);
  return {
    message: `${state.assistant.beats.length} dialogue beat${state.assistant.beats.length === 1 ? "" : "s"} split`
  };
}

function toneForText(text) {
  const requested = ui.assistantToneInput.value;
  if (requested && requested !== "auto") return requested;
  const value = text.trim();
  if (/rune|glow|magic|light|divine|vision/i.test(value)) return "magic";
  if (/^(sfx|kra|boom|crack|snap|thoom|wham|clang|krak|kra-koom)/i.test(value)) return "sfx";
  if (/^\(.+\)$/.test(value) || /\.{2,}|whisper|hush|soft/i.test(value)) return "whisper";
  if (/[!]{1,}|^[A-Z0-9\s,'"-]{8,}$/.test(value)) return "shout";
  if (/thought|wondered|remembered|maybe|if only/i.test(value)) return "thought";
  if (/^(caption|narration|meanwhile|later|before|after)\b/i.test(value)) return "caption";
  return "classic";
}

function makeBalloon(text, index = 0, total = 1) {
  const rect = pageRect();
  const width = clamp(Math.round(rect.w * 0.3), 230, 360);
  const balloon = normalizeBalloon({
    id: id("balloon"),
    x: Math.round(rect.w * 0.5 - width / 2),
    y: Math.round(rect.h * (0.08 + index / Math.max(1, total) * 0.72)),
    w: width,
    h: clamp(72 + wordCount(text) * 3, 78, 150),
    text,
    fontSize: 24,
    padding: 18,
    radius: 28,
    stroke: 3,
    fill: "#fffdf4",
    strokeColor: "#171717",
    textColor: "#171717",
    hasTail: true,
    tailX: Math.round(rect.w * 0.52),
    tailY: Math.round(rect.h * 0.2)
  });
  applyBubblePreset(balloon, toneForText(text), false);
  return balloon;
}

function placementRegions() {
  const rect = pageRect();
  if (state.panels.length) {
    return state.panels
      .slice()
      .sort((a, b) => a.y - b.y || a.x - b.x)
      .map((panel) => ({
        x: panel.x + 12,
        y: panel.y + 12,
        w: Math.max(40, panel.w - 24),
        h: Math.max(40, panel.h - 24)
      }));
  }
  return [
    { x: rect.w * 0.04, y: rect.h * 0.05, w: rect.w * 0.92, h: rect.h * 0.24 },
    { x: rect.w * 0.04, y: rect.h * 0.36, w: rect.w * 0.92, h: rect.h * 0.24 },
    { x: rect.w * 0.04, y: rect.h * 0.67, w: rect.w * 0.92, h: rect.h * 0.25 }
  ];
}

function candidatePlacements(balloon, index, total) {
  const rect = pageRect();
  const regions = placementRegions();
  const desiredIndex = Math.min(regions.length - 1, Math.floor(index / Math.max(1, total) * regions.length));
  const candidates = [];

  for (let regionIndex = 0; regionIndex < regions.length; regionIndex += 1) {
    const region = regions[regionIndex];
    const xs = [region.x, region.x + (region.w - balloon.w) / 2, region.x + region.w - balloon.w];
    const ys = [region.y, region.y + (region.h - balloon.h) / 2, region.y + region.h - balloon.h];
    for (const x of xs) {
      for (const y of ys) {
        candidates.push({
          x: clamp(Math.round(x), 12, rect.w - balloon.w - 12),
          y: clamp(Math.round(y), 12, rect.h - balloon.h - 12),
          desiredPenalty: Math.abs(regionIndex - desiredIndex) * 600
        });
      }
    }
  }
  return candidates;
}

function placementScore(candidate, balloon, ignoreId = "") {
  const rect = pageRect();
  const test = { ...balloon, x: candidate.x, y: candidate.y };
  let score = candidate.desiredPenalty || 0;
  for (const safe of state.safeZones) score += overlapArea(test, safe) * 16;
  for (const other of state.balloons) {
    if (other.id !== ignoreId) score += overlapArea(test, other) * 8;
  }
  const margin = Math.min(test.x, test.y, rect.w - test.x - test.w, rect.h - test.y - test.h);
  if (margin < 24) score += (24 - margin) * 30;
  return score;
}

function placeBalloonSmart(balloon, index = 0, total = 1, ignoreId = balloon.id) {
  const candidates = candidatePlacements(balloon, index, total);
  if (!candidates.length) return false;
  const best = candidates
    .map((candidate) => ({ ...candidate, score: placementScore(candidate, balloon, ignoreId) }))
    .sort((a, b) => a.score - b.score)[0];
  balloon.x = best.x;
  balloon.y = best.y;
  if (balloon.hasTail) {
    balloon.tailX = best.x + balloon.w / 2;
    balloon.tailY = best.y + balloon.h + 44;
  }
  return true;
}

function cleanPlanText(text) {
  return (text || "")
    .trim()
    .replace(/^["\u201c\u201d]+|["\u201c\u201d]+$/g, "")
    .replace(/^None$/i, "")
    .trim();
}

function cleanPlanLine(line) {
  return (line || "")
    .trim()
    .replace(/^["\u201c\u201d]+/, "")
    .replace(/["\u201c\u201d]+$/, "")
    .trim();
}

function parseLetteringCell(lettering) {
  const value = cleanPlanText(lettering);
  let type = "";
  if (/sfx/i.test(value)) type = "SFX";
  else if (/caption/i.test(value)) type = "Caption";
  else if (/dark\s+balloon/i.test(value)) type = "Dark balloon";
  else if (/balloons/i.test(value)) type = "Balloons";
  else if (/balloon/i.test(value)) type = "Balloon";
  else type = value;

  let placement = "";
  if (value.includes(",")) {
    placement = value.split(",").slice(1).join(",").trim();
  } else {
    placement = value
      .replace(/dark\s+balloon|balloons?|caption|sfx|only/gi, "")
      .replace(/^[,\s-]+|[,\s-]+$/g, "")
      .trim();
  }
  return { type, placement };
}

function parsePlanCells(cells) {
  if (cells.length < 3) return null;
  const panel = Number.parseInt(cells[0], 10);
  let type = cells[1] || "";
  let planText = "";
  let placement = "";

  if (cells.length === 3) {
    const lettering = parseLetteringCell(cells[1] || "");
    type = lettering.type;
    placement = lettering.placement;
    planText = cleanPlanText(cells[2] || "");
  } else {
    planText = cleanPlanText(cells[2] || "");
    placement = cells.slice(3).join(" ").trim();
  }

  if (!Number.isFinite(panel) || !planText || /^none$/i.test(type)) return null;
  return { panel, type, text: planText, placement };
}

function splitRenderedPlanBody(type, body) {
  const trimmed = body.trim();
  const quoted = trimmed.match(/^["\u201c]([^"\u201d]+)["\u201d]\s+(.+)$/);
  if (quoted) return [quoted[1], quoted[2]];
  if (/sfx/i.test(type)) {
    const parts = trimmed.split(/\s+/);
    return [parts[0] || "", parts.slice(1).join(" ")];
  }
  const placement = trimmed.match(/\s((?:upper|lower|right|left|center|over|near|tail|tails|no lettering).*)$/i);
  if (placement) {
    return [trimmed.slice(0, placement.index).trim(), placement[1].trim()];
  }
  return [trimmed, ""];
}

function parseRenderedPlanLine(line) {
  const match = line.match(/^(\d+)\s+(.+)$/);
  if (!match) return null;
  const panel = Number.parseInt(match[1], 10);
  const body = match[2].trim();
  const typeMatch = body.match(/^((?:Dark\s+balloon|Balloons?|Balloon|Caption|None)(?:,[^"\u201c]+)?|SFX\s+only|SFX(?:,[^"\u201c]+)?|Small\s+.+?\s+balloon)\s+(.+)$/i);
  if (!typeMatch) return null;

  const lettering = parseLetteringCell(typeMatch[1]);
  const type = lettering.type;
  let planText = "";
  let placement = lettering.placement;
  if (placement) {
    planText = cleanPlanText(typeMatch[2]);
  } else {
    [planText, placement] = splitRenderedPlanBody(type, typeMatch[2]);
  }
  if (!Number.isFinite(panel) || !cleanPlanText(planText) || /^none$/i.test(type)) return null;
  return { panel, type, text: cleanPlanText(planText), placement };
}

function parseLetteringPlan(text) {
  const rows = [];
  const lines = (text || "").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = cleanPlanLine(line);
    if (!trimmed) continue;
    if (/^\|?\s*-+/.test(trimmed) || /^panel\s+/i.test(trimmed) || /panel\s*\|\s*(type|lettering)/i.test(trimmed)) continue;

    if (trimmed.includes("|")) {
      const cells = trimmed
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim());
      const row = parsePlanCells(cells);
      if (row) rows.push(row);
      continue;
    }

    if (trimmed.includes("\t")) {
      const row = parsePlanCells(trimmed.split(/\t+/).map((cell) => cell.trim()));
      if (row) rows.push(row);
      continue;
    }

    const rendered = parseRenderedPlanLine(trimmed);
    if (rendered) rows.push(rendered);
  }
  return rows;
}

function inferredPanelWeights(panelCount) {
  const presets = {
    3: [0.31, 0.39, 0.3],
    4: [0.29, 0.3, 0.22, 0.19],
    5: [0.255, 0.265, 0.205, 0.18, 0.095]
  };
  const weights = presets[panelCount] || Array.from({ length: panelCount }, () => 1);
  const total = weights.reduce((sum, value) => sum + value, 0) || 1;
  return weights.map((value) => value / total);
}

function legacyInferredPanelRect(panelNumber, panelCount) {
  const rect = pageRect();
  const gutters = 8;
  const panelH = (rect.h - gutters * (panelCount - 1)) / panelCount;
  return {
    x: 0,
    y: Math.round((panelNumber - 1) * (panelH + gutters)),
    w: rect.w,
    h: Math.round(panelH)
  };
}

function inferredPanelRect(panelNumber, panelCount) {
  const rect = pageRect();
  const gutters = panelCount >= 4 ? 10 : 8;
  const weights = inferredPanelWeights(panelCount);
  const usableH = rect.h - gutters * (panelCount - 1);
  let y = 0;
  for (let index = 0; index < panelNumber - 1; index += 1) {
    y += usableH * weights[index] + gutters;
  }
  return {
    x: 0,
    y: Math.round(y),
    w: rect.w,
    h: Math.round(usableH * weights[panelNumber - 1])
  };
}

function mergeRowGroups(groups, maxGap) {
  if (!groups.length) return [];
  const merged = [{ ...groups[0] }];
  for (const group of groups.slice(1)) {
    const last = merged[merged.length - 1];
    if (group.start - last.end <= maxGap) {
      last.end = group.end;
      last.height = last.end - last.start + 1;
      last.score = Math.max(last.score || 0, group.score || 0);
    } else {
      merged.push({ ...group });
    }
  }
  return merged;
}

function scoreRowGroup(group, rowScores) {
  let total = 0;
  let count = 0;
  for (let y = group.start; y <= group.end; y += 1) {
    total += rowScores[y] || 0;
    count += 1;
  }
  const average = count ? total / count : 0;
  const heightBoost = Math.min(0.18, group.height * 0.018);
  return average + heightBoost;
}

function panelRowsFromGutters(gutters, panelCount, minPanelH) {
  let workingGutters = gutters.slice();

  function rowsFromWorkingGutters() {
    const rows = [];
    for (let index = 0; index < workingGutters.length - 1; index += 1) {
      const top = workingGutters[index].end + 1;
      const bottom = workingGutters[index + 1].start - 1;
      const height = bottom - top + 1;
      if (height >= minPanelH) {
        rows.push({
          top,
          bottom,
          height,
          beforeGutter: index,
          afterGutter: index + 1
        });
      }
    }
    return rows;
  }

  let rows = rowsFromWorkingGutters();
  while (rows.length > panelCount && workingGutters.length > 2) {
    let weakestIndex = -1;
    let weakestScore = Infinity;
    for (let index = 1; index < workingGutters.length - 1; index += 1) {
      const gutter = workingGutters[index];
      if (gutter.score < weakestScore) {
        weakestScore = gutter.score;
        weakestIndex = index;
      }
    }
    if (weakestIndex < 0) break;
    workingGutters.splice(weakestIndex, 1);
    rows = rowsFromWorkingGutters();
  }

  return rows.length === panelCount ? rows : [];
}

function detectedPanelRectsFromImage(panelCount) {
  const rect = pageRect();
  if (!state.image || panelCount <= 1) return [];

  const maxPixels = 2500000;
  const imagePixels = rect.w * rect.h;
  const imageScale = Math.min(1, Math.sqrt(maxPixels / Math.max(1, imagePixels)));
  const sampleW = Math.max(240, Math.round(rect.w * imageScale));
  const sampleH = Math.max(240, Math.round(rect.h * imageScale));
  const sample = document.createElement("canvas");
  sample.width = sampleW;
  sample.height = sampleH;
  const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
  if (!sampleCtx) return [];

  try {
    sampleCtx.drawImage(state.image, 0, 0, sampleW, sampleH);
  } catch {
    return [];
  }

  let pixels;
  try {
    pixels = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;
  } catch {
    return [];
  }

  const xStart = Math.max(1, Math.floor(sampleW * 0.008));
  const xEnd = Math.min(sampleW - 1, Math.ceil(sampleW * 0.992));
  const xStep = Math.max(1, Math.floor(sampleW / 360));
  const groups = [];
  const rowScores = [];
  let start = -1;
  let end = -1;

  for (let y = 0; y < sampleH; y += 1) {
    let dark = 0;
    let total = 0;
    for (let x = xStart; x < xEnd; x += xStep) {
      const offset = (y * sampleW + x) * 4;
      const brightness = (pixels[offset] + pixels[offset + 1] + pixels[offset + 2]) / 3;
      if (brightness < 30) dark += 1;
      total += 1;
    }

    const darkFraction = total ? dark / total : 0;
    rowScores[y] = darkFraction;
    if (darkFraction >= 0.76) {
      if (start < 0) start = y;
      end = y;
    } else if (start >= 0) {
      const group = { start, end, height: end - start + 1 };
      group.score = scoreRowGroup(group, rowScores);
      groups.push(group);
      start = -1;
      end = -1;
    }
  }
  if (start >= 0) {
    const group = { start, end, height: end - start + 1 };
    group.score = scoreRowGroup(group, rowScores);
    groups.push(group);
  }

  const maxGap = Math.max(1, Math.round(sampleH * 0.0015));
  const minGutterH = Math.max(2, Math.round(sampleH * 0.0025));
  const edgePad = Math.max(4, Math.round(sampleH * 0.012));
  let gutters = mergeRowGroups(groups, maxGap).filter((group) => (
    (group.height >= minGutterH && group.score >= 0.82) ||
    group.start <= edgePad ||
    group.end >= sampleH - edgePad
  ));

  if (!gutters.length || gutters[0].start > edgePad) {
    gutters.unshift({ start: 0, end: 0, height: 1, score: 1 });
  }
  const lastGutter = gutters[gutters.length - 1];
  if (!lastGutter || lastGutter.end < sampleH - edgePad) {
    gutters.push({ start: sampleH - 1, end: sampleH - 1, height: 1, score: 1 });
  }

  const minPanelH = Math.max(24, Math.round(sampleH * 0.055));
  const rows = panelRowsFromGutters(gutters, panelCount, minPanelH);
  if (rows.length !== panelCount) return [];

  const scaleY = rect.h / sampleH;
  return rows.map((row) => {
    const y = Math.round(row.top * scaleY);
    const bottom = Math.round((row.bottom + 1) * scaleY);
    return {
      x: 0,
      y,
      w: rect.w,
      h: Math.max(24, bottom - y),
      detectedFrom: "image-gutters"
    };
  });
}

function looksLikeLegacyPanelGuides(panelCount) {
  if (state.panels.length !== panelCount || panelCount <= 1) return false;
  const rect = pageRect();
  return state.panels
    .slice()
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .every((panel, index) => {
      const legacy = legacyInferredPanelRect(index + 1, panelCount);
      return (
        panel.label === `Panel ${index + 1}` &&
        Math.abs(panel.x - (legacy.x + 6)) <= 3 &&
        Math.abs(panel.y - (legacy.y + 6)) <= 3 &&
        Math.abs(panel.w - (legacy.w - 12)) <= 4 &&
        Math.abs(panel.h - (legacy.h - 12)) <= 4 &&
        Math.abs(panel.w - (rect.w - 12)) <= 4
      );
    });
}

function looksLikeGeneratedPanelGuides(panelCount) {
  const rect = pageRect();
  return (
    state.panels.length === panelCount &&
    state.panels.every((panel, index) => (
      panel.generatedByAssistant !== false &&
      (panel.label || "") === `Panel ${index + 1}` &&
      panel.x <= 18 &&
      Math.abs(panel.w - (rect.w - 12)) <= 10
    ))
  );
}

function createPlanPanelGuides(panelCount) {
  const detectedRects = detectedPanelRectsFromImage(panelCount);
  const method = detectedRects.length === panelCount ? "image-gutters" : "weighted-estimate";
  for (let panel = 1; panel <= panelCount; panel += 1) {
    const rect = detectedRects[panel - 1] || inferredPanelRect(panel, panelCount);
    state.panels.push({
      id: id("panel"),
      label: `Panel ${panel}`,
      generatedByAssistant: true,
      detectionMethod: rect.detectedFrom || method,
      x: rect.x + 6,
      y: rect.y + 6,
      w: rect.w - 12,
      h: rect.h - 12
    });
  }
  return { method, count: panelCount };
}

function ensurePlanPanelGuides(panelCount) {
  if (panelCount <= 1) return { method: "none", count: 0 };
  if (looksLikeLegacyPanelGuides(panelCount) || looksLikeGeneratedPanelGuides(panelCount)) state.panels = [];
  if (state.panels.length) return { method: "manual", count: state.panels.length };
  return createPlanPanelGuides(panelCount);
}

function guessedPanelCount() {
  const rows = parseLetteringPlan(ui.assistantInput.value);
  if (rows.length) return Math.max(...rows.map((row) => row.panel));
  if (state.panels.length) return state.panels.length;
  return 5;
}

function detectPanelGuides() {
  if (!state.image) {
    assistantCards([{ title: "No Page Image", body: "Import a page image before detecting panel guides.", warn: true }]);
    setStatus("Import a page image first");
    return;
  }
  const panelCount = guessedPanelCount();
  pushHistory();
  state.panels = [];
  const result = createPlanPanelGuides(panelCount);
  select("panel", state.panels[0] && state.panels[0].id);
  render();
  updateChecks();
  assistantCards([
    { title: "Panel Guides Rebuilt", body: `${panelCount} panel guide${panelCount === 1 ? "" : "s"} created.` },
    { title: "Detection Method", body: result.method === "image-gutters" ? "Used gutter strength and weak-seam merging from the page art." : "Used weighted estimates because the page gutters were not clear enough." },
    { title: "Next", body: "Apply the lettering plan again after the guides line up with the artwork." }
  ]);
  setStatus("Panel guides detected");
}

function rectForPlanPanel(panelNumber, panelCount) {
  const panels = state.panels.slice().sort((a, b) => a.y - b.y || a.x - b.x);
  if (panels[panelNumber - 1]) return panels[panelNumber - 1];
  return inferredPanelRect(panelNumber, panelCount);
}

function planPreset(type, text) {
  if (/sfx/i.test(type)) return "sfx";
  if (/caption/i.test(type)) return "caption";
  if (/dark/i.test(type)) return "magic";
  return toneForText(text);
}

function rectFromPlacementHint(panelRect, balloon, placement) {
  const hint = (placement || "").toLowerCase();
  let x = panelRect.x + panelRect.w * 0.5 - balloon.w / 2;
  let y = panelRect.y + panelRect.h * 0.5 - balloon.h / 2;
  const hasPlacementCue = /(left|right|center|upper|top|lower|bottom|low-|sky|window|rope|eye|impact|corner)/.test(hint);

  if (!hasPlacementCue && balloon.style === "sfx") {
    x = panelRect.x + panelRect.w * 0.58 - balloon.w / 2;
    y = panelRect.y + panelRect.h * 0.4 - balloon.h / 2;
  } else if (!hasPlacementCue && balloon.style === "caption") {
    x = panelRect.x + panelRect.w - balloon.w - panelRect.w * 0.06;
    y = panelRect.y + panelRect.h * 0.08;
  } else if (!hasPlacementCue && balloon.hasTail) {
    x = panelRect.x + panelRect.w * 0.08;
    y = panelRect.y + panelRect.h * 0.1;
  }

  if (hint.includes("left")) x = panelRect.x + panelRect.w * 0.06;
  if (hint.includes("right")) x = panelRect.x + panelRect.w - balloon.w - panelRect.w * 0.06;
  if (hint.includes("center")) x = panelRect.x + panelRect.w * 0.5 - balloon.w / 2;
  const wantsLower = hint.includes("lower") || hint.includes("bottom") || hint.includes("low-");
  if (hint.includes("upper") || hint.includes("top") || (hint.includes("sky") && !wantsLower)) y = panelRect.y + panelRect.h * 0.08;
  if (hint.includes("lower") || hint.includes("bottom")) y = panelRect.y + panelRect.h - balloon.h - panelRect.h * 0.08;
  if (hint.includes("low-")) y = panelRect.y + panelRect.h - balloon.h - panelRect.h * 0.08;
  if (hint.includes("window")) y = panelRect.y + panelRect.h * 0.22;
  if (hint.includes("rope")) {
    x = panelRect.x + panelRect.w * 0.58 - balloon.w / 2;
    y = panelRect.y + panelRect.h * 0.38 - balloon.h / 2;
  }
  if (hint.includes("eye")) y = panelRect.y + panelRect.h * 0.12;
  if (hint.includes("impact")) {
    x = panelRect.x + panelRect.w * 0.5 - balloon.w / 2;
    y = panelRect.y + panelRect.h * 0.5 - balloon.h / 2;
  }

  return {
    x: clamp(Math.round(x), 12, pageRect().w - balloon.w - 12),
    y: clamp(Math.round(y), 12, pageRect().h - balloon.h - 12)
  };
}

function makePlanBalloon(row, panelCount) {
  const panelRect = rectForPlanPanel(row.panel, panelCount);
  const preset = planPreset(row.type, row.text);
  const isSfx = /sfx/i.test(row.type);
  const isCaption = /caption/i.test(row.type);
  const isQuiet = /small|quiet/i.test(`${row.type} ${row.placement}`);
  const widthBase = isSfx ? 300 : isCaption ? 330 : 240;
  const balloon = normalizeBalloon({
    id: id("balloon"),
    x: panelRect.x + 20,
    y: panelRect.y + 20,
    w: clamp(widthBase + wordCount(row.text) * (isSfx ? 8 : 4), isSfx ? 220 : 140, Math.min(isSfx ? 560 : 390, panelRect.w - 24)),
    h: isSfx ? Math.min(124, panelRect.h - 18) : clamp((isQuiet ? 54 : 64) + wordCount(row.text) * 3, 66, Math.min(140, panelRect.h - 18)),
    text: row.text,
    fontSize: isSfx ? 72 : isQuiet ? 21 : 23,
    padding: isSfx ? 2 : isQuiet ? 14 : 17,
    radius: 26,
    stroke: isSfx ? 9 : 3,
    fill: "#fffdf4",
    strokeColor: "#171717",
    textColor: "#171717",
    hasTail: !/caption|sfx/i.test(row.type),
    tailX: panelRect.x + panelRect.w / 2,
    tailY: panelRect.y + panelRect.h / 2
  });
  applyBubblePreset(balloon, preset, false);
  const position = rectFromPlacementHint(panelRect, balloon, row.placement);
  balloon.x = position.x;
  balloon.y = position.y;
  if (balloon.hasTail) {
    balloon.tailX = panelRect.x + panelRect.w / 2;
    balloon.tailY = panelRect.y + panelRect.h * 0.55;
  }
  return balloon;
}

function assistantApplyPlan() {
  const rows = parseLetteringPlan(ui.assistantInput.value);
  if (!rows.length) {
    assistantCards([{
      title: "No Plan Rows Found",
      body: "Paste rows like: | 1 | Caption, upper-left sky | \"The sea raged.\" |",
      warn: true
    }]);
    return { message: "No plan rows found", warn: true };
  }

  pushHistory();
  const panelCount = Math.max(...rows.map((row) => row.panel));
  const panelGuideResult = ensurePlanPanelGuides(panelCount);
  const created = rows.map((row) => makePlanBalloon(row, panelCount));
  state.balloons.push(...created);
  const last = created[created.length - 1];
  if (last) select("balloon", last.id);
  render();
  updateChecks();
  assistantCards([
    { title: "Plan Applied", body: `${created.length} editable lettering object${created.length === 1 ? "" : "s"} created from the plan.` },
    { title: "Panel Guides", body: panelGuideResult.method === "image-gutters" ? "Panel guides were detected from the black gutters in the page art." : state.panels.length ? "Panel guides are active. Adjust them first if a band does not match the art exactly." : "Add panel guides for more accurate future placement." },
    { title: "Human Pass", body: "Now drag tails, protect key art, and run Critique for overlap and pacing checks." }
  ]);
  setStatus("Assistant applied lettering plan");
  return { message: `${created.length} plan object${created.length === 1 ? "" : "s"} created` };
}

function assistantCreateBalloons() {
  const beats = state.assistant.beats.length ? state.assistant.beats : splitDialogue(ui.assistantInput.value);
  if (!beats.length) {
    assistantCards([{ title: "No Dialogue", body: "Paste dialogue, then split or create balloons.", warn: true }]);
    return { message: "No dialogue found", warn: true };
  }

  pushHistory();
  const created = [];
  for (let i = 0; i < beats.length; i += 1) {
    const balloon = makeBalloon(beats[i], i, beats.length);
    placeBalloonSmart(balloon, i, beats.length);
    state.balloons.push(balloon);
    created.push(balloon);
  }

  const last = created[created.length - 1];
  if (last) select("balloon", last.id);
  render();
  updateChecks();
  assistantCards([
    { title: "Balloons Created", body: `${created.length} balloon${created.length === 1 ? "" : "s"} added with tone-aware presets.` },
    { title: "Review Placement", body: "Use protected-zone warnings and reading order to make final human choices." }
  ]);
  setStatus("Assistant created balloons");
  return { message: `${created.length} balloon${created.length === 1 ? "" : "s"} created` };
}

function assistantAutoPlaceSelected() {
  const obj = selectedObject();
  if (!obj || state.selected.type !== "balloon") {
    assistantCards([{ title: "Select A Balloon", body: "Choose a balloon, then place it with the assistant.", warn: true }]);
    return { message: "Select a balloon first", warn: true };
  }

  pushHistory();
  const ordered = state.balloons.slice().sort((a, b) => a.y - b.y || a.x - b.x);
  const index = Math.max(0, ordered.findIndex((balloon) => balloon.id === obj.id));
  placeBalloonSmart(obj, index, Math.max(1, state.balloons.length), obj.id);
  syncInspector();
  render();
  updateChecks();
  assistantCards([{ title: "Placed Selected Balloon", body: "The assistant moved it to the lowest-conflict area it found." }]);
  setStatus("Assistant placed selected balloon");
  return { message: "Selected balloon placed" };
}

function resizeByHandle(obj, part, point) {
  const min = 24;
  if (part.includes("n")) {
    const bottom = obj.y + obj.h;
    obj.y = Math.min(point.y, bottom - min);
    obj.h = bottom - obj.y;
  }
  if (part.includes("s")) {
    obj.h = Math.max(min, point.y - obj.y);
  }
  if (part.includes("w")) {
    const right = obj.x + obj.w;
    obj.x = Math.min(point.x, right - min);
    obj.w = right - obj.x;
  }
  if (part.includes("e")) {
    obj.w = Math.max(min, point.x - obj.x);
  }
}

canvas.addEventListener("pointerdown", (event) => {
  const point = pointerToPage(event);
  canvas.setPointerCapture(event.pointerId);

  if (state.tool === "balloon") {
    pushHistory();
    addBalloon(false);
    const obj = selectedObject();
    obj.x = point.x - obj.w / 2;
    obj.y = point.y - obj.h / 2;
    obj.tailX = point.x;
    obj.tailY = point.y + obj.h;
    render();
    syncInspector();
    return;
  }

  if (state.tool === "safe" || state.tool === "panel") {
    const type = state.tool;
    const startSnapshot = createSnapshot();
    const newObj = {
      id: id(type),
      label: type === "safe" ? "Protected art" : "Panel guide",
      x: point.x,
      y: point.y,
      w: 1,
      h: 1
    };
    if (type === "safe") state.safeZones.push(newObj);
    else state.panels.push(newObj);
    select(type, newObj.id);
    state.drag = { type, id: newObj.id, part: "create", start: point, startSnapshot };
    render();
    return;
  }

  const hit = hitTest(point);
  if (!hit) {
    select(null, null);
    render();
    return;
  }

  select(hit.type, hit.id);
  const obj = selectedObject();
  state.drag = {
    type: hit.type,
    id: hit.id,
    part: hit.part,
    start: point,
    original: { ...obj },
    startSnapshot: createSnapshot()
  };
});

canvas.addEventListener("pointermove", (event) => {
  if (!state.drag) return;
  const point = pointerToPage(event);
  const obj = selectedObject();
  if (!obj) return;
  if (state.drag.type === "panel") obj.generatedByAssistant = false;

  if (state.drag.part === "tail" && state.drag.type === "balloon") {
    obj.tailX = point.x;
    obj.tailY = point.y;
  } else if (state.drag.part === "move") {
    obj.x = state.drag.original.x + point.x - state.drag.start.x;
    obj.y = state.drag.original.y + point.y - state.drag.start.y;
    if (state.drag.type === "balloon") {
      obj.tailX = state.drag.original.tailX + point.x - state.drag.start.x;
      obj.tailY = state.drag.original.tailY + point.y - state.drag.start.y;
    }
  } else if (state.drag.part === "create") {
    obj.w = point.x - state.drag.start.x;
    obj.h = point.y - state.drag.start.y;
    normalizeRect(obj);
  } else {
    resizeByHandle(obj, state.drag.part, point);
  }

  syncInspector();
  render();
  updateChecks();
});

canvas.addEventListener("pointerup", (event) => {
  canvas.releasePointerCapture(event.pointerId);
  if (state.drag && state.drag.startSnapshot) {
    pushHistorySnapshot(state.drag.startSnapshot, true);
  }
  state.drag = null;
  syncInspector();
  updateChecks();
});

function setTool(tool) {
  state.tool = tool;
  ui.tools.forEach((button) => button.classList.toggle("active", button.dataset.tool === tool));
  canvas.style.cursor = tool === "select" ? "default" : "crosshair";
}

function loadImageFromDataUrl(dataUrl, name) {
  const img = new Image();
  img.onload = () => {
    state.image = img;
    state.imageDataUrl = dataUrl;
    state.imageName = name || "image";
    state.title = name ? name.replace(/\.[^.]+$/, "") : "Comic page";
    updateCanvasSize();
    render();
    setStatus("Image loaded");
  };
  img.src = dataUrl;
}

function loadImageFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    pushHistory();
    loadImageFromDataUrl(String(reader.result), file.name);
  };
  reader.readAsDataURL(file);
}

async function loadSample() {
  if (location.protocol === "file:") {
    setStatus("Import a clean page image when opening from a file.");
    return;
  }

  try {
    let response = null;
    for (const candidate of sampleCandidates) {
      response = await fetch(candidate);
      if (response.ok) break;
    }

    if (!response || !response.ok) throw new Error("No sample image found");

    const blob = await response.blob();
    const reader = new FileReader();
    reader.onload = () => {
      pushHistory();
      loadImageFromDataUrl(String(reader.result), "Calder Page 7 clean");
      state.notes = "Sample page loaded from outputs. Mark protected zones, add balloons, then export.";
      ui.notesInput.value = state.notes;
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    setStatus("Could not load sample. Import an image instead.");
  }
}

function projectData() {
  return {
    app: "Proto Calder Comic Studio",
    version: 7,
    title: state.title,
    imageName: state.imageName,
    imageDataUrl: state.imageDataUrl,
    notes: state.notes,
    assistant: {
      input: ui.assistantInput.value,
      tone: ui.assistantToneInput.value,
      beats: state.assistant.beats
    },
    balloons: state.balloons,
    safeZones: state.safeZones,
    panels: state.panels
  };
}

function saveProject() {
  const blob = new Blob([JSON.stringify(projectData(), null, 2)], { type: "application/json" });
  downloadBlob(blob, `${safeFileName(state.title || "comic-page")}.pccs.json`);
  setStatus("Project saved");
}

function loadProjectFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      pushHistory();
      state.title = data.title || "Comic page";
      state.imageName = data.imageName || "";
      state.notes = data.notes || "";
      ui.notesInput.value = state.notes;
      ui.assistantInput.value = data.assistant && data.assistant.input ? data.assistant.input : "";
      ui.assistantToneInput.value = data.assistant && data.assistant.tone ? data.assistant.tone : "auto";
      state.assistant.beats = data.assistant && Array.isArray(data.assistant.beats) ? data.assistant.beats : [];
      state.balloons = (data.balloons || []).map(normalizeBalloon);
      state.safeZones = data.safeZones || [];
      state.panels = data.panels || [];
      if (data.imageDataUrl) {
        loadImageFromDataUrl(data.imageDataUrl, state.imageName || state.title);
      } else {
        updateCanvasSize();
        render();
      }
      select(null, null);
      updateChecks();
      setStatus("Project loaded");
    } catch (error) {
      setStatus("Project file could not be read");
    }
  };
  reader.readAsText(file);
}

function safeFileName(name) {
  return name.replace(/[^a-z0-9_-]+/gi, "_").replace(/^_+|_+$/g, "") || "comic-page";
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportPng() {
  const rect = pageRect();
  const out = document.createElement("canvas");
  out.width = rect.w;
  out.height = rect.h;
  render(true, out);
  out.toBlob((blob) => {
    if (!blob) {
      setStatus("Export failed");
      return;
    }
    downloadBlob(blob, `${safeFileName(state.title || "lettered-page")}_lettered.png`);
    setStatus("PNG exported");
  }, "image/png");
}

function handleInspectorInput() {
  if (!state.selected) return;
  if (!state.history.pendingInspector) {
    pushHistory();
    state.history.pendingInspector = true;
  }
  applyInspectorChange();
}

function handleInspectorChange() {
  if (!state.selected) return;
  if (!state.history.pendingInspector) pushHistory();
  applyInspectorChange();
  state.history.pendingInspector = false;
}

function handleNotesInput() {
  if (!state.history.pendingNotes) {
    pushHistory();
    state.history.pendingNotes = true;
  }
  state.notes = ui.notesInput.value;
}

function handleNotesChange() {
  if (!state.history.pendingNotes) pushHistory();
  state.notes = ui.notesInput.value;
  state.history.pendingNotes = false;
}

ui.tools.forEach((button) => button.addEventListener("click", () => setTool(button.dataset.tool)));
ui.addBalloonBtn.addEventListener("click", addBalloon);
ui.addSafeBtn.addEventListener("click", addSafeZone);
ui.addPanelBtn.addEventListener("click", addPanelGuide);
ui.detectPanelsBtn.addEventListener("click", () => runAssistantAction("Detecting panel guides", detectPanelGuides, "Panel guides detected"));
ui.deleteBtn.addEventListener("click", deleteSelected);
ui.critiqueBtn.addEventListener("click", () => runAssistantAction("Critiquing page", pageCritique, "Critique ready"));
ui.splitDialogueBtn.addEventListener("click", () => runAssistantAction("Splitting dialogue", assistantSplitDialogue));
ui.createBalloonsBtn.addEventListener("click", () => runAssistantAction("Creating balloons", assistantCreateBalloons));
ui.autoPlaceBtn.addEventListener("click", () => runAssistantAction("Placing balloon", assistantAutoPlaceSelected));
ui.applyPlanBtn.addEventListener("click", () => runAssistantAction("Applying lettering plan", assistantApplyPlan));
ui.undoBtn.addEventListener("click", undo);
ui.redoBtn.addEventListener("click", redo);
ui.loadSampleBtn.addEventListener("click", loadSample);
ui.saveProjectBtn.addEventListener("click", saveProject);
ui.exportBtn.addEventListener("click", exportPng);
ui.bubblePresetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!state.selected || state.selected.type !== "balloon") return;
    const obj = selectedObject();
    if (obj) applyBubblePreset(obj, button.dataset.bubblePreset);
  });
});
ui.imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) loadImageFile(file);
  event.target.value = "";
});
ui.projectInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) loadProjectFile(file);
  event.target.value = "";
});
ui.zoomRange.addEventListener("input", () => {
  state.zoom = Number(ui.zoomRange.value) / 100;
  updateCanvasSize();
  render();
});
ui.showSafeToggle.addEventListener("change", () => {
  state.options.showSafe = ui.showSafeToggle.checked;
  render();
});
ui.showPanelToggle.addEventListener("change", () => {
  state.options.showPanels = ui.showPanelToggle.checked;
  render();
});
ui.showWarningsToggle.addEventListener("change", () => {
  state.options.showWarnings = ui.showWarningsToggle.checked;
  render();
});
ui.notesInput.addEventListener("input", handleNotesInput);
ui.notesInput.addEventListener("change", handleNotesChange);

[
  ui.textInput,
  ui.labelInput,
  ui.xInput,
  ui.yInput,
  ui.wInput,
  ui.hInput,
  ui.fontSizeInput,
  ui.paddingInput,
  ui.radiusInput,
  ui.strokeInput,
  ui.styleInput,
  ui.fillInput,
  ui.strokeColorInput,
  ui.textColorInput,
  ui.tailToggle,
  ui.tailWidthInput,
  ui.wobbleInput,
  ui.textureInput,
  ui.glowInput
].forEach((input) => {
  input.addEventListener("input", handleInspectorInput);
  input.addEventListener("change", handleInspectorChange);
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  const shortcut = event.ctrlKey || event.metaKey;
  if (shortcut && key === "z") {
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
    return;
  }
  if (shortcut && key === "y") {
    event.preventDefault();
    redo();
    return;
  }

  if (event.key === "Delete" || event.key === "Backspace") {
    const activeTag = document.activeElement && document.activeElement.tagName;
    if (activeTag !== "INPUT" && activeTag !== "TEXTAREA" && activeTag !== "SELECT") {
      deleteSelected();
    }
  }
});

updateCanvasSize();
render();
updateChecks();
updateHistoryControls();
setTool("select");
