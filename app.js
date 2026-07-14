const canvas = document.getElementById("pageCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  imageInput: document.getElementById("imageInput"),
  projectInput: document.getElementById("projectInput"),
  loadSampleBtn: document.getElementById("loadSampleBtn"),
  scriptGenBtn: document.getElementById("scriptGenBtn"),
  scriptGenModal: document.getElementById("scriptGenModal"),
  scriptGenCloseBtn: document.getElementById("scriptGenCloseBtn"),
  sgSourceInput: document.getElementById("sgSourceInput"),
  sgPageInput: document.getElementById("sgPageInput"),
  sgPanelInput: document.getElementById("sgPanelInput"),
  sgPacingInput: document.getElementById("sgPacingInput"),
  sgGenerateBtn: document.getElementById("sgGenerateBtn"),
  sgSendPlanBtn: document.getElementById("sgSendPlanBtn"),
  sgApplyPlanBtn: document.getElementById("sgApplyPlanBtn"),
  sgStatus: document.getElementById("sgStatus"),
  sgStatusText: document.getElementById("sgStatusText"),
  sgTabs: Array.from(document.querySelectorAll("[data-sg-tab]")),
  sgOutput: document.getElementById("sgOutput"),
  sgCopyBtn: document.getElementById("sgCopyBtn"),
  sgDownloadBtn: document.getElementById("sgDownloadBtn"),
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
  tidyLetteringBtn: document.getElementById("tidyLetteringBtn"),
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
  scriptGenerator: {
    source: "",
    pageNumber: 1,
    panelCount: 5,
    pacing: "cinematic",
    activeTab: "script",
    outputs: {
      script: "",
      letteringPlan: "",
      imagePrompts: "",
      characterSheets: "",
      tracker: ""
    }
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
  tailStyle: "curved",
  wobble: 0,
  texture: 0,
  glow: 0,
  sfxVariant: "caricature-impact",
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
    tailStyle: "curved",
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
    tailStyle: "curved",
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
    tailStyle: "curved",
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
    tailStyle: "curved",
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
    tailStyle: "curved",
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
    tailStyle: "curved",
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
    tailStyle: "curved",
    wobble: 18,
    texture: 0,
    glow: 24,
    sfxVariant: "caricature-impact",
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
    tailStyle: "curved",
    wobble: 6,
    texture: 6,
    glow: 28,
    fillOpacity: 0.9
  }
};

const scriptGenTabs = {
  script: "Script",
  letteringPlan: "Lettering Plan",
  imagePrompts: "Image Prompts",
  characterSheets: "Character Sheets",
  tracker: "Tracker"
};

const emptyScriptOutputs = {
  script: "",
  letteringPlan: "",
  imagePrompts: "",
  characterSheets: "",
  tracker: ""
};

function id(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function setStatus(text) {
  ui.statusText.textContent = text;
}

function assistantButtons() {
  return [ui.critiqueBtn, ui.splitDialogueBtn, ui.createBalloonsBtn, ui.autoPlaceBtn, ui.applyPlanBtn, ui.tidyLetteringBtn, ui.detectPanelsBtn];
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

function setScriptGenStatus(message, mode = "idle") {
  if (!ui.sgStatusText || !ui.sgStatus) return;
  ui.sgStatusText.textContent = message;
  ui.sgStatus.classList.toggle("busy", mode === "busy");
  ui.sgStatus.classList.toggle("error", mode === "error");
}

function hasDraftScriptGeneratorUi() {
  return Boolean(ui.sgSourceInput && ui.sgOutput);
}

function currentScriptOutput() {
  const tab = state.scriptGenerator.activeTab;
  return state.scriptGenerator.outputs[tab] || "";
}

function updateScriptGenButtons() {
  if (!hasDraftScriptGeneratorUi()) return;
  const hasPlan = Boolean((state.scriptGenerator.outputs.letteringPlan || "").trim());
  if (ui.sgSendPlanBtn) ui.sgSendPlanBtn.disabled = !hasPlan;
  if (ui.sgApplyPlanBtn) ui.sgApplyPlanBtn.disabled = !hasPlan;
  if (ui.sgCopyBtn) ui.sgCopyBtn.disabled = !currentScriptOutput().trim();
  if (ui.sgDownloadBtn) ui.sgDownloadBtn.disabled = !currentScriptOutput().trim();
}

function syncScriptGenForm() {
  if (!hasDraftScriptGeneratorUi()) return;
  ui.sgSourceInput.value = state.scriptGenerator.source || "";
  ui.sgPageInput.value = state.scriptGenerator.pageNumber || 1;
  ui.sgPanelInput.value = state.scriptGenerator.panelCount || 5;
  ui.sgPacingInput.value = state.scriptGenerator.pacing || "cinematic";
  ui.sgTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.sgTab === state.scriptGenerator.activeTab);
  });
  ui.sgOutput.value = currentScriptOutput();
  updateScriptGenButtons();
}

function setScriptGeneratorOpen(open) {
  if (!hasDraftScriptGeneratorUi()) {
    ui.scriptGenModal.classList.toggle("hidden", !open);
    return;
  }
  if (open) {
    if (!state.scriptGenerator.source.trim()) {
      state.scriptGenerator.source = ui.assistantInput.value || state.notes || "";
    }
    syncScriptGenForm();
    ui.scriptGenModal.classList.remove("hidden");
    window.setTimeout(() => ui.sgSourceInput.focus(), 0);
  } else {
    ui.scriptGenModal.classList.add("hidden");
  }
}

function syncScriptGeneratorInputs() {
  if (!hasDraftScriptGeneratorUi()) return;
  state.scriptGenerator.source = ui.sgSourceInput.value;
  state.scriptGenerator.pageNumber = clamp(Number.parseInt(ui.sgPageInput.value, 10) || 1, 1, 999);
  state.scriptGenerator.panelCount = clamp(Number.parseInt(ui.sgPanelInput.value, 10) || 5, 3, 9);
  state.scriptGenerator.pacing = ui.sgPacingInput.value || "cinematic";
}

function setScriptGenTab(tab) {
  if (!hasDraftScriptGeneratorUi()) return;
  if (!scriptGenTabs[tab]) return;
  state.scriptGenerator.outputs[state.scriptGenerator.activeTab] = ui.sgOutput.value;
  state.scriptGenerator.activeTab = tab;
  syncScriptGenForm();
}

function updateActiveScriptOutput() {
  if (!hasDraftScriptGeneratorUi()) return;
  state.scriptGenerator.outputs[state.scriptGenerator.activeTab] = ui.sgOutput.value;
  updateScriptGenButtons();
}

function stripQuotes(value) {
  return (value || "")
    .trim()
    .replace(/^["'\u201c\u201d]+|["'\u201c\u201d]+$/g, "")
    .trim();
}

function normalizeSentence(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^[-*]\s+/, "")
    .trim();
}

function splitSentenceParts(line) {
  const parts = [];
  let current = "";
  let inQuote = false;
  let pendingEnd = false;

  for (const char of line) {
    current += char;
    if (char === "\"" || char === "\u201c" || char === "\u201d") {
      inQuote = !inQuote;
    }
    if (/[.!?]/.test(char)) pendingEnd = true;
    if (pendingEnd && !inQuote && /\s/.test(char)) {
      const sentence = normalizeSentence(current);
      if (sentence) parts.push(sentence);
      current = "";
      pendingEnd = false;
    }
  }

  const final = normalizeSentence(current);
  if (final) parts.push(final);
  return parts;
}

function splitStoryBeats(source) {
  const lines = String(source || "")
    .replace(/\r/g, "")
    .split(/\n+/)
    .map(normalizeSentence)
    .filter(Boolean)
    .filter((line) => !/^\|?\s*-+\s*\|?/.test(line));
  const beats = [];

  for (const line of lines) {
    if (/^\|/.test(line) && line.includes("|")) continue;
    const parts = splitSentenceParts(line);
    for (const part of parts) {
      const beat = normalizeSentence(part);
      if (beat) beats.push(beat);
    }
  }

  return beats.length ? beats : [normalizeSentence(source)].filter(Boolean);
}

function conciseText(text, limit = 112) {
  const value = normalizeSentence(text);
  if (value.length <= limit) return value;
  const words = value.split(/\s+/);
  let out = "";
  for (const word of words) {
    const next = out ? `${out} ${word}` : word;
    if (next.length > limit - 1) break;
    out = next;
  }
  return `${out.replace(/[,.!?;:]+$/, "")}.`;
}

function extractDialogueBeats(source) {
  const text = String(source || "");
  const beats = [];
  const quoteRegex = /["\u201c]([^"\u201d]{2,180})["\u201d]/g;
  let match = quoteRegex.exec(text);
  while (match) {
    beats.push({ speaker: "", text: conciseText(match[1], 92) });
    match = quoteRegex.exec(text);
  }

  for (const line of text.replace(/\r/g, "").split(/\n+/)) {
    const colon = line.trim().match(/^([A-Z][A-Za-z' -]{1,28}):\s*(.{2,180})$/);
    if (colon) {
      beats.push({ speaker: colon[1].trim(), text: conciseText(colon[2], 92) });
    }
  }

  return beats.filter((beat, index, list) => (
    beat.text && list.findIndex((other) => other.text === beat.text) === index
  ));
}

function sfxFromBeat(beat, pacing) {
  const text = beat.toLowerCase();
  if (/rope|snap|splinter|crack|break|fracture|wood/.test(text)) return "KRAK";
  if (/thunder|storm|wave|sea|cliff|crash|surge|impact/.test(text)) return pacing === "action" ? "KRA-KOOM" : "THOOM";
  if (/blade|metal|clang|shield/.test(text)) return "CLANG";
  if (/whisper|breath|hush/.test(text)) return "hsssh";
  return "";
}

function panelShot(panel, panelCount, pacing) {
  if (panel === 1) return "Wide establishing";
  if (panel === panelCount) return pacing === "action" ? "Wide impact reveal" : "Cinematic reveal";
  if (panelCount >= 5 && panel === panelCount - 1) return "Extreme close-up";
  if (pacing === "dialogue") return panel % 2 ? "Over-shoulder" : "Reaction close-up";
  if (pacing === "action") return panel % 2 ? "Action insert" : "Low-angle medium";
  if (pacing === "quiet") return panel % 2 ? "Held medium" : "Quiet close-up";
  return panel % 2 ? "Medium composition" : "Close detail";
}

function placementForPanel(panel, panelCount, type, action) {
  const value = `${type} ${action}`.toLowerCase();
  if (/sfx/i.test(type)) {
    if (/rope|snap|crack|wood/.test(value)) return "Beside the break, action visible";
    return "Near impact, not over key action";
  }
  if (/balloon/i.test(type)) {
    if (panel === panelCount - 1) return "Left negative space, tail to speaker";
    return panel % 2 ? "Upper-left negative space, tail to speaker" : "Upper-right negative space, tail to speaker";
  }
  if (panel === 1) return "Upper-left sky";
  if (panel === panelCount) return "Upper-right sky/negative space";
  if (/window|door|sky|sea/.test(value)) return "Right/window negative space";
  return panel % 2 ? "Upper-left negative space" : "Upper-right negative space";
}

function panelAct(panel, panelCount) {
  if (panel === 1) return "establish";
  if (panel === panelCount) return "reveal";
  if (panelCount >= 5 && panel === panelCount - 1) return "turn";
  if (panel === 2) return "human";
  return "pressure";
}

function buildScriptPanels(source, panelCount, pacing) {
  const beats = splitStoryBeats(source);
  const dialogue = extractDialogueBeats(source);
  const panels = [];
  let dialogueIndex = 0;

  for (let panel = 1; panel <= panelCount; panel += 1) {
    const beat = beats[Math.min(beats.length - 1, Math.floor((panel - 1) / panelCount * beats.length))] || beats[(panel - 1) % beats.length] || "";
    const nextBeat = beats[Math.min(beats.length - 1, panel)] || beat;
    const act = panelAct(panel, panelCount);
    const sfx = act === "pressure" || pacing === "action" ? sfxFromBeat(beat, pacing) : "";
    const beatDialogue = extractDialogueBeats(beat)[0] || null;
    let line = beatDialogue;
    if (!line && pacing === "dialogue" && dialogue[dialogueIndex]) {
      line = dialogue[dialogueIndex++];
    } else if (line && dialogue[dialogueIndex] && dialogue[dialogueIndex].text === line.text) {
      dialogueIndex += 1;
    }
    const action = conciseText(beat || nextBeat, 132);
    const type = sfx ? "SFX" : line ? "Balloon" : "Caption";
    const text = sfx || (line && line.text) || conciseText(beat || nextBeat, 116);

    panels.push({
      panel,
      act,
      shot: panelShot(panel, panelCount, pacing),
      action,
      type,
      text,
      speaker: line && line.speaker ? line.speaker : "",
      placement: placementForPanel(panel, panelCount, type, action)
    });
  }

  return panels;
}

function markdownTable(rows, columns) {
  const header = `| ${columns.join(" | ")} |`;
  const divider = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${columns.map((column) => row[column] || "").join(" | ")} |`);
  return [header, divider, ...body].join("\n");
}

function buildScriptOutput(pageNumber, panels, pacing) {
  const rows = panels.map((panel) => ({
    Panel: String(panel.panel),
    Shot: panel.shot,
    Action: panel.action,
    Lettering: `${panel.type}: "${panel.text}"`
  }));
  return [
    `# Page ${pageNumber} Script`,
    `Pacing: ${pacing}`,
    "",
    markdownTable(rows, ["Panel", "Shot", "Action", "Lettering"])
  ].join("\n");
}

function buildLetteringPlanOutput(panels) {
  const rows = panels.map((panel) => ({
    Panel: String(panel.panel),
    Type: panel.type,
    Text: `"${panel.text}"`,
    Placement: panel.placement
  }));
  return markdownTable(rows, ["Panel", "Type", "Text", "Placement"]);
}

function buildImagePromptsOutput(pageNumber, panels, source) {
  const setting = conciseText(source, 150);
  return panels.map((panel) => [
    `Panel ${panel.panel} - ${panel.shot}`,
    `Prompt: cinematic fantasy comic panel, ${panel.action}, Calder's Remnants mood, rich painterly detail, readable silhouettes, protected face and hand anatomy, no lettering, no watermarks.`,
    `Continuity: page ${pageNumber}, ${setting}`,
    "Negative: cropped faces, distorted hands, extra fingers, random symbols, unreadable action, text baked into art."
  ].join("\n")).join("\n\n");
}

function extractCharacterNames(source) {
  const ignored = new Set([
    "The", "A", "An", "And", "But", "Or", "Inside", "Outside", "Page", "Panel",
    "Caption", "SFX", "Script", "Calder", "Remnants"
  ]);
  const names = [];
  const regex = /\b[A-Z][a-zA-Z']{2,}\b/g;
  let match = regex.exec(source);
  while (match) {
    const name = match[0];
    if (!ignored.has(name) && !names.includes(name)) names.push(name);
    match = regex.exec(source);
  }
  ["Aegir", "Draugen"].forEach((name) => {
    if (source.toLowerCase().includes(name.toLowerCase()) && !names.includes(name)) names.push(name);
  });
  return names.slice(0, 8);
}

function buildCharacterSheetsOutput(source, panels) {
  const names = extractCharacterNames(source);
  const rows = (names.length ? names : ["Lead figure", "Opposing force", "Village crowd"]).map((name) => {
    const mentions = panels
      .filter((panel) => `${panel.action} ${panel.text}`.toLowerCase().includes(name.toLowerCase().split(" ")[0]))
      .map((panel) => `P${panel.panel}`)
      .join(", ") || "Page continuity";
    return {
      Character: name,
      Role: name === "Aegir" ? "Sea god presence" : name === "Draugen" ? "Threat or named horror" : "Story figure",
      Consistency: "Keep face, costume, scale, hair, hands, and silhouette consistent across panels.",
      Panels: mentions
    };
  });
  return markdownTable(rows, ["Character", "Role", "Consistency", "Panels"]);
}

function buildTrackerOutput(pageNumber, panels) {
  const rows = [
    { Task: "Page script", Status: "Drafted", Notes: `Page ${pageNumber}, ${panels.length} panels` },
    { Task: "Lettering plan", Status: "Ready", Notes: "Send to Assistant, then apply to canvas" },
    { Task: "Image prompts", Status: "Ready", Notes: "Use per-panel prompts for clean art generation" },
    { Task: "Character continuity", Status: "Needs review", Notes: "Confirm outfits and hand scale before final art" },
    { Task: "Lettering QA", Status: "Pending", Notes: "Run Tidy Lettering after panel guides are correct" }
  ];
  return markdownTable(rows, ["Task", "Status", "Notes"]);
}

function generatedPackageFromSource(source, pageNumber, panelCount, pacing) {
  const panels = buildScriptPanels(source, panelCount, pacing);
  return {
    script: buildScriptOutput(pageNumber, panels, pacing),
    letteringPlan: buildLetteringPlanOutput(panels),
    imagePrompts: buildImagePromptsOutput(pageNumber, panels, source),
    characterSheets: buildCharacterSheetsOutput(source, panels),
    tracker: buildTrackerOutput(pageNumber, panels)
  };
}

function generateScriptPackage() {
  syncScriptGeneratorInputs();
  if (!state.scriptGenerator.source.trim()) {
    setScriptGenStatus("Paste a scene or page beat first.", "error");
    return;
  }
  setScriptGenStatus("Generating page package...", "busy");
  window.setTimeout(() => {
    state.scriptGenerator.outputs = generatedPackageFromSource(
      state.scriptGenerator.source,
      state.scriptGenerator.pageNumber,
      state.scriptGenerator.panelCount,
      state.scriptGenerator.pacing
    );
    state.scriptGenerator.activeTab = "script";
    syncScriptGenForm();
    setScriptGenStatus("Page package ready");
    setStatus("Script package generated");
  }, 40);
}

function sendGeneratedPlanToAssistant(showStatus = true) {
  updateActiveScriptOutput();
  const plan = state.scriptGenerator.outputs.letteringPlan || "";
  if (!plan.trim()) {
    setScriptGenStatus("Generate a lettering plan first.", "error");
    return false;
  }
  ui.assistantInput.value = plan;
  ui.assistantToneInput.value = "auto";
  state.assistant.beats = [];
  assistantCards([
    { title: "Generated Plan Sent", body: "The lettering plan is now in Studio Assistant and ready to apply." },
    { title: "Next", body: "Use Apply Plan, then run Detect Panel Guides and Tidy Lettering for the page art." }
  ]);
  if (showStatus) {
    setScriptGenStatus("Lettering plan sent to Assistant");
    setStatus("Generated plan ready in Assistant");
  }
  return true;
}

function applyGeneratedPlanToCanvas() {
  if (!sendGeneratedPlanToAssistant(false)) return;
  setScriptGeneratorOpen(false);
  runAssistantAction("Applying generated lettering plan", assistantApplyPlan, "Generated lettering applied");
}

function copyScriptGenOutput() {
  updateActiveScriptOutput();
  const text = currentScriptOutput();
  if (!text.trim()) {
    setScriptGenStatus("Nothing to copy yet.", "error");
    return;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => setScriptGenStatus(`${scriptGenTabs[state.scriptGenerator.activeTab]} copied`))
      .catch(() => setScriptGenStatus("Copy failed. Select the text and copy manually.", "error"));
    return;
  }
  ui.sgOutput.select();
  document.execCommand("copy");
  setScriptGenStatus(`${scriptGenTabs[state.scriptGenerator.activeTab]} copied`);
}

function downloadScriptGenOutput() {
  updateActiveScriptOutput();
  const text = currentScriptOutput();
  if (!text.trim()) {
    setScriptGenStatus("Nothing to download yet.", "error");
    return;
  }
  const tab = state.scriptGenerator.activeTab;
  const name = `${safeFileName(state.title || "calder-page")}_${tab}.md`;
  downloadBlob(new Blob([text], { type: "text/markdown" }), name);
  setScriptGenStatus(`${scriptGenTabs[tab]} downloaded`);
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
  balloon.tailStyle = balloon.tailStyle || balloonDefaults.tailStyle;
  balloon.wobble = Number.isFinite(Number(balloon.wobble)) ? Number(balloon.wobble) : balloonDefaults.wobble;
  balloon.texture = Number.isFinite(Number(balloon.texture)) ? Number(balloon.texture) : balloonDefaults.texture;
  balloon.glow = Number.isFinite(Number(balloon.glow)) ? Number(balloon.glow) : balloonDefaults.glow;
  balloon.sfxVariant = balloon.sfxVariant || balloonDefaults.sfxVariant;
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
  const width = Math.max(8, Number(balloon.tailWidth) || 18) * scale;
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

function drawCurvedTail(context, balloon, x, y, w, h, tailX, tailY, scale) {
  if (!balloon.hasTail) return;
  const anchor = nearestTailAnchor(x, y, w, h, tailX, tailY);
  const cx = x + w / 2;
  const cy = y + h / 2;
  const towardCenterX = cx - anchor.x;
  const towardCenterY = cy - anchor.y;
  const centerLen = Math.max(1, Math.hypot(towardCenterX, towardCenterY));
  const overlap = Math.max(8, (Number(balloon.tailWidth) || 18) * 0.42) * scale;
  const baseX = anchor.x + (towardCenterX / centerLen) * overlap;
  const baseY = anchor.y + (towardCenterY / centerLen) * overlap;
  const dx = tailX - baseX;
  const dy = tailY - baseY;
  const len = Math.max(1, Math.hypot(dx, dy));
  const width = Math.max(12, Number(balloon.tailWidth) || 18) * scale;
  const perpX = -dy / len;
  const perpY = dx / len;
  const baseSpread = width * 0.58;
  const tipSpread = Math.max(2.5 * scale, width * 0.08);
  const curve = Math.min(len * 0.32, 38 * scale);
  const bend = Math.min(width * 0.45, 11 * scale);
  const controlX = baseX + dx * 0.48 + perpX * bend;
  const controlY = baseY + dy * 0.48 + perpY * bend;

  context.beginPath();
  context.moveTo(baseX + perpX * baseSpread, baseY + perpY * baseSpread);
  context.quadraticCurveTo(controlX + perpX * curve * 0.18, controlY + perpY * curve * 0.18, tailX + perpX * tipSpread, tailY + perpY * tipSpread);
  context.lineTo(tailX - perpX * tipSpread, tailY - perpY * tipSpread);
  context.quadraticCurveTo(controlX - perpX * curve * 0.18, controlY - perpY * curve * 0.18, baseX - perpX * baseSpread, baseY - perpY * baseSpread);
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

function fontForBalloon(balloon, size) {
  if (balloon.style === "sfx") return `900 ${size}px "Impact", "Arial Black", "Segoe UI", sans-serif`;
  if (balloon.style === "caption" && balloon.fill === "#10151b") return `800 ${size}px Georgia, "Times New Roman", serif`;
  return `700 ${size}px "Comic Neue", "Comic Sans MS", "Segoe UI", sans-serif`;
}

function balloonDisplayText(balloon) {
  // Comics letter speech in caps; captions keep their written case.
  if (balloon.style === "caption") return balloon.text || "";
  return (balloon.text || "").toUpperCase();
}

function fitBalloonText(context, balloon) {
  let size = balloon.fontSize;
  let lines = [];
  const maxW = Math.max(20, balloon.w - balloon.padding * 2);
  const maxH = Math.max(20, balloon.h - balloon.padding * 2);
  const displayText = balloonDisplayText(balloon);

  while (size >= 12) {
    context.font = fontForBalloon(balloon, size);
    lines = wrapText(context, displayText, maxW);
    const lineHeight = size * 1.22;
    if (lines.length * lineHeight <= maxH) {
      return { size, lines, lineHeight };
    }
    size -= 1;
  }

  context.font = fontForBalloon(balloon, 12);
  return { size: 12, lines: wrapText(context, displayText, maxW), lineHeight: 14.5 };
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

function drawSfxActionLines(context, x, y, w, h, scale) {
  context.save();
  context.strokeStyle = "rgba(255, 240, 166, 0.72)";
  context.lineWidth = Math.max(1.4, 2 * scale);
  context.lineCap = "round";
  const lines = [
    [x - w * 0.34, y + h * 0.18, x - w * 0.08, y + h * 0.36],
    [x - w * 0.3, y + h * 0.78, x - w * 0.04, y + h * 0.62],
    [x + w * 1.08, y + h * 0.24, x + w * 1.34, y + h * 0.08],
    [x + w * 1.02, y + h * 0.72, x + w * 1.32, y + h * 0.86]
  ];
  for (const [x1, y1, x2, y2] of lines) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }
  context.restore();
}

function drawCaricatureSfxLine(context, line, centerX, centerY, size, seed, scale, balloon) {
  const chars = Array.from(line);
  const spacing = size * 0.58;
  const totalW = spacing * (chars.length - 1);
  const baseX = centerX - totalW / 2;
  for (let index = 0; index < chars.length; index += 1) {
    const ch = chars[index];
    const lift = (((seed + index * 19) % 7) - 3) * size * 0.018;
    const squash = 0.94 + (((seed + index * 23) % 9) / 100);
    const angle = (((seed + index * 31) % 13) - 6) * Math.PI / 150;
    const px = baseX + spacing * index;
    const py = centerY + lift + (index % 2 === 0 ? -size * 0.025 : size * 0.02);
    context.save();
    context.translate(px, py);
    context.rotate(angle);
    context.scale(squash, 1.02 + (index % 2) * 0.05);
    context.strokeStyle = balloon.strokeColor || "#05070d";
    context.lineWidth = Math.max(4, balloon.stroke * scale);
    context.strokeText(ch, 0, 0);
    context.strokeStyle = "#e8f3ff";
    context.lineWidth = Math.max(1.5, balloon.stroke * 0.25 * scale);
    context.strokeText(ch, 0, 0);
    context.fillStyle = balloon.textColor || "#f4fbff";
    context.fillText(ch, 0, 0);
    context.restore();
  }
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
  const burstPadX = (6 + wobble * 0.18) * scale;
  const burstPadY = (3 + wobble * 0.12) * scale;
  const variant = balloon.sfxVariant || "caricature-impact";

  context.save();
  context.shadowColor = "transparent";
  context.shadowBlur = 0;
  if (variant === "caricature-impact") {
    drawSfxActionLines(context, x, y, w, h, scale);
    sfxBurstPath(context, x + w * 0.08, y + h * 0.08, w * 0.84, h * 0.84, seed);
    context.fillStyle = "rgba(210, 225, 220, 0.2)";
    context.strokeStyle = "rgba(7, 11, 16, 0.78)";
    context.lineWidth = Math.max(1.5, 2.2 * scale);
    context.fill();
    context.stroke();
  } else {
    sfxBurstPath(context, x - burstPadX, y - burstPadY, w + burstPadX * 2, h + burstPadY * 2, seed);
    context.fillStyle = "rgba(255, 234, 132, 0.24)";
    context.strokeStyle = "rgba(8, 10, 16, 0.82)";
    context.lineWidth = Math.max(2.5, 3.5 * scale);
    context.fill();
    context.stroke();
    drawSfxCracks(context, x - burstPadX, y - burstPadY, w + burstPadX * 2, h + burstPadY * 2, seed, scale);
  }

  context.translate(x + w / 2, y + h / 2);
  context.rotate((((seed % 9) - 4) * Math.PI) / 240);
  context.translate(-(x + w / 2), -(y + h / 2));
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.lineJoin = "round";
  context.lineCap = "round";
  context.font = `900 ${fit.size}px "Impact", "Arial Black", "Segoe UI", sans-serif`;
  const totalH = fit.lines.length * fit.lineHeight;
  if (variant === "caricature-impact" && fit.lines.length === 1) {
    context.textAlign = "center";
    context.textBaseline = "middle";
    if (balloon.glow > 0) {
      context.shadowColor = "rgba(205, 229, 255, 0.46)";
      context.shadowBlur = Number(balloon.glow) * 0.55 * scale;
    }
    drawCaricatureSfxLine(context, fit.lines[0], x + w / 2, y + h / 2 + fit.size * 0.05, fit.size, seed, scale, balloon);
    if (selected && !exportMode) drawSelection(context, balloon, scale, "#2f6f67");
    context.restore();
    return;
  }
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
    else if (balloon.tailStyle === "triangle") drawTriangleTail(context, balloon, x, y, w, h, tailX, tailY, scale);
    else drawCurvedTail(context, balloon, x, y, w, h, tailX, tailY, scale);
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
  context.font = fontForBalloon(balloon, fit.size);
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
    let bright = 0;
    let total = 0;
    for (let x = xStart; x < xEnd; x += xStep) {
      const offset = (y * sampleW + x) * 4;
      const brightness = (pixels[offset] + pixels[offset + 1] + pixels[offset + 2]) / 3;
      if (brightness < 30) dark += 1;
      if (brightness > 226) bright += 1;
      total += 1;
    }

    const darkFraction = total ? dark / total : 0;
    const brightFraction = total ? bright / total : 0;
    // Gutters can be black (manga) or white/paper (painterly pages) - accept both.
    const gutterScore = Math.max(darkFraction, brightFraction >= 0.88 ? brightFraction : 0);
    rowScores[y] = gutterScore;
    if (gutterScore >= 0.76) {
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
  // Painterly pages often use hairline gutters only 2-3px tall - keep the
  // minimum low so a strong-scoring thin seam still counts.
  const minGutterH = 2;
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

function rectFromPanelRatio(panelRect, ratios) {
  return {
    x: Math.round(panelRect.x + panelRect.w * ratios.x),
    y: Math.round(panelRect.y + panelRect.h * ratios.y),
    w: Math.round(panelRect.w * ratios.w),
    h: Math.round(panelRect.h * ratios.h)
  };
}

function fitBalloonToRect(balloon, rect) {
  balloon.x = rect.x;
  balloon.y = rect.y;
  balloon.w = Math.max(60, rect.w);
  balloon.h = Math.max(40, rect.h);
}

function applyHybridCaptionStyle(balloon, dark = false) {
  balloon.style = "caption";
  balloon.preset = "caption";
  balloon.hasTail = false;
  balloon.radius = 9;
  balloon.stroke = dark ? 2 : 2;
  balloon.padding = dark ? 18 : 16;
  balloon.fontSize = Math.max(Number(balloon.fontSize) || 23, dark ? 25 : 24);
  balloon.texture = dark ? 0 : 10;
  balloon.fillOpacity = dark ? 0.92 : 0.96;
  balloon.fill = dark ? "#10151b" : "#f6edcf";
  balloon.strokeColor = dark ? "#f1ead2" : "#2b2115";
  balloon.textColor = dark ? "#fff7df" : "#241b12";
}

function applyHybridDialogueStyle(balloon) {
  balloon.style = "oval";
  balloon.preset = "classic";
  balloon.fill = "#fffdf4";
  balloon.strokeColor = "#111111";
  balloon.textColor = "#111111";
  balloon.radius = 36;
  balloon.stroke = 3;
  balloon.padding = 18;
  balloon.fontSize = Math.max(Number(balloon.fontSize) || 24, 25);
  balloon.tailStyle = "curved";
  balloon.tailWidth = Math.max(18, Number(balloon.tailWidth) || 18);
  balloon.fillOpacity = 1;
  balloon.texture = 0;
}

function applyHybridSfxStyle(balloon) {
  balloon.style = "sfx";
  balloon.preset = "sfx";
  balloon.sfxVariant = "caricature-impact";
  balloon.textColor = "#f4fbff";
  balloon.strokeColor = "#06111c";
  balloon.stroke = 8;
  balloon.fontSize = Math.max(Number(balloon.fontSize) || 60, 66);
  balloon.glow = 12;
  balloon.wobble = 14;
  balloon.padding = 2;
  balloon.hasTail = false;
}

function pageOneProfileForBalloon(balloon, panelNumber, panelRect) {
  const text = (balloon.text || "").toLowerCase();
  if (panelNumber === 1 && balloon.style === "caption") {
    applyHybridCaptionStyle(balloon, false);
    return { rect: rectFromPanelRatio(panelRect, { x: 0.035, y: 0.045, w: 0.39, h: 0.22 }) };
  }

  if (panelNumber === 2 && balloon.style === "caption") {
    applyHybridCaptionStyle(balloon, true);
    return { rect: rectFromPanelRatio(panelRect, { x: 0.68, y: 0.12, w: 0.27, h: 0.34 }) };
  }

  if (panelNumber === 3 && (balloon.style === "sfx" || /krak|crack|snap/.test(text))) {
    applyHybridSfxStyle(balloon);
    return { rect: rectFromPanelRatio(panelRect, { x: 0.72, y: 0.47, w: 0.19, h: 0.38 }) };
  }

  if (panelNumber === 4 && /draugen/.test(text)) {
    applyHybridDialogueStyle(balloon);
    return {
      rect: rectFromPanelRatio(panelRect, { x: 0.035, y: 0.27, w: 0.21, h: 0.36 }),
      tail: {
        x: panelRect.x + panelRect.w * 0.5,
        y: panelRect.y + panelRect.h * 0.52
      }
    };
  }

  if (panelNumber === 5 && balloon.style === "caption") {
    applyHybridCaptionStyle(balloon, true);
    return { rect: rectFromPanelRatio(panelRect, { x: 0.56, y: 0.08, w: 0.38, h: 0.16 }) };
  }

  return null;
}

function applyPageOneProfile(balloon, panelNumber, panelRect) {
  const profile = pageOneProfileForBalloon(balloon, panelNumber, panelRect);
  if (!profile) return false;
  fitBalloonToRect(balloon, profile.rect);
  if (profile.tail && balloon.hasTail) {
    balloon.tailX = profile.tail.x;
    balloon.tailY = profile.tail.y;
  }
  normalizeBalloon(balloon);
  return true;
}

function sortedPanels() {
  return state.panels.slice().sort((a, b) => a.y - b.y || a.x - b.x);
}

function panelNumberForBalloon(balloon, panels) {
  const cx = balloon.x + balloon.w / 2;
  const cy = balloon.y + balloon.h / 2;
  const containing = panels.findIndex((panel) => contains(panel, { x: cx, y: cy }));
  if (containing >= 0) return containing + 1;
  let bestIndex = 0;
  let bestDistance = Infinity;
  panels.forEach((panel, index) => {
    const py = panel.y + panel.h / 2;
    const distance = Math.abs(cy - py);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  return bestIndex + 1;
}

function assistantTidyLettering() {
  if (!state.image) {
    assistantCards([{ title: "No Page Image", body: "Import a page image before tidying lettering.", warn: true }]);
    return { message: "Import a page image first", warn: true };
  }
  if (!state.balloons.length) {
    assistantCards([{ title: "No Lettering", body: "Apply a plan or create balloons before running Tidy Lettering.", warn: true }]);
    return { message: "No lettering to tidy", warn: true };
  }

  pushHistory();
  const panelCount = Math.max(guessedPanelCount(), 5);
  if (!state.panels.length || looksLikeLegacyPanelGuides(panelCount) || looksLikeGeneratedPanelGuides(panelCount)) {
    state.panels = [];
    createPlanPanelGuides(panelCount);
  }
  const panels = sortedPanels();
  let changed = 0;

  for (const balloon of state.balloons) {
    normalizeBalloon(balloon);
    const panelNumber = panelNumberForBalloon(balloon, panels);
    const panelRect = panels[panelNumber - 1];
    if (!panelRect) continue;
    if (applyPageOneProfile(balloon, panelNumber, panelRect)) changed += 1;
  }

  if (state.balloons.length) select("balloon", state.balloons[0].id);
  render();
  updateChecks();
  assistantCards([
    { title: "Lettering Tidied", body: `${changed} lettering object${changed === 1 ? "" : "s"} reflowed around Page 1 action areas.` },
    { title: "Protected Acting", body: "Panel 2 faces, the rope snap, the eye, Aegir, the monster head, and the village are treated as protected art." },
    { title: "Human Pass", body: "Make final micro-adjustments after export preview, especially if the page art changes." }
  ]);
  return { message: `${changed} lettering object${changed === 1 ? "" : "s"} tidied` };
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

// ---------------------------------------------------------------------------
// Art-aware placement. A coarse detail map of the page art tells the
// assistant where the quiet areas are (sky, water, flat walls - good balloon
// real estate) and where the busy areas are (figures, faces - what tails
// should point at and balloons should avoid).
// ---------------------------------------------------------------------------

let detailGridCache = null;

function imageDetailGrid() {
  if (!state.image) return null;
  const rect = pageRect();
  const key = `${state.imageName}_${rect.w}x${rect.h}`;
  if (detailGridCache && detailGridCache.key === key) return detailGridCache;

  const sampleW = 160;
  const sampleH = Math.max(120, Math.round(sampleW * rect.h / rect.w));
  const sample = document.createElement("canvas");
  sample.width = sampleW;
  sample.height = sampleH;
  const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
  if (!sampleCtx) return null;
  try {
    sampleCtx.drawImage(state.image, 0, 0, sampleW, sampleH);
  } catch {
    return null;
  }
  let pixels;
  try {
    pixels = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;
  } catch {
    return null;
  }

  const lum = new Float32Array(sampleW * sampleH);
  for (let i = 0; i < sampleW * sampleH; i += 1) {
    lum[i] = (pixels[i * 4] + pixels[i * 4 + 1] + pixels[i * 4 + 2]) / 3;
  }

  const cell = 5;
  const cols = Math.floor(sampleW / cell);
  const gridRows = Math.floor(sampleH / cell);
  const cells = new Float32Array(cols * gridRows);
  const counts = new Float32Array(cols * gridRows);
  for (let y = 1; y < sampleH - 1; y += 1) {
    for (let x = 1; x < sampleW - 1; x += 1) {
      const i = y * sampleW + x;
      const gradient = Math.abs(lum[i + 1] - lum[i - 1]) + Math.abs(lum[i + sampleW] - lum[i - sampleW]);
      const cx = Math.min(cols - 1, Math.floor(x / cell));
      const cy = Math.min(gridRows - 1, Math.floor(y / cell));
      cells[cy * cols + cx] += gradient;
      counts[cy * cols + cx] += 1;
    }
  }
  for (let i = 0; i < cells.length; i += 1) {
    cells[i] = counts[i] ? cells[i] / counts[i] : 0;
  }

  detailGridCache = { key, cols, rows: gridRows, cellW: rect.w / cols, cellH: rect.h / gridRows, cells };
  return detailGridCache;
}

function detailInRect(area) {
  const grid = imageDetailGrid();
  if (!grid) return 0;
  const c0 = clamp(Math.floor(area.x / grid.cellW), 0, grid.cols - 1);
  const c1 = clamp(Math.ceil((area.x + area.w) / grid.cellW), 0, grid.cols - 1);
  const r0 = clamp(Math.floor(area.y / grid.cellH), 0, grid.rows - 1);
  const r1 = clamp(Math.ceil((area.y + area.h) / grid.cellH), 0, grid.rows - 1);
  let sum = 0;
  let n = 0;
  for (let r = r0; r <= r1; r += 1) {
    for (let c = c0; c <= c1; c += 1) {
      sum += grid.cells[r * grid.cols + c];
      n += 1;
    }
  }
  return n ? sum / n : 0;
}

function overlapArea(a, b) {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

function quietRectInPanel(panelRect, balloon, siblings) {
  const pad = 14;
  const anchors = [
    [0.0, 0.0], [0.5, 0.0], [1.0, 0.0],
    [0.0, 0.45], [1.0, 0.45],
    [0.0, 1.0], [0.5, 1.0], [1.0, 1.0]
  ];
  const others = siblings.concat(state.balloons);
  let best = null;
  anchors.forEach(([fx, fy], index) => {
    const x = panelRect.x + pad + fx * Math.max(0, panelRect.w - balloon.w - pad * 2);
    const y = panelRect.y + pad + fy * Math.max(0, panelRect.h - balloon.h - pad * 2);
    const rect = { x, y, w: balloon.w, h: balloon.h };
    const busy = detailInRect(rect);
    let overlap = 0;
    others.forEach((other) => { overlap += overlapArea(rect, other); });
    // Quiet art wins; collisions are heavily punished; top spots break ties.
    const score = busy + (overlap / (rect.w * rect.h)) * 60 + fy * 3 + (index % 2) * 0.4;
    if (!best || score < best.score) best = { rect, score };
  });
  return best ? best.rect : { x: panelRect.x + pad, y: panelRect.y + pad, w: balloon.w, h: balloon.h };
}

function figureClustersInPanel(panelRect) {
  const grid = imageDetailGrid();
  if (!grid) return [];
  const c0 = clamp(Math.floor((panelRect.x + panelRect.w * 0.06) / grid.cellW), 0, grid.cols - 1);
  const c1 = clamp(Math.ceil((panelRect.x + panelRect.w * 0.94) / grid.cellW), 0, grid.cols - 1);
  const r0 = clamp(Math.floor((panelRect.y + panelRect.h * 0.12) / grid.cellH), 0, grid.rows - 1);
  const r1 = clamp(Math.ceil((panelRect.y + panelRect.h * 0.95) / grid.cellH), 0, grid.rows - 1);

  const values = [];
  for (let r = r0; r <= r1; r += 1) {
    for (let c = c0; c <= c1; c += 1) values.push(grid.cells[r * grid.cols + c]);
  }
  if (!values.length) return [];
  const sorted = values.slice().sort((a, b) => a - b);
  const threshold = sorted[Math.floor(sorted.length * 0.72)];
  if (!threshold) return [];

  const cols = c1 - c0 + 1;
  const rowsN = r1 - r0 + 1;
  const seen = new Uint8Array(cols * rowsN);
  const clusters = [];

  for (let r = 0; r < rowsN; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const idx = r * cols + c;
      if (seen[idx]) continue;
      const value = grid.cells[(r + r0) * grid.cols + (c + c0)];
      if (value < threshold) { seen[idx] = 1; continue; }
      // flood-fill one connected high-detail region (a figure, usually)
      const stack = [idx];
      seen[idx] = 1;
      const members = [];
      while (stack.length) {
        const cur = stack.pop();
        const cr = Math.floor(cur / cols);
        const cc = cur % cols;
        const cellValue = grid.cells[(cr + r0) * grid.cols + (cc + c0)];
        if (cellValue < threshold) continue;
        members.push({ r: cr, c: cc, v: cellValue });
        [[cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]].forEach(([nr, nc]) => {
          if (nr < 0 || nr >= rowsN || nc < 0 || nc >= cols) return;
          const ni = nr * cols + nc;
          if (!seen[ni]) { seen[ni] = 1; stack.push(ni); }
        });
      }
      if (members.length < 3) continue;
      let weight = 0;
      let sumX = 0;
      members.sort((a, b) => a.r - b.r);
      members.forEach((m) => { weight += m.v * m.v; sumX += (m.c + c0 + 0.5) * grid.cellW * m.v * m.v; });
      // Head point: the weighted x of the cluster, at the top-quarter row of
      // the cluster - tails should reach for heads, not torsos.
      const headRow = members[Math.floor((members.length - 1) * 0.22)].r;
      clusters.push({
        weight,
        headX: clamp(sumX / weight, panelRect.x + 14, panelRect.x + panelRect.w - 14),
        headY: clamp((headRow + r0 + 0.5) * grid.cellH, panelRect.y + 14, panelRect.y + panelRect.h - 14)
      });
    }
  }
  return clusters;
}

function tailAimForBalloon(balloon, panelRect) {
  const fallback = { x: panelRect.x + panelRect.w / 2, y: panelRect.y + panelRect.h * 0.55 };
  const clusters = figureClustersInPanel(panelRect);
  if (!clusters.length) return fallback;
  const bx = balloon.x + balloon.w / 2;
  const by = balloon.y + balloon.h / 2;
  clusters.sort((a, b) => b.weight - a.weight);
  let pick = clusters[0];
  // A comparably-strong figure much nearer the balloon is the likelier speaker.
  clusters.slice(1).forEach((cluster) => {
    if (cluster.weight < pick.weight * 0.5) return;
    const dPick = Math.hypot(pick.headX - bx, pick.headY - by);
    const dCluster = Math.hypot(cluster.headX - bx, cluster.headY - by);
    if (dCluster < dPick * 0.72) pick = cluster;
  });
  return { x: pick.headX, y: pick.headY };
}

function shortenedTail(balloon, target, panelRect) {
  // Standards: tails are short and quiet - gesture toward the speaker's head
  // and stop well before crossing their body.
  const cx = balloon.x + balloon.w / 2;
  const cy = balloon.y + balloon.h / 2;
  const dx = target.x - cx;
  const dy = target.y - cy;
  const dist = Math.hypot(dx, dy) || 1;
  const edge = Math.min(balloon.w, balloon.h) / 2;
  const reach = Math.min(dist - 26, edge + Math.min(95, Math.max(24, (dist - edge) * 0.45)));
  const len = Math.max(edge + 14, reach);
  return {
    x: clamp(cx + (dx / dist) * len, panelRect.x + 8, panelRect.x + panelRect.w - 8),
    y: clamp(cy + (dy / dist) * len, panelRect.y + 8, panelRect.y + panelRect.h - 8)
  };
}

function makePlanBalloon(row, panelCount, siblings = []) {
  const panelRect = rectForPlanPanel(row.panel, panelCount);
  const preset = row.acting ? row.acting.tone : planPreset(row.type, row.text);
  const isSfx = /sfx/i.test(row.type);
  const isCaption = /caption/i.test(row.type);
  const isQuiet = /small|quiet/i.test(`${row.type} ${row.placement}`);
  const widthBase = isSfx ? 300 : isCaption ? 320 : 205;
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
  applyActing(balloon, row);
  if (balloon.hasTail && !isSfx && !isCaption) {
    // Standards: tails are short, clear, and quiet.
    balloon.tailWidth = Math.min(balloon.tailWidth || 20, 12);
  }
  if (!applyPageOneProfile(balloon, row.panel, panelRect)) {
    const position = (!row.placement && state.image)
      ? quietRectInPanel(panelRect, balloon, siblings)
      : rectFromPlacementHint(panelRect, balloon, row.placement);
    balloon.x = position.x;
    balloon.y = position.y;
    if (balloon.hasTail) {
      const aim = tailAimForBalloon(balloon, panelRect);
      const tail = shortenedTail(balloon, aim, panelRect);
      balloon.tailX = tail.x;
      balloon.tailY = tail.y;
    }
  }
  return balloon;
}

// ---------------------------------------------------------------------------
// Comic script parsing + acting engine.
// Lets the assistant accept a raw comic script (PAGE / PANEL / NAME: "line" /
// CAPTION: / SFX:) and "act out" each line: tone, intensity, and a consistent
// voice per speaker shape every balloon instead of one generic style.
// ---------------------------------------------------------------------------

const SCRIPT_LINE_SKIP = /^(\[|PAGE PURPOSE|PAGE-TURN|ARTIST NOTE|CONTINUITY|LETTERING|LAYOUT|PROMPT|NEGATIVE|STYLE|```|#|\||-{3,})/i;
const SCRIPT_RESERVED_NAMES = /^(PAGE|PANEL|CAPTION|SFX|NOTE|ID|ART|CAMERA|LOCATION|TIME)$/i;

function looksLikeComicScript(text) {
  const value = text || "";
  return /^\s*PANEL\s+\d+/im.test(value) || /^\s*PAGE\s+\d+/im.test(value) ||
    /^\s*[A-Z][A-Z0-9 .'-]{1,28}(?:\s*\([^)]*\))?\s*:\s*["“]/m.test(value);
}

function stripScriptQuotes(text) {
  return (text || "").trim().replace(/^["“]+/, "").replace(/["”]+$/, "").trim();
}

function parseComicScript(text) {
  const pages = [];
  const speakers = [];
  let currentPage = null;
  let currentPanel = 1;

  const ensurePage = (number) => {
    currentPage = pages.find((p) => p.page === number);
    if (!currentPage) {
      currentPage = { page: number, rows: [] };
      pages.push(currentPage);
    }
  };

  const pushRow = (type, rowText, speaker) => {
    const cleaned = stripScriptQuotes(rowText);
    if (!cleaned) return;
    if (!currentPage) ensurePage(1);
    const row = { panel: currentPanel, type, text: cleaned, placement: "", speaker: speaker || "" };
    row.acting = computeActing(type, speaker || "", cleaned);
    currentPage.rows.push(row);
    if (speaker && !speakers.includes(speaker)) speakers.push(speaker);
  };

  (text || "").split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line || SCRIPT_LINE_SKIP.test(line)) return;

    const pageMatch = line.match(/^PAGE\s+(\d+)/i);
    if (pageMatch) {
      ensurePage(Number.parseInt(pageMatch[1], 10));
      currentPanel = 1;
      return;
    }

    const panelMatch = line.match(/^PANEL\s+(\d+)/i);
    if (panelMatch) {
      currentPanel = Number.parseInt(panelMatch[1], 10);
      if (!currentPage) ensurePage(1);
      return;
    }

    const captionMatch = line.match(/^CAPTION\s*:\s*(.+)$/i);
    if (captionMatch) {
      pushRow("Caption", captionMatch[1]);
      return;
    }

    const sfxMatch = line.match(/^SFX\s*:\s*(.+)$/i);
    if (sfxMatch) {
      pushRow("SFX", sfxMatch[1]);
      return;
    }

    const speakerMatch = line.match(/^([A-Z][A-Z0-9 .'-]{1,28}?)(?:\s*\([^)]*\))?\s*:\s*(.+)$/);
    if (speakerMatch && !SCRIPT_RESERVED_NAMES.test(speakerMatch[1].trim())) {
      const name = speakerMatch[1].trim();
      // Real speaker names are shouted in caps in scripts; skip prose like "Note: ..."
      if (name === name.toUpperCase()) {
        pushRow("Balloon", speakerMatch[2], name);
      }
      return;
    }
    // Anything else is panel description - not lettering.
  });

  return { pages, speakers };
}

function computeActing(type, speaker, text) {
  const acting = { tone: "classic", intensity: 0, cold: false };
  if (/sfx/i.test(type)) {
    acting.tone = "sfx";
    acting.intensity = 1;
    return acting;
  }
  if (/caption/i.test(type)) {
    acting.tone = "caption";
    return acting;
  }

  const exclaims = (text.match(/!/g) || []).length;
  const letters = text.replace(/[^a-zA-Z]/g, "");
  const capsRatio = letters.length >= 4 ? (letters.replace(/[^A-Z]/g, "").length / letters.length) : 0;

  if (/ildkule|h[aá]logi|gi meg styrke|rune\b/i.test(text)) {
    acting.tone = "magic";
    acting.intensity = Math.min(1, 0.4 + exclaims * 0.3);
    return acting;
  }
  if (exclaims === 0 && /monster|never|hate|death|kill/i.test(text)) {
    acting.tone = "classic";
    acting.cold = true;
    return acting;
  }
  if (capsRatio > 0.6 || exclaims >= 2 || (/!/.test(text) && /[A-Z]{4,}/.test(text))) {
    acting.tone = "shout";
    acting.intensity = Math.min(1, 0.4 + exclaims * 0.3 + capsRatio * 0.4);
    return acting;
  }
  if (/^\.{3}|\.{3}$/.test(text.trim()) || /^\(.+\)$/.test(text.trim())) {
    acting.tone = /^\(.+\)$/.test(text.trim()) ? "thought" : "whisper";
    return acting;
  }
  acting.intensity = Math.min(1, exclaims * 0.35);
  if (acting.intensity > 0.3) acting.tone = "manga";
  return acting;
}

const SPEAKER_VOICE_TINTS = ["#fffdf4", "#fdf7ea", "#f3f7fb", "#faf3f0", "#f3f8f2", "#f7f3fa"];

function speakerVoice(speaker) {
  if (!state.assistant.speakerVoices) state.assistant.speakerVoices = {};
  const voices = state.assistant.speakerVoices;
  if (!voices[speaker]) {
    const index = Object.keys(voices).length % SPEAKER_VOICE_TINTS.length;
    voices[speaker] = { fill: SPEAKER_VOICE_TINTS[index], tailWidth: 16 + (index % 3) * 3 };
  }
  return voices[speaker];
}

function applyActing(balloon, row) {
  const acting = row.acting;
  if (!acting) return;
  balloon.speaker = row.speaker || "";

  if (row.speaker && !/sfx|caption/i.test(row.type)) {
    const voice = speakerVoice(row.speaker);
    balloon.fill = voice.fill;
    balloon.tailWidth = voice.tailWidth;
  }

  if (acting.cold) {
    // The icy stillness voice: pale, hard-edged, no wobble, faint glow.
    balloon.fill = "#eef3f7";
    balloon.strokeColor = "#40525e";
    balloon.textColor = "#22303a";
    balloon.wobble = 0;
    balloon.texture = 4;
    balloon.glow = 8;
    balloon.fontSize = Math.max(18, (balloon.fontSize || 23) - 2);
    return;
  }

  if (acting.intensity > 0) {
    balloon.wobble = Math.min(36, (balloon.wobble || 0) + Math.round(acting.intensity * 8));
    balloon.fontSize = (balloon.fontSize || 23) + Math.round(acting.intensity * 4);
    if (acting.intensity > 0.6) balloon.stroke = Math.min(12, (balloon.stroke || 3) + 1);
  }
}

function assistantApplyPlan() {
  const input = ui.assistantInput.value;
  let rows = parseLetteringPlan(input);
  let scriptInfo = null;

  if (!rows.length && looksLikeComicScript(input)) {
    scriptInfo = parseComicScript(input);
    if (scriptInfo.pages.length) rows = scriptInfo.pages[0].rows;
  }

  if (!rows.length) {
    assistantCards([{
      title: "Nothing To Letter",
      body: "Paste a comic script (PANEL 1 / NAME: \"line\" / CAPTION: / SFX:) or a plan table row like: | 1 | Caption, upper-left sky | \"The sea raged.\" |",
      warn: true
    }]);
    return { message: "No script or plan rows found", warn: true };
  }

  pushHistory();
  const panelCount = Math.max(...rows.map((row) => row.panel));
  const panelGuideResult = ensurePlanPanelGuides(panelCount);
  const created = [];
  rows.forEach((row) => created.push(makePlanBalloon(row, panelCount, created)));
  state.balloons.push(...created);
  const last = created[created.length - 1];
  if (last) select("balloon", last.id);
  render();
  updateChecks();

  const cards = [
    { title: scriptInfo ? "Script Lettered" : "Plan Applied", body: `${created.length} editable lettering object${created.length === 1 ? "" : "s"} created${scriptInfo ? " and acted out from the script" : " from the plan"}.` }
  ];
  if (scriptInfo && scriptInfo.speakers.length) {
    cards.push({ title: "Voices Cast", body: `Each speaker got a consistent voice: ${scriptInfo.speakers.join(", ")}. Shouts burst, whispers soften, incantations glow, cold lines go still.` });
  }
  if (scriptInfo && scriptInfo.pages.length > 1) {
    const first = scriptInfo.pages[0].page;
    const rest = scriptInfo.pages.slice(1).map((p) => p.page).join(", ");
    cards.push({ title: "One Page At A Time", body: `The script contained pages ${first} and ${rest}. Page ${first} was lettered - load the next page's art, then paste again for the rest.`, warn: true });
  }
  cards.push({ title: "Panel Guides", body: panelGuideResult.method === "image-gutters" ? "Panel guides were detected from the black gutters in the page art." : state.panels.length ? "Panel guides are active. Adjust them first if a band does not match the art exactly." : "Add panel guides for more accurate future placement." });
  cards.push({ title: "Human Pass", body: "Now drag tails, protect key art, and run Critique for overlap and pacing checks." });
  assistantCards(cards);
  setStatus(scriptInfo ? "Assistant lettered the script" : "Assistant applied lettering plan");
  return { message: `${created.length} lettering object${created.length === 1 ? "" : "s"} created` };
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
  syncScriptGeneratorInputs();
  updateActiveScriptOutput();
  return {
    app: "Proto Calder Comic Studio",
    version: 9,
    title: state.title,
    imageName: state.imageName,
    imageDataUrl: state.imageDataUrl,
    notes: state.notes,
    assistant: {
      input: ui.assistantInput.value,
      tone: ui.assistantToneInput.value,
      beats: state.assistant.beats
    },
    scriptGenerator: {
      source: state.scriptGenerator.source,
      pageNumber: state.scriptGenerator.pageNumber,
      panelCount: state.scriptGenerator.panelCount,
      pacing: state.scriptGenerator.pacing,
      activeTab: state.scriptGenerator.activeTab,
      outputs: state.scriptGenerator.outputs
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
      state.scriptGenerator = {
        ...state.scriptGenerator,
        ...(data.scriptGenerator || {}),
        outputs: {
          ...emptyScriptOutputs,
          ...((data.scriptGenerator && data.scriptGenerator.outputs) || {})
        }
      };
      if (!scriptGenTabs[state.scriptGenerator.activeTab]) state.scriptGenerator.activeTab = "script";
      syncScriptGenForm();
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
ui.tidyLetteringBtn.addEventListener("click", () => runAssistantAction("Tidying lettering", assistantTidyLettering, "Lettering tidied"));
if (hasDraftScriptGeneratorUi()) {
  ui.scriptGenBtn.addEventListener("click", () => setScriptGeneratorOpen(true));
  ui.scriptGenCloseBtn.addEventListener("click", () => setScriptGeneratorOpen(false));
  ui.scriptGenModal.addEventListener("pointerdown", (event) => {
    if (event.target === ui.scriptGenModal) setScriptGeneratorOpen(false);
  });
  ui.sgGenerateBtn.addEventListener("click", generateScriptPackage);
  ui.sgSendPlanBtn.addEventListener("click", () => sendGeneratedPlanToAssistant(true));
  ui.sgApplyPlanBtn.addEventListener("click", applyGeneratedPlanToCanvas);
  ui.sgTabs.forEach((button) => {
    button.addEventListener("click", () => setScriptGenTab(button.dataset.sgTab));
  });
  ui.sgOutput.addEventListener("input", updateActiveScriptOutput);
  ui.sgSourceInput.addEventListener("input", syncScriptGeneratorInputs);
  ui.sgPageInput.addEventListener("input", syncScriptGeneratorInputs);
  ui.sgPanelInput.addEventListener("input", syncScriptGeneratorInputs);
  ui.sgPacingInput.addEventListener("change", syncScriptGeneratorInputs);
  ui.sgCopyBtn.addEventListener("click", copyScriptGenOutput);
  ui.sgDownloadBtn.addEventListener("click", downloadScriptGenOutput);
}
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
  if (event.key === "Escape" && !ui.scriptGenModal.classList.contains("hidden")) {
    event.preventDefault();
    setScriptGeneratorOpen(false);
    return;
  }

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
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render());

// ---------------------------------------------------------------------------
// Script Generator - mimics the ai-comic-creator skill: turns a pasted
// manuscript into a panel-by-panel script, AI image prompts for every panel,
// and character reference sheet prompts, using the user's own AI API key.
// ---------------------------------------------------------------------------

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const SG_PROVIDER_STORAGE = "pccs_ai_provider";
const SG_API_KEY_STORAGE = {
  openai: "pccs_openai_api_key",
  claude: "pccs_claude_api_key"
};
const SG_PROVIDER_MODELS = {
  openai: [
    { value: "gpt-5.5", label: "GPT-5.5 (recommended)" },
    { value: "gpt-5.4", label: "GPT-5.4 (previous baseline)" },
    { value: "gpt-5.1", label: "GPT-5.1 (compatibility)" },
    { value: "gpt-4.1", label: "GPT-4.1 (legacy compatibility)" }
  ],
  claude: [
    { value: "claude-sonnet-5", label: "Claude Sonnet 5 (recommended)" },
    { value: "claude-opus-4-8", label: "Claude Opus 4.8 (highest quality, slower)" },
    { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 (fastest, cheapest)" }
  ]
};

const sgUi = {
  openBtn: document.getElementById("scriptGenBtn"),
  modal: document.getElementById("scriptGenModal"),
  closeBtn: document.getElementById("scriptGenCloseBtn"),
  manuscriptInput: document.getElementById("sgManuscriptInput"),
  artStyleInput: document.getElementById("sgArtStyleInput"),
  readingDirectionField: document.getElementById("sgReadingDirectionField"),
  readingDirectionInput: document.getElementById("sgReadingDirectionInput"),
  scopeInput: document.getElementById("sgScopeInput"),
  audienceInput: document.getElementById("sgAudienceInput"),
  toneInput: document.getElementById("sgToneInput"),
  trackerToggle: document.getElementById("sgTrackerToggle"),
  providerInput: document.getElementById("sgProviderInput"),
  apiKeyLabel: document.getElementById("sgApiKeyLabel"),
  apiKeyInput: document.getElementById("sgApiKeyInput"),
  modelInput: document.getElementById("sgModelInput"),
  generateBtn: document.getElementById("sgGenerateBtn"),
  status: document.getElementById("sgStatus"),
  statusText: document.getElementById("sgStatusText"),
  tabs: Array.from(document.querySelectorAll(".sg-tab")),
  panels: {
    script: document.getElementById("sgPanelScript"),
    prompts: document.getElementById("sgPanelPrompts"),
    characters: document.getElementById("sgPanelCharacters"),
    tracker: document.getElementById("sgPanelTracker")
  },
  copyBtn: document.getElementById("sgCopyBtn"),
  downloadBtn: document.getElementById("sgDownloadBtn"),
  sendPlanBtn: document.getElementById("sgSendPlanBtn"),
  applyPlanBtn: document.getElementById("sgApplyPlanBtn"),
  copyPlanBtn: document.getElementById("sgCopyPlanBtn")
};

state.scriptGen = {
  busy: false,
  activeTab: "script",
  results: { script: "", prompts: "", characters: "", tracker: "" }
};

const COMIC_SCRIPT_SYSTEM_PROMPT = [
  "You are an expert comic book writer and AI-art prompt engineer. You convert prose manuscripts into production-ready comic packages: a panel-by-panel script, AI image generation prompts for every panel, and character reference sheet prompts.",
  "",
  "SCRIPT FORMAT (always follow this exactly):",
  "PAGE [NUMBER] ([X] PANELS)",
  "",
  "PANEL [NUMBER] [ID: P[page]-[panel], e.g. P03-02]",
  "[Visual description of what the artist draws - action, setting, characters, positions, expressions, camera angle]",
  "[ARTIST NOTE: any special guidance, only when needed]",
  "CHARACTER NAME: \"dialogue\"",
  "CAPTION: \"narration text\"",
  "SFX: SOUND EFFECT",
  "",
  "Every page is explicitly numbered. Every panel is numbered within the page and given an ID like P03-02 (page 3, panel 2) - this ID must be reused identically in the image prompts section so the two stay linked.",
  "",
  "SCRIPT PRINCIPLES:",
  "- Show, don't tell: translate internal or narrated description into visual, filmable panel descriptions.",
  "- Vary panel size for pacing: big moments get big panels or splash pages; dialogue gets smaller panels.",
  "- Name the camera in every panel: WIDE SHOT, CLOSE-UP, EXTREME CLOSE-UP, BIRD'S EYE VIEW, LOW ANGLE, OVER THE SHOULDER, TWO SHOT, etc.",
  "- Limit dialogue to 2-3 lines per panel.",
  "- Use splash pages for the title page, the first reveal of a major character or creature, and the cliffhanger.",
  "- Vary panel transitions deliberately: action-to-action (fights, fast movement), moment-to-moment (suspense, a breath), subject-to-subject (dialogue cuts, reaction shots), scene-to-scene (time or location jumps), aspect-to-aspect (worldbuilding, calm establishing pages). Mixing these controls the page's rhythm.",
  "",
  "AI IMAGE PROMPT FORMULA (use for every panel prompt):",
  "[STYLE TAG], [SHOT TYPE], [SCENE/ACTION], [CHARACTERS with consistent visual tags], [SETTING DETAILS], [MOOD/LIGHTING], [QUALITY TAGS], then a negative prompt line, then parameters.",
  "",
  "STYLE TAGS BY ART STYLE:",
  "Manga (black & white): 'manga panel, black and white ink, detailed linework, professional manga art, clean lines, expressive faces, manga screentone shading, dynamic composition' with parameters '--ar 3:4 --style raw --v 6'.",
  "Western comic (full color): 'comic book art, full color, cel shading, bold outlines, dynamic illustration, Marvel Comics style, vibrant colors, detailed backgrounds' with parameters '--ar 2:3 --style raw --v 6'.",
  "Webtoon (vertical, full color): 'webtoon art style, full color, clean digital art, bright palette, K-webtoon style, smooth linework, expressive characters, soft shading' with parameters '--ar 9:16 --v 6'.",
  "",
  "SHOT TYPE KEYWORDS: wide establishing shot, medium shot, medium close-up, close-up portrait, extreme close-up, bird's eye view/top-down angle, low angle looking up, over-the-shoulder shot, two-shot face to face, full body shot, panoramic wide shot.",
  "",
  "MOOD/LIGHTING KEYWORDS: dramatic (dramatic side lighting, harsh shadows, high contrast, ominous atmosphere); action/battle (dynamic motion blur, speed lines, explosive energy, impact shockwave, dust and debris); peaceful/warm (soft golden hour light, warm tones, gentle shadows, serene atmosphere); horror/dread (cold blue-green lighting, deep shadows, eerie mist, unsettling stillness); epic/divine (godlike scale, radiant light beams, awe-inspiring, monumental composition); emotional/intimate (soft diffused light, quiet moment, gentle warmth, close and personal).",
  "",
  "CHARACTER VISUAL TAGS: for every named character, write a short consistent tag the first time they appear in full - '[NAME] ([age/build], [skin tone], [hair: color+style], [eyes], [clothing])' - and reuse that exact tag (or a shortened but consistent version) every time the character appears in later prompts. AI art drifts across many panels unless the same words are repeated.",
  "",
  "NEGATIVE PROMPTS BY STYLE (append to every prompt):",
  "Manga: '--no color, watermark, blurry, low quality, extra limbs, deformed anatomy, bad hands, extra fingers, duplicate, ugly, text overlay, realistic photo, 3D render, western comic style'.",
  "Western comic: '--no watermark, blurry, low quality, extra limbs, deformed, bad hands, realistic photo, manga style, anime, sketch, unfinished'.",
  "Webtoon: '--no watermark, blurry, low quality, extra limbs, deformed, bad hands, sketchy lines, unfinished, dark colors, heavy shadows'.",
  "",
  "CHARACTER REFERENCE SHEET PROMPT FORMAT:",
  "CHARACTER: [NAME]",
  "REFERENCE PROMPT: character reference sheet, [character name], [detailed physical description], [clothing/armor], [defining visual features], [art style tags], front view and 3/4 view, expression sheet (happy/sad/angry/surprised/determined/neutral), clean white background, labeled poses, [quality tags], then the style's parameters.",
  "NEVER CHANGE: the 2-4 most identity-defining visual traits for this character (e.g. a scar, a signature weapon, a hair color) - repeat these exact words in every panel prompt where the character appears, since that is what keeps them recognizable across many AI-generated panels.",
  "",
  "Always write in plain text only. Do not use markdown headers, bold, or code fences anywhere in your output unless a specific instruction asks for a markdown table."
].join("\n");

function sgArtStyleLabel(style) {
  if (style === "manga") return "Manga (black and white)";
  if (style === "webtoon") return "Webtoon (vertical scroll, full color)";
  return "Western comic (full color)";
}

function sgScopeLabel(scope) {
  if (scope === "opening") return "just the opening (first 1-3 chapters)";
  if (scope === "full-issue") return "a full standard issue (22-24 pages / 18-24 manga pages / 30-60 webtoon panels)";
  return "whatever scope best fits the provided manuscript text";
}

function sgConfigSummary(config) {
  const lines = [
    `Art style: ${sgArtStyleLabel(config.artStyle)}`,
    config.artStyle === "manga"
      ? `Reading direction: ${config.readingDirection === "rtl" ? "right-to-left (traditional manga)" : "left-to-right"}`
      : null,
    `Scope: ${sgScopeLabel(config.scope)}`,
    `Audience: ${config.audience}`,
    config.tone ? `Tone reference: ${config.tone}` : null
  ].filter(Boolean);
  return lines.join("\n");
}

function sgActiveProvider() {
  return sgUi.providerInput && sgUi.providerInput.value === "claude" ? "claude" : "openai";
}

function sgProviderLabel(provider) {
  return provider === "claude" ? "Claude" : "OpenAI";
}

function sgStoredApiKey(provider) {
  const keyName = SG_API_KEY_STORAGE[provider] || SG_API_KEY_STORAGE.openai;
  const sessionKey = sessionStorage.getItem(keyName) || "";
  const legacyKey = localStorage.getItem(keyName) || "";
  if (!sessionKey && legacyKey) {
    sessionStorage.setItem(keyName, legacyKey);
    localStorage.removeItem(keyName);
    return legacyKey;
  }
  return sessionKey;
}

function sgStoreApiKey(provider, value) {
  const keyName = SG_API_KEY_STORAGE[provider] || SG_API_KEY_STORAGE.openai;
  sessionStorage.setItem(keyName, value.trim());
  localStorage.removeItem(keyName);
}

function syncSgProviderUi(preserveModel = false) {
  const provider = sgActiveProvider();
  const currentModel = preserveModel ? sgUi.modelInput.value : "";
  const models = SG_PROVIDER_MODELS[provider] || SG_PROVIDER_MODELS.openai;
  sgUi.modelInput.innerHTML = models
    .map((model) => `<option value="${model.value}">${model.label}</option>`)
    .join("");
  if (currentModel && models.some((model) => model.value === currentModel)) {
    sgUi.modelInput.value = currentModel;
  }
  if (sgUi.apiKeyLabel) sgUi.apiKeyLabel.textContent = `${sgProviderLabel(provider)} API key`;
  sgUi.apiKeyInput.placeholder = provider === "claude" ? "sk-ant-..." : "sk-...";
  sgUi.apiKeyInput.value = sgStoredApiKey(provider);
}

function sgReadCurrentConfig() {
  return {
    artStyle: sgUi.artStyleInput.value,
    readingDirection: sgUi.readingDirectionInput.value,
    scope: sgUi.scopeInput.value,
    audience: sgUi.audienceInput.value,
    tone: sgUi.toneInput.value.trim(),
    tracker: sgUi.trackerToggle.checked
  };
}

function sgBuildPlanPrompt(manuscript, config) {
  return [
    "STEP 1 - Read the manuscript below and plan a comic adaptation.",
    "",
    "PRODUCTION SETTINGS:",
    sgConfigSummary(config),
    "",
    "Extract and summarize (be concise but specific):",
    "- Characters: name, physical description, personality, clothing, unique visual traits",
    "- World/setting: time period, architecture, technology, color/mood palette",
    "- Tone: overall mood",
    "- Magic/powers/special abilities and how they look visually, if any",
    "- The strongest possible opening hook moment",
    "- Key scenes worth adapting, in story order",
    "",
    "Then propose a page-by-page (or panel-count, for webtoon) breakdown mapping which story beats land on which pages, matching the requested scope. Keep this plan concise - it is an internal outline, not the final script.",
    "",
    "MANUSCRIPT:",
    manuscript
  ].join("\n");
}

function sgBuildScriptPrompt(plan, config) {
  return [
    "STEP 2 - Using the outline below, write the full panel-by-panel comic script.",
    "",
    "PRODUCTION SETTINGS:",
    sgConfigSummary(config),
    "",
    "Follow the SCRIPT FORMAT and SCRIPT PRINCIPLES exactly as defined in your instructions. Give every panel an ID (P[page]-[panel]). Vary panel transitions deliberately. Output ONLY the script text, starting at PAGE 1.",
    "",
    "OUTLINE:",
    plan
  ].join("\n");
}

function sgBuildImagePromptsPrompt(script, config) {
  return [
    "STEP 3 - Using the finished script below, write an AI image generation prompt for every single panel.",
    "",
    "PRODUCTION SETTINGS:",
    sgConfigSummary(config),
    "",
    "Follow the AI IMAGE PROMPT FORMULA, STYLE TAGS, SHOT TYPE KEYWORDS, MOOD/LIGHTING KEYWORDS, CHARACTER VISUAL TAGS, and NEGATIVE PROMPTS BY STYLE exactly as defined in your instructions, matched to the chosen art style. Reuse each panel's exact ID from the script. Organize output by page, formatted like:",
    "PAGE 1 - PANEL 1 [ID: P01-01]",
    "[full prompt]",
    "[negative prompt line]",
    "",
    "Output ONLY the prompts, no extra commentary.",
    "",
    "SCRIPT:",
    script
  ].join("\n");
}

function sgBuildCharacterPrompt(script, config) {
  return [
    "STEP 4 - Using the script below, identify every named character who appears more than once and write a character reference sheet prompt for each.",
    "",
    "PRODUCTION SETTINGS:",
    sgConfigSummary(config),
    "",
    "Follow the CHARACTER REFERENCE SHEET PROMPT FORMAT exactly as defined in your instructions, matched to the chosen art style's tags and parameters. Output one entry per character, in the CHARACTER / REFERENCE PROMPT / NEVER CHANGE format. Output ONLY the character sheets, no extra commentary.",
    "",
    "SCRIPT:",
    script
  ].join("\n");
}

function sgBuildTrackerFromScript(script) {
  const rows = [];
  let currentPage = "";
  script.split("\n").forEach((line) => {
    const pageMatch = line.match(/PAGE\s+(\d+)/i);
    if (pageMatch) currentPage = pageMatch[1];
    const panelMatch = line.match(/PANEL\s+\d+\s*\[ID:\s*([A-Za-z0-9-]+)\]/i);
    if (panelMatch) rows.push({ id: panelMatch[1], page: currentPage });
  });
  if (!rows.length) return "";
  const header = "| Panel ID | Page | Status | Notes |\n| --- | --- | --- | --- |";
  const body = rows.map((row) => `| ${row.id} | ${row.page} | Not started | |`).join("\n");
  return `${header}\n${body}`;
}

function extractOpenAIResponseText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") parts.push(content.text);
      else if (content.text && typeof content.text.value === "string") parts.push(content.text.value);
    }
  }

  const fallback = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (typeof fallback === "string") parts.push(fallback);
  return parts.join("\n").trim();
}

async function callOpenAI(apiKey, model, system, userText, maxTokens) {
  const body = {
    model,
    instructions: system,
    input: userText,
    max_output_tokens: maxTokens
  };
  if (/^gpt-5/i.test(model)) body.reasoning = { effort: "medium" };

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorBody.slice(0, 300)}`);
  }
  const data = await response.json();
  const text = extractOpenAIResponseText(data);
  if (!text) throw new Error("OpenAI returned an empty response.");
  return text;
}

async function callClaude(apiKey, model, system, userText, maxTokens) {
  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userText }]
    })
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errorBody.slice(0, 300)}`);
  }
  const data = await response.json();
  return (data.content || []).map((block) => block.text || "").join("\n").trim();
}

function callAiProvider(provider, apiKey, model, system, userText, maxTokens) {
  if (provider === "claude") return callClaude(apiKey, model, system, userText, maxTokens);
  return callOpenAI(apiKey, model, system, userText, maxTokens);
}

function setSgStatus(message, mode = "idle") {
  sgUi.statusText.textContent = message;
  sgUi.status.classList.toggle("busy", mode === "busy");
  sgUi.status.classList.toggle("error", mode === "error");
}

function setSgBusy(isBusy, message = "") {
  state.scriptGen.busy = isBusy;
  sgUi.generateBtn.disabled = isBusy;
  if (message) setSgStatus(message, isBusy ? "busy" : "idle");
}

function renderSgResults() {
  const results = state.scriptGen.results;
  sgUi.panels.script.textContent = results.script;
  sgUi.panels.prompts.textContent = results.prompts;
  sgUi.panels.characters.textContent = results.characters;
  sgUi.panels.tracker.textContent = results.tracker;
}

function sgCleanLetteringText(value) {
  return String(value || "")
    .replace(/^[-*]\s+/, "")
    .replace(/^CAPTION:\s*/i, "")
    .replace(/^SFX:\s*/i, "")
    .replace(/^[A-Z][A-Z0-9' -]{1,32}:\s*/i, "")
    .replace(/^["'\u201c\u201d]+|["'\u201c\u201d]+$/g, "")
    .replace(/\|/g, "/")
    .trim();
}

function sgFirstUsefulLine(lines) {
  return lines.map(sgCleanLetteringText).find(Boolean) || "";
}

function sgLetteringPlacement(panelNumber, panelCount, type, text, visual) {
  const value = `${type} ${text} ${visual}`.toLowerCase();
  if (/sfx/i.test(type)) {
    if (/rope|snap|crack|wood|break|splinter/.test(value)) return "Beside the break, action visible";
    return "Near impact, not over key action";
  }
  if (/balloon/i.test(type)) {
    if (/draugen|eye|whisper/.test(value)) return "Left negative space, tail to speaker";
    return panelNumber % 2 ? "Upper-left negative space, tail to speaker" : "Upper-right negative space, tail to speaker";
  }
  if (panelNumber === 1) return "Upper-left sky";
  if (panelNumber === panelCount) return "Upper-right sky/negative space";
  if (/window|door|sky|sea/.test(value)) return "Right/window negative space";
  return panelNumber % 2 ? "Upper-left negative space" : "Upper-right negative space";
}

function sgPanelsFromScript(script) {
  const panels = [];
  let current = null;

  for (const rawLine of String(script || "").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const panelMatch = line.match(/^PANEL\s+(\d+)/i);
    if (panelMatch) {
      if (current) panels.push(current);
      current = {
        panel: Number.parseInt(panelMatch[1], 10),
        visual: [],
        captions: [],
        dialogue: [],
        sfx: []
      };
      continue;
    }
    if (!current) continue;
    if (/^CAPTION\s*:/i.test(line)) current.captions.push(line);
    else if (/^SFX\s*:/i.test(line)) current.sfx.push(line);
    else if (/^[A-Z][A-Z0-9' -]{1,32}\s*:\s*["\u201c]/i.test(line)) current.dialogue.push(line);
    else if (!/^\[?ARTIST NOTE/i.test(line)) current.visual.push(line);
  }

  if (current) panels.push(current);
  return panels.filter((panel) => Number.isFinite(panel.panel));
}

function sgLetteringPlanFromScript(script) {
  const panels = sgPanelsFromScript(script);
  if (!panels.length) return "";
  const panelCount = Math.max(...panels.map((panel) => panel.panel));
  const rows = ["| Panel | Type | Text | Placement |", "|---|---|---|---|"];

  for (const panel of panels) {
    const visual = panel.visual.join(" ");
    const items = [];
    for (const value of panel.sfx) items.push({ type: "SFX", text: sgCleanLetteringText(value) });
    for (const value of panel.dialogue) items.push({ type: "Balloon", text: sgCleanLetteringText(value) });
    for (const value of panel.captions) items.push({ type: "Caption", text: sgCleanLetteringText(value) });
    if (!items.length && visual) items.push({ type: "Caption", text: sgFirstUsefulLine(panel.visual) });

    for (const item of items) {
      if (!item.text) continue;
      const placement = sgLetteringPlacement(panel.panel, panelCount, item.type, item.text, visual);
      rows.push(`| ${panel.panel} | ${item.type} | "${item.text}" | ${placement} |`);
    }
  }

  return rows.length > 2 ? rows.join("\n") : "";
}

function sgCurrentLetteringPlan() {
  const script = state.scriptGen.results.script || (sgUi.panels.script && sgUi.panels.script.textContent) || "";
  return sgLetteringPlanFromScript(script);
}

function sgSendLetteringPlanToAssistant(showStatus = true) {
  const plan = sgCurrentLetteringPlan();
  if (!plan) {
    setSgStatus("Generate a script first, then send the lettering plan.", "error");
    return false;
  }
  ui.assistantInput.value = plan;
  ui.assistantToneInput.value = "auto";
  state.assistant.beats = [];
  assistantCards([
    { title: "Generated Plan Sent", body: "The script output is now in Studio Assistant as an editable lettering plan." },
    { title: "Next", body: "Apply the plan, then run Detect Panel Guides and Tidy Lettering against the page art." }
  ]);
  if (showStatus) {
    setSgStatus("Lettering plan sent to Assistant");
    setStatus("Generated plan ready in Assistant");
  }
  return true;
}

function sgApplyLetteringPlanToCanvas() {
  if (!sgSendLetteringPlanToAssistant(false)) return;
  sgUi.modal.classList.add("hidden");
  runAssistantAction("Applying generated lettering plan", assistantApplyPlan, "Generated lettering applied");
}

function sgCopyLetteringPlan() {
  const plan = sgCurrentLetteringPlan();
  if (!plan) {
    setSgStatus("No lettering plan to copy yet.", "error");
    return;
  }
  navigator.clipboard.writeText(plan)
    .then(() => setSgStatus("Lettering plan copied"))
    .catch(() => setSgStatus("Could not copy lettering plan", "error"));
}

async function runScriptGenerator() {
  if (state.scriptGen.busy) return;
  const manuscript = sgUi.manuscriptInput.value.trim();
  const provider = sgActiveProvider();
  const apiKey = sgUi.apiKeyInput.value.trim();
  if (!manuscript) {
    setSgStatus("Paste manuscript text first", "error");
    return;
  }
  if (!apiKey) {
    setSgStatus(`Enter your ${sgProviderLabel(provider)} API key first`, "error");
    return;
  }

  sgStoreApiKey(provider, apiKey);
  localStorage.setItem(SG_PROVIDER_STORAGE, provider);
  const config = sgReadCurrentConfig();
  const model = sgUi.modelInput.value;

  try {
    setSgBusy(true, "Step 1/4: Reading manuscript and planning...");
    const plan = await callAiProvider(provider, apiKey, model, COMIC_SCRIPT_SYSTEM_PROMPT, sgBuildPlanPrompt(manuscript, config), 4000);

    setSgBusy(true, "Step 2/4: Writing full script...");
    const script = await callAiProvider(provider, apiKey, model, COMIC_SCRIPT_SYSTEM_PROMPT, sgBuildScriptPrompt(plan, config), 8000);

    setSgBusy(true, "Step 3/4: Generating AI image prompts...");
    const prompts = await callAiProvider(provider, apiKey, model, COMIC_SCRIPT_SYSTEM_PROMPT, sgBuildImagePromptsPrompt(script, config), 8000);

    setSgBusy(true, "Step 4/4: Building character reference sheets...");
    const characters = await callAiProvider(provider, apiKey, model, COMIC_SCRIPT_SYSTEM_PROMPT, sgBuildCharacterPrompt(script, config), 4000);

    const tracker = config.tracker ? sgBuildTrackerFromScript(script) : "";

    state.scriptGen.results = { script, prompts, characters, tracker };
    renderSgResults();
    setSgBusy(false, "Comic package ready");
  } catch (error) {
    setSgBusy(false);
    setSgStatus((error && error.message) || "Generation failed", "error");
  }
}

if (sgUi.providerInput) {
  const storedProvider = localStorage.getItem(SG_PROVIDER_STORAGE);
  sgUi.providerInput.value = storedProvider === "claude" ? "claude" : "openai";
}
syncSgProviderUi(true);

sgUi.providerInput.addEventListener("change", () => {
  localStorage.setItem(SG_PROVIDER_STORAGE, sgActiveProvider());
  syncSgProviderUi(false);
  setSgStatus(`${sgProviderLabel(sgActiveProvider())} selected`);
});

sgUi.apiKeyInput.addEventListener("change", () => {
  sgStoreApiKey(sgActiveProvider(), sgUi.apiKeyInput.value.trim());
});

sgUi.openBtn.addEventListener("click", () => sgUi.modal.classList.remove("hidden"));
sgUi.closeBtn.addEventListener("click", () => sgUi.modal.classList.add("hidden"));
sgUi.modal.addEventListener("click", (event) => {
  if (event.target === sgUi.modal) sgUi.modal.classList.add("hidden");
});

sgUi.artStyleInput.addEventListener("change", () => {
  sgUi.readingDirectionField.classList.toggle("hidden", sgUi.artStyleInput.value !== "manga");
});

sgUi.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    sgUi.tabs.forEach((t) => t.classList.toggle("active", t === tab));
    Object.entries(sgUi.panels).forEach(([key, el]) => el.classList.toggle("active", key === tab.dataset.sgTab));
    state.scriptGen.activeTab = tab.dataset.sgTab;
  });
});

sgUi.copyBtn.addEventListener("click", async () => {
  const text = state.scriptGen.results[state.scriptGen.activeTab] || "";
  if (!text) return;
  await navigator.clipboard.writeText(text);
  setSgStatus("Copied to clipboard");
});

sgUi.downloadBtn.addEventListener("click", () => {
  const r = state.scriptGen.results;
  if (!r.script && !r.prompts && !r.characters) {
    setSgStatus("Nothing to download yet", "error");
    return;
  }
  const sections = [
    "# Comic Script", "", r.script, "",
    "# AI Image Prompts", "", r.prompts, "",
    "# Character Reference Prompts", "", r.characters
  ];
  if (r.tracker) sections.push("", "# Panel Tracker", "", r.tracker);
  const blob = new Blob([sections.join("\n")], { type: "text/markdown" });
  downloadBlob(blob, `${safeFileName(state.title || "comic")}_script_package.md`);
});

if (sgUi.sendPlanBtn) sgUi.sendPlanBtn.addEventListener("click", () => sgSendLetteringPlanToAssistant(true));
if (sgUi.applyPlanBtn) sgUi.applyPlanBtn.addEventListener("click", sgApplyLetteringPlanToCanvas);
if (sgUi.copyPlanBtn) sgUi.copyPlanBtn.addEventListener("click", sgCopyLetteringPlan);

sgUi.generateBtn.addEventListener("click", runScriptGenerator);

// ---------------------------------------------------------------------------
// Panel Fine-Tuner - builds corrected re-generation prompts for panels that
// came back with common AI art defects (bad hands, warped proportions, extra
// eyeballs, uncanny faces, style drift, etc). Local rule-based fix by default,
// optional AI refinement through the same Claude API key as the generator.
// ---------------------------------------------------------------------------

const ftUi = {
  promptInput: document.getElementById("ftPromptInput"),
  noteInput: document.getElementById("ftNoteInput"),
  output: document.getElementById("ftOutput"),
  buildBtn: document.getElementById("ftBuildBtn"),
  aiBtn: document.getElementById("ftAiBtn"),
  copyBtn: document.getElementById("ftCopyBtn"),
  defects: {
    hands: document.getElementById("ftFixHands"),
    proportions: document.getElementById("ftFixProportions"),
    eyes: document.getElementById("ftFixEyes"),
    face: document.getElementById("ftFixFace"),
    text: document.getElementById("ftFixText"),
    style: document.getElementById("ftFixStyle"),
    background: document.getElementById("ftFixBackground"),
    consistency: document.getElementById("ftFixConsistency")
  }
};

const FT_FIX_LIBRARY = {
  hands: {
    label: "hands/fingers",
    positive: "anatomically correct human hands, exactly five fingers per hand, hands naturally proportional to the body",
    negative: "extra fingers, fused fingers, missing fingers, malformed hands, bad hands, oversized hands, tiny hands"
  },
  proportions: {
    label: "body proportions",
    positive: "realistic human body proportions, anatomically correct figure, consistent limb lengths, correctly sized head",
    negative: "deformed anatomy, distorted proportions, elongated limbs, oversized head, extra limbs, twisted torso, warped body"
  },
  eyes: {
    label: "eyes",
    positive: "exactly two symmetrical eyes with matching natural pupils, coherent gaze direction",
    negative: "extra eyes, extra eyeballs, third eye, asymmetric eyes, crossed eyes, extra pupils, misaligned eyes, floating eyes"
  },
  face: {
    label: "uncanny face",
    positive: "natural facial structure, lifelike skin texture, believable human expression",
    negative: "uncanny valley, glassy eyes, plastic skin, doll face, airbrushed skin, melted facial features, distorted face"
  },
  text: {
    label: "unwanted text",
    positive: "clean artwork with no lettering",
    negative: "text, letters, words, speech bubbles, captions, written text, typography, watermark, signature"
  },
  style: {
    label: "style drift",
    positive: "one single consistent art style throughout the image",
    negative: "mixed art styles, style drift, photorealistic bleed, 3D render, clashing rendering styles"
  },
  background: {
    label: "background loss",
    positive: "fully detailed coherent background that matches the described scene",
    negative: "white background, empty background, missing background, plain backdrop, vanishing environment"
  },
  consistency: {
    label: "character drift",
    positive: "character exactly matching the established reference design, identical hair color, identical facial features, identical outfit",
    negative: "inconsistent face, changed hair color, random costume changes, different character appearance, off-model character"
  }
};

function ftSelectedDefects() {
  return Object.keys(FT_FIX_LIBRARY).filter((key) => ftUi.defects[key] && ftUi.defects[key].checked);
}

function ftSplitPrompt(raw) {
  const lines = raw.split("\n").map((line) => line.trim()).filter(Boolean);
  const negativeLines = [];
  const promptLines = [];
  lines.forEach((line) => {
    if (/^(--no\s|negative prompt\s*:)/i.test(line)) negativeLines.push(line.replace(/^(--no\s+|negative prompt\s*:\s*)/i, ""));
    else promptLines.push(line);
  });
  return { prompt: promptLines.join(" "), negatives: negativeLines.join(", ") };
}

function ftMergeTokens(...lists) {
  const seen = new Set();
  const out = [];
  lists.join(", ").split(",").map((t) => t.trim()).filter(Boolean).forEach((token) => {
    const key = token.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(token);
  });
  return out.join(", ");
}

function ftBuildFixPrompt() {
  const raw = ftUi.promptInput.value.trim();
  const defects = ftSelectedDefects();
  const note = ftUi.noteInput.value.trim();
  if (!raw) {
    setSgStatus("Paste the original panel prompt first", "error");
    return;
  }
  if (!defects.length && !note) {
    setSgStatus("Tick at least one defect or describe the issue", "error");
    return;
  }
  const { prompt, negatives } = ftSplitPrompt(raw);
  const positives = defects.map((key) => FT_FIX_LIBRARY[key].positive);
  const negativeAdds = defects.map((key) => FT_FIX_LIBRARY[key].negative);
  if (note) negativeAdds.push(note);
  const corrected = `${ftMergeTokens(prompt, positives.join(", "))}\n--no ${ftMergeTokens(negatives, negativeAdds.join(", "))}`;
  ftUi.output.value = corrected;
  setSgStatus(`Fix prompt built (${defects.length} defect group${defects.length === 1 ? "" : "s"})`);
}

async function ftAiRefine() {
  const raw = ftUi.promptInput.value.trim();
  const defects = ftSelectedDefects();
  const note = ftUi.noteInput.value.trim();
  const apiKey = sgUi.apiKeyInput.value.trim();
  if (!raw) {
    setSgStatus("Paste the original panel prompt first", "error");
    return;
  }
  if (!defects.length && !note) {
    setSgStatus("Tick at least one defect or describe the issue", "error");
    return;
  }
  if (!apiKey) {
    setSgStatus("Enter your Claude API key first (used for AI refine)", "error");
    return;
  }
  const defectSummary = defects.map((key) => FT_FIX_LIBRARY[key].label).join(", ");
  const system = "You are an expert AI-art prompt engineer. You repair image generation prompts whose output came back with anatomical or stylistic defects. Rewrite the given prompt so the defect cannot recur: strengthen the relevant positive constraints, keep every scene, character, style, and parameter detail intact, and merge (never duplicate) negative prompt tokens. Reply with ONLY the corrected prompt followed by a single '--no' negative prompt line. No commentary.";
  const user = [
    `ORIGINAL PROMPT:\n${raw}`,
    defectSummary ? `DEFECTS OBSERVED: ${defectSummary}` : null,
    note ? `SPECIFIC ISSUE: ${note}` : null
  ].filter(Boolean).join("\n\n");
  try {
    ftUi.aiBtn.disabled = true;
    setSgStatus("AI refining fix prompt...", "busy");
    const refined = await callClaude(apiKey, sgUi.modelInput.value, system, user, 2000);
    ftUi.output.value = refined;
    setSgStatus("AI-refined fix prompt ready");
  } catch (error) {
    setSgStatus((error && error.message) || "AI refine failed", "error");
  } finally {
    ftUi.aiBtn.disabled = false;
  }
}

ftUi.buildBtn.addEventListener("click", ftBuildFixPrompt);
ftUi.aiBtn.addEventListener("click", ftAiRefine);
ftUi.copyBtn.addEventListener("click", async () => {
  if (!ftUi.output.value) return;
  await navigator.clipboard.writeText(ftUi.output.value);
  setSgStatus("Corrected prompt copied");
});
