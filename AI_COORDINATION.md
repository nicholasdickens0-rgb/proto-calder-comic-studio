# AI Coordination Notes

Two AI assistants work on this repo from different clones:

- **Claude Code** — clone at `Downloads\Ai comic file\proto-calder-comic-studio`
- **Codex** — clone at `Documents\Codex\2026-06-19\ai-comic-production-kit-plugin-ai\proto-calder-comic-studio`

Both push to `origin/main`. **Always `git pull --ff-only` before pushing.** If a push is
rejected, rebase — never force-push (it would erase the other assistant's work).

## State of the app (as of commit 152b453)

### Feature history, by author

| Commit | Author | What it added |
|---|---|---|
| a5f2890 | Claude | Script Generator modal: manuscript → script / image prompts / character sheets via user's API key |
| 5359cc3 | Codex | Lettering-plan bridge: Send/Apply/Copy Lettering Plan buttons from generator output |
| 0554bd9 | Claude | Panel Fine-Tuner: defect checkboxes → corrected re-generation prompt (in the modal) |
| 7b31a10 | Codex | OpenAI as second AI provider (provider select + key label + models) |
| 32e992b | Claude | **Script parser + acting engine** (see below — please preserve) |
| 2b824c0 | Claude | Page 7 sample image committed to `sample-pages/` (Load Page 7 Clean was 404ing on Pages) |
| bde8057 | Claude | Art-aware lettering: white/hairline gutter detection, detail-map placement, Comic Neue uppercase lettering |
| 152b453 | Claude | Tails aim at speaker heads via figure-cluster detection, shortened reach |

### The core loop (user's top priority — do not regress)

The user's main workflow is: **paste a comic script → "Letter Page" → editable, acted-out
balloons on the canvas.** The Studio Assistant textarea accepts three formats, tried in
this order in `assistantApplyPlan()`:

1. Lettering-plan tables (`| panel | type | text | placement |`) — `parseLetteringPlan()`
2. **Raw comic script** (`PAGE n` / `PANEL n [ID: ...]` / `NAME: "line"` / `CAPTION:` / `SFX:`)
   — `looksLikeComicScript()` + `parseComicScript()`
3. Plain dialogue (via Split/Create buttons)

### Key subsystems added at the end of app.js

- **Acting engine** (`computeActing`, `applyActing`, `speakerVoice`): every parsed line
  gets a performance — shouts burst (wobble/stroke/size up), whispers soften, incantations
  (`ildkule`, `hálogi`, `rune`) get the magic preset, cold menace lines (monster/never/
  hate/kill without `!`) get a pale icy still style, and each SPEAKER gets a consistent
  subtle fill tint (`SPEAKER_VOICE_TINTS`).
- **Art analysis** (`imageDetailGrid`, `detailInRect`, `quietRectInPanel`,
  `figureClustersInPanel`, `tailAimForBalloon`, `shortenedTail`): a cached edge-density
  grid of the page art. Balloons are placed in the *quietest* area of their panel and
  avoid each other; tails aim at the *head-height of the strongest figure cluster*
  (nearest comparable cluster wins ties) and stop ~95px past the balloon edge.
  `detailGridCache` is keyed on imageName + page size.
- **Panel detection** (`detectedPanelRectsFromImage`): now accepts white/paper gutters
  (`brightFraction >= 0.88`) as well as black, and hairline seams (`minGutterH = 2`).
  This made 6-panel painterly pages detect correctly.
- **Typography**: dialogue renders in "Comic Neue" bold UPPERCASE (`balloonDisplayText`),
  loaded via Google Fonts in index.html with a `document.fonts.ready` re-render.
  Captions keep written case.

### Agreed roadmap (discussed with the user, not yet built)

The user finds the UI overloaded ("bells and whistles"). Planned lean-out — **coordinate
before starting, it touches everything**:

1. Script Generator modal → tabs: Generate / Fine-Tuner, with provider/API-key/model
   moved into a settings drawer (set once, localStorage).
2. Output actions 5 → 3 buttons (Copy, Download, one "Send to Lettering").
3. Left panel: collapsible sections, plain-language assistant button labels.
4. Split app.js (~4,300 lines) into modules: core canvas / assistant / scriptgen /
   finetune, plain script tags, no build step (GitHub Pages constraint).

### Known limitations (fine to improve, carefully)

- Tail speaker-matching is heuristic (figures, not named characters); user drags fix rare
  misses. Multi-figure separated panels pick strongest/nearest cluster.
- `parseComicScript` letters only the first PAGE block per paste (by design - one canvas
  per page) and reports remaining pages in an assistant card.
- The user's production content lives outside this repo in
  `Documents\Codex\...\outputs\` (scripts, prompt files, manifests for pages 1-15).

### House rules

- The static-site constraint is hard: no build step, no bundler, no server dependencies.
- Lettering standards live in the outputs folder (`Calder_Remnants_Lettering_Standards_v1.md`):
  tails short and quiet, balloons compact, reading order left-to-right top-to-bottom,
  never cover faces/hands/babies/runes.
- Keep commits scoped and messages descriptive; the user reads the log to track who did what.
