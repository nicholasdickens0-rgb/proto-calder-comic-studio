# Publish Proto Calder Comic Studio With GitHub Pages

Proto Calder Comic Studio is a static app. It can run on GitHub Pages without a backend server.

## Option 1 - Simple GitHub Pages Setup

1. Create a new GitHub repository named `proto-calder-comic-studio`.
2. Upload these files from this folder:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `.nojekyll`
   - `README.md`
3. In GitHub, open the repository settings.
4. Go to **Pages**.
5. Set **Source** to `Deploy from a branch`.
6. Select branch `main` and folder `/root`.
7. Save.

GitHub will give you a public URL after it builds.

## Option 2 - Keep It Inside The Current Project Repo

If this whole workspace becomes a GitHub repository, keep the app in:

```text
proto-calder-comic-studio/
```

Then either:

- Enable Pages from the repository root and open `/proto-calder-comic-studio/`, or
- Use the included `.github/workflows/proto-calder-comic-studio-pages.yml` workflow.

## Important Note About Sample Pages

The app does not need hosted sample images. The normal workflow is:

1. Open the GitHub Pages app.
2. Click **Import Image**.
3. Choose a clean comic page PNG from your computer.
4. Letter the page.
5. Export the final PNG.

This keeps private project artwork local unless you choose to upload it.

