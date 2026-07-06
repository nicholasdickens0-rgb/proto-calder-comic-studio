# Proto Calder Comic Studio

A static comic lettering and format tool for Calder's Remnants.

Repository/app name:

```text
proto-calder-comic-studio
```

## Start

### GitHub Pages

This app is designed to run as a static GitHub Pages site. Upload this folder's web files to a GitHub repository named `proto-calder-comic-studio`, then enable GitHub Pages.

### Local Fallback

From this folder, you can also run:

```powershell
node server.js
```

Then open:

```text
http://localhost:5177
```

## Current MVP

- Import a clean comic page image.
- Add speech balloons with editable text.
- Choose Bubble Lab presets for classic, manga, whisper, shout, thought, caption, and rune-glow lettering.
- Tune bubble style, fill, stroke, text color, tail width, wobble, paper texture, and glow.
- Add protected art zones for faces, hands, babies, runes, and key acting.
- Add panel guides.
- Move and resize balloons/zones/guides.
- Drag balloon tail points.
- Check whether balloons overlap protected art zones.
- Export a lettered PNG.
- Save and load a self-contained project JSON file.

## Workflow

1. Load clean page art.
2. Mark protected zones.
3. Add balloons in safe areas.
4. Fix overlap warnings.
5. Export the final lettered page.

## GitHub Pages Files

The static site needs:

- `index.html`
- `styles.css`
- `app.js`
- `.nojekyll`
- `README.md`

`server.js` is only for local fallback testing.
